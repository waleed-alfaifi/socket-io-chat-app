import React from 'react';
import Avatar from './Avatar';

const UserProfie = ({ open, toggle, contact }) => {
  return (
    <div className={open ? 'side-profile open' : 'side-profile'}>
      <div
        className="d-flex align-items-center p-2 bg-light sticky-top clickable"
        onClick={toggle}
      >
        <div>
          <i className="fas fa-arrow-right text-muted ml-3 mr-2" />
        </div>
        <div className="ml-3">
          <Avatar src={contact.avatar} />
        </div>
        <div>{contact.name}</div>
      </div>

      <div className="d-flex flex-column">
        <div className="bg-white px-3 py-2">
          <label className="text-muted">رسالة الحالة</label>
          <p>{contact.about ? contact.about : 'أهلاً بالعالم!'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfie;
