import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { Row } from 'reactstrap';
import { Avatar } from 'components';

const ChatHeader = ({
  contact,
  typingSender,
  changeIsChatting,
  toggleViewProfile,
}) => {
  const getStatus = status => {
    if (typingSender) return 'يكتب الآن...';
    if (!status) return '';
    if (status === true) return 'متصل الآن';
    return moment(status)
      .locale('ar')
      .fromNow();
  };

  return (
    <Row className="bg-light align-items-center p-2 sticky-top">
      <div className="clickable" onClick={() => changeIsChatting()}>
        <i className="fas fa-arrow-right text-muted ml-3 mr-2 d-md-none" />
      </div>
      <div
        className="d-flex align-items-center ml-3"
        onClick={() => toggleViewProfile()}
      >
        <Avatar src={contact.avatar} />
      </div>
      <div className="d-flex flex-column align-items-start">
        <div>{contact ? contact.name : ''}</div>
        <small>{getStatus(contact.status)}</small>
      </div>
    </Row>
  );
};

export default ChatHeader;
