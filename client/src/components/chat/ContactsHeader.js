import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Avatar } from 'components';
import Auth from 'Auth';

const ContactsHeader = ({ toggle, user, history }) => {
  return (
    <Row className="bg-light d-flex align-items-center p-2 sticky-top">
      <div className="ml-3" onClick={toggle}>
        <Avatar src={user.avatar} />
      </div>
      <div>جهات الاتصال</div>
      <div className="flex-grow-1 nav-link">
        <UncontrolledDropdown>
          <DropdownToggle tag="a">
            <i className="fas fa-bars clickable"></i>
          </DropdownToggle>
          <DropdownMenu className="text-right">
            <DropdownItem onClick={toggle}>الملف الشخصي</DropdownItem>
            <DropdownItem onClick={Auth.logout}>تسجيل الخروج</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => history.push('/password')}>
              تغيير كلمة المرور
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Row>
  );
};

export default withRouter(ContactsHeader);
