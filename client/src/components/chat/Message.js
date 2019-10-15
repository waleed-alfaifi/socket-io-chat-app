import React from 'react';
// import moment from 'moment';
import moment from 'moment/min/moment-with-locales';

const Message = ({ message }) => {
  return (
    <div
      className={message.incoming ? 'message-item incoming' : 'message-item'}
    >
      <div className="m-1 mr-2">
        <div>{message.content}</div>
        <span className="small text-muted">
          {moment(message.date)
            .locale('ar')
            .format('D MMM hh:mm a')}
        </span>
      </div>
    </div>
  );
};

export default Message;
