import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Card, Button, Input, Container } from 'reactstrap';
import { Error } from 'components';
import Auth from 'Auth';

import Logo from 'assets/chatting.svg';

export default function Register(props) {
  useEffect(() => {
    const { title } = props;
    document.title = title;
  });

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSumbit = e => {
    e.preventDefault();

    axios
      .post('/api/auth/register', { name, username, password })
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
      <Card className="text-center p-4">
        <img className="mx-auto" src={Logo} alt="logo" width="60%" />
        <Form onSubmit={onSumbit}>
          <h5 className="my-4">إنشاء حساب جديد</h5>
          <Error error={error} />
          <Input
            value={name}
            name="name"
            type="text"
            placeholder="الاسم"
            onChange={e => setName(e.target.value)}
            autoFocus
            required
          />
          <Input
            value={username}
            name="username"
            type="text"
            placeholder="اسم المستخدم"
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            value={password}
            name="password"
            type="password"
            placeholder="كلمة المرور"
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button color="primary" block className="mb-3">
            إنشاء
          </Button>
          <small>
            <Link to="/login">تسجيل الدخول</Link>
          </small>
        </Form>
      </Card>
    </Container>
    // <div className="">
    // <Container className="mt-2">
    //   <Row className="text-center">
    //     <Col sm="6">
    //       <Card className="p-4">
    //         <Form onSubmit={onSumbit}>
    //           <h5 className="mt-4">إنشاء حساب جديد</h5>
    //           <Error error={error} />
    //           <Input
    //             value={name}
    //             name="name"
    //             type="text"
    //             placeholder="الاسم"
    //             onChange={e => setName(e.target.value)}
    //             autoFocus
    //             required
    //           />
    //           <Input
    //             value={username}
    //             name="username"
    //             type="email"
    //             placeholder="اسم المستخدم"
    //             onChange={e => setUsername(e.target.value)}
    //             required
    //           />
    //           <Input
    //             value={password}
    //             name="password"
    //             type="password"
    //             placeholder="كلمة المرور"
    //             onChange={e => setPassword(e.target.value)}
    //             required
    //           />
    //           <Button color="primary" block className="mb-3">
    //             إنشاء
    //           </Button>
    //           <small>
    //             <Link to="/login">تسجيل الدخول</Link>
    //           </small>
    //         </Form>
    //       </Card>
    //     </Col>
    //   </Row>
    // </Container>
    // </div>
  );
}
