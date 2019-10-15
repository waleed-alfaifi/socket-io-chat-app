import React, { useState } from 'react';
import { Row, Input } from 'reactstrap';
import Contact from './Contact';

const Contacts = ({ contacts, messages, selectContact, currentContact }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderContacts = (contact, index) => {
    const contactName = contact.name.toLowerCase();
    if (!contactName.includes(searchQuery.toLowerCase())) return;

    let contactMessages = messages.filter(
      message =>
        message.sender === contact.id || message.receiver === contact.id
    );

    let lastMessage = contactMessages[contactMessages.length - 1];

    let unseenMsgs = messages.filter(
      message => !message.seen && message.sender === contact.id
    );

    let unseenCount = unseenMsgs.length;

    return (
      <div className="w-100" key={index} onClick={() => selectContact(contact)}>
        <Contact
          contact={contact}
          message={lastMessage}
          unseenCount={unseenCount}
          isCurrentContact={
            currentContact ? currentContact.id === contact.id : false
          }
        />
      </div>
    );
  };

  return (
    <Row>
      <div className="p-2 w-100">
        <div className="mt-2">
          <Input
            className="search-input"
            placeholder="بحث عن جهات الاتصال"
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
        {contacts.map(renderContacts)}
      </div>
    </Row>
  );
};

export default Contacts;
