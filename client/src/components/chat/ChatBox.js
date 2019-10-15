import React from 'react';
import { Row } from 'reactstrap';
import Message from './Message';

const ChatBox = ({ messages, user }) => {
  const renderMessage = (message, index) => {
    message.incoming = message.receiver === user.id;
    // message.incoming = message.sender !== user.id;
    return <Message key={index} message={message} />;
  };
  return <Row className="chat-box">{messages.map(renderMessage)}</Row>;
};

export default ChatBox;
