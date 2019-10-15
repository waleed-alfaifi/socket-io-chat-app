import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Input, Button, Form } from 'reactstrap';
import { Error } from 'components';

import Logo from 'assets/chatting.svg';

export default function Password(props) {
  useEffect(() => {
    const { title } = props;
    document.title = title;
  });

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const onSumbit = e => {
    e.preventDefault();

    axios
      .post('/api/account/password', { password, newPassword })
      .then(() => {
        props.history.push('/');
      })
      .catch(error => {
        if (error.response.data) {
          console.log('Error\n', error.response.data);
          setError(error.response.data.error);
        }
      });
  };

  return (
    <Container className="col-md-8 col-lg-5 mt-3">
      <Card className="p-4 text-center">
        <img className="mx-auto" src={Logo} alt="logo" width="60%" />
        <h5 className="my-4">تغيير كلمة المرور</h5>
        <Error error={error} />
        <Form onSubmit={onSumbit}>
          <Input
            type="password"
            name="password"
            placeholder="كلمة المرور القديمة"
            onChange={e => setPassword(e.target.value)}
            value={password}
            autoFocus
            required
          />
          <Input
            type="password"
            name="newPassword"
            placeholder="كلمة المرور الجديدة"
            onChange={e => setNewPassword(e.target.value)}
            value={newPassword}
            required
          />
          <Button color="primary" className="mb-3" block>
            تغيير
          </Button>
          <small>
            <Link to="/">عودة</Link>
          </small>
        </Form>
      </Card>
    </Container>
  );
}
