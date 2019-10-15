import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Input, Button, Form } from 'reactstrap';
import { Error } from 'components';
import Auth from 'Auth';

import Logo from 'assets/chatting.svg';

export default function Login(props) {
  useEffect(() => {
    const { title } = props;
    document.title = title;
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSumbit = e => {
    e.preventDefault();

    axios
      .post('/api/auth', { username, password })
      .then(response => {
        const user = response.data;
        Auth.login(user);
        props.history.push('/');
      })
      .catch(error => {
        if (error.response.data) {
          setError(error.response.data.error);
        }
      });
  };

  return (
    <Container className="col-md-8 col-lg-5 mt-3">
      <Card className="p-4 text-center">
        <img className="mx-auto" src={Logo} alt="logo" width="60%" />
        <h5 className="my-4">تسجيل الدخول</h5>
        <Error error={error} />
        <Form onSubmit={onSumbit}>
          <Input
            name="username"
            placeholder="اسم المستخدم"
            onChange={e => setUsername(e.target.value)}
            value={username}
            autoFocus
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            onChange={e => setPassword(e.target.value)}
            value={password}
            required
          />
          <Button color="primary" className="mb-3" block>
            دخول
          </Button>
          <small>
            <Link to="/register">إنشاء حساب جديد</Link>
          </small>
        </Form>
      </Card>
    </Container>
  );
}
