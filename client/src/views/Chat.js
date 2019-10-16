import React, { Component } from 'react';
import socketIO from 'socket.io-client';
import { Row, Spinner } from 'reactstrap';
import {
  ContactsHeader,
  Contacts,
  ChatHeader,
  ChatBox,
  MessageForm,
  UserProfile,
  EditProfile,
} from 'components';
import ChattingWelcomeScreen from './ChattingWelcomeScreen';

import Auth from '../Auth';

class Chat extends Component {
  state = {
    user: null,
    currentContact: {},
    contacts: [],
    messages: [],
    socket: null,
    connected: false,
    isChatting: false,
    isViewingProfile: false,
    isEditingProfile: false,
    typingSender: null,
    typingTimout: null,
  };

  componentDidMount() {
    const { title } = this.props;
    document.title = title;
    this.initSocketIOServer();
  }

  initSocketIOServer = () => {
    const socket = socketIO({
      query: `token=${Auth.getToken()}`,
    });

    socket.on('data', (user, messages, contacts, onlineUsers) => {
      this.setState({
        user,
        messages,
        contacts,
        socket,
        connected: true,
      });

      this.updateStatus(onlineUsers);
    });

    socket.on('new_user', newUser => {
      let updatedContacts = this.state.contacts.concat(newUser);
      this.setState({ contacts: updatedContacts });
    });

    socket.on('message', message => this.onReceiveMessage(message));

    socket.on('user_status', onlineUser => {
      this.updateStatus(onlineUser);
    });

    socket.on('update_user', this.onUpdateUserProfile);

    socket.on('typing', sender => this.onTyping(sender));

    socket.on('disconnect', () => this.setState({ connected: false }));

    socket.on('error', error => {
      if (error === 'Authorization failed') {
        Auth.logout();
      }
    });
  };

  onReceiveMessage = message => {
    const { socket, currentContact } = this.state;

    if (message.sender === currentContact.id) {
      socket.emit('seen', currentContact.id);
      message.seen = true;
    }

    const messages = this.state.messages.concat(message);
    this.setState({ messages });
  };

  onTyping = sender => {
    const { currentContact, typingTimout } = this.state;

    // Change isTyping state only if the current contact is the one typing.
    if (sender === currentContact.id) {
      this.setState({ typingSender: sender });

      clearTimeout(typingTimout);

      const timeout = setTimeout(
        () => this.setState({ typingSender: null }),
        3000
      );

      this.setState({ typingTimout: timeout });
    }
  };

  updateStatus = onlineUsers => {
    const { contacts } = this.state;

    contacts.forEach(contact => {
      if (onlineUsers[contact.id]) {
        contact.status = onlineUsers[contact.id];
      }
    });

    this.setState({ contacts });
  };

  onUpdateUserProfile = updatedUser => {
    // console.log(user);
    const { user, contacts } = this.state;
    if (updatedUser.id === user.id) {
      this.setState({ user: updatedUser });
      Auth.setUser(updatedUser);
      return;
    }

    this.setState({
      contacts: contacts.map((contact, index) => {
        if (updatedUser.id === contact.id) {
          // Update the contact's info.
          contacts[index] = updatedUser;
          // Keep the contact's status as it is.
          contacts[index].status = contact.status;
        }

        return contacts[index];
      }),
    });
  };

  /* Rendering methods */

  renderChat = () => {
    const { currentContact, messages, user } = this.state;
    if (!currentContact) {
      return;
    }
    let contactMessages = messages.filter(
      message =>
        message.sender === currentContact.id ||
        message.receiver === currentContact.id
    );
    return <ChatBox user={user} messages={contactMessages} />;
  };

  render() {
    const {
      user,
      contacts,
      messages,
      currentContact,
      connected,
      isChatting,
      isViewingProfile,
      isEditingProfile,
      typingSender,
    } = this.state;

    if (!connected) {
      return (
        <div className="loader">
          <p>الرجاء الانتظار ريثما نؤسس الاتصال مع الخادم...</p>
          <Spinner color="secondary" />
        </div>
      );
    }

    return (
      <Row>
        <div
          className={`col-12 col-lg-4 d-md-block ${isChatting ? 'd-none' : ''}`}
          id="contacts-section"
        >
          {!isViewingProfile && !isEditingProfile && (
            <React.Fragment>
              <ContactsHeader user={user} toggle={this.toggleEditProfile} />
              <Contacts
                contacts={contacts}
                messages={messages}
                selectContact={this.selectContact}
                currentContact={currentContact}
              />
            </React.Fragment>
          )}
          <UserProfile
            toggle={this.toggleViewProfile}
            open={isViewingProfile}
            contact={currentContact}
          />
          <EditProfile
            user={user}
            toggle={this.toggleEditProfile}
            open={isEditingProfile}
          />
        </div>

        <div
          className={`col-12 col-lg-8 d-md-flex ${
            !isChatting ? 'd-none' : 'd-flex'
          }`}
          id="messages-section"
        >
          {isViewingProfile && (
            <ChattingWelcomeScreen secondaryMsg="انقر على زر العودة للخلف للعودة إلى المحادثة" />
          )}

          {!isChatting && !isViewingProfile && (
            <ChattingWelcomeScreen
              mainMsg="مرحباً بك في تطبيق محادثاتي"
              secondaryMsg="انقر على أحد جهات الاتصال لبدء المحادثة"
            />
          )}

          {isChatting && (
            <React.Fragment>
              <ChatHeader
                contact={currentContact}
                typingSender={typingSender}
                changeIsChatting={this.changeIsChatting}
                toggleViewProfile={this.toggleViewProfile}
              />
              {this.renderChat()}
              <MessageForm
                onSendMessage={this.onSendMessage}
                sendIsTyping={this.sendIsTyping}
              />
            </React.Fragment>
          )}
        </div>
      </Row>
    );
  }

  /* Methods passed to childeren */
  selectContact = contact => {
    this.setState({
      currentContact: contact,
      isChatting: true,
    });

    // Send 'seen' event when the user opens a chat (hence, sees the messages).
    const { socket, messages } = this.state;
    socket.emit('seen', contact.id);

    this.setState({
      messages: messages.map(message => {
        // Filter out messages sent by the current contact only.
        if (message.sender === contact.id) {
          message.seen = true;
        }

        return message;
      }),
    });
  };

  changeIsChatting = () => {
    this.setState({ isChatting: false, currentContact: {} });
  };

  toggleViewProfile = () => {
    this.setState(prevState => {
      return {
        isViewingProfile: !prevState.isViewingProfile,
        isChatting: !prevState.isChatting,
      };
    });
  };

  toggleEditProfile = () => {
    this.setState(prevState => {
      return {
        isEditingProfile: !prevState.isEditingProfile,
      };
    });
  };

  onSendMessage = message => {
    const { socket } = this.state;
    const { id } = this.state.currentContact;

    // If no contact is chosen for chatting, no need to continue.
    if (!id) return;

    message.receiver = id;
    const messages = this.state.messages.concat(message);
    this.setState({ messages });
    socket.emit('message', message);
  };

  sendIsTyping = () => {
    const { socket } = this.state;
    const receiver = this.state.currentContact.id;
    socket.emit('typing', receiver);
  };
}

export default Chat;
