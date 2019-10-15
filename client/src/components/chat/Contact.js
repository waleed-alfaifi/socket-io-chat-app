import React from 'react';
import { Badge } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';

import Avatar from 'components/Avatar';

const Contact = ({
  contact: { avatar, name, status },
  message,
  unseenCount,
  isCurrentContact,
}) => {
  return (
    <div className={`contact ${isCurrentContact ? 'active' : ''} p-2`}>
      <div className="ml-3">
        <Avatar src={avatar} />
        {status === true ? (
          <span>
            <i className="fa fa-circle online-badge small" />
          </span>
        ) : (
          ''
        )}
      </div>
      <div className="d-flex flex-column align-items-start">
        <div>{name}</div>
        <div className="small">
          {message ? message.content : 'انقر هنا لبدء المحادثة'}
        </div>
      </div>
      <div className="flex-grow-1 text-left">
        <div className="small text-muted">
          {message
            ? moment(message.date)
                .locale('ar')
                .format('dddd: hh:mm a')
            : ''}
        </div>
        {unseenCount > 0 ? <Badge color="success">{unseenCount}</Badge> : ''}
      </div>
    </div>
  );
};

export default Contact;
