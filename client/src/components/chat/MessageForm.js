import React, { useState } from 'react';
import moment from 'moment';
import { Input } from 'reactstrap';

const MessageForm = ({ onSendMessage, sendIsTyping }) => {
  const [lastTyping, setLastTyping] = useState(false);
  const [message, setMessage] = useState('');

  const onChangeMessageHandler = e => {
    setMessage(e.target.value);

    // Send events of typing every two seconds.
    if (!lastTyping || moment() - lastTyping > 2000) {
      setLastTyping(moment());
      sendIsTyping();
    }
  };

  const sendMessage = () => {
    if (!message) return;
    const storedMessage = {
      content: message,
      date: new Date().getTime(),
    };

    onSendMessage(storedMessage);
    setMessage('');
  };

  return (
    <div className="d-flex align-items-center py-2">
      <Input
        className="message-textarea"
        type="textarea"
        rows="1"
        onChange={onChangeMessageHandler}
        value={message}
        placeholder="أدخل رسالتك هنا"
      />
      <div className="clickable" onClick={sendMessage}>
        <i className="fas fa-paper-plane text-muted mr-3 clickable"></i>
      </div>
    </div>
  );
};

export default MessageForm;
