import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import AppRoute from './AppRoute';
import Auth from './Auth';

import { Chat, NotFound, Register, Login, Password } from 'views';

function App() {
  useEffect(() => {
    Auth.init();
  });

  return (
    <div className="container-fluid">
      <Router>
        <Switch>
          <AppRoute
            path="/"
            component={Chat}
            exact
            can={Auth.user}
            redirect="/login"
            title="صفحة الدردشة"
          />
          <AppRoute
            path="/password"
            component={Password}
            can={Auth.user}
            redirect="/login"
            title="تغيير كلمة المرور"
          />
          <AppRoute
            path="/register"
            component={Register}
            can={Auth.guest}
            title="إنشاء حساب جديد"
          />
          <AppRoute
            path="/login"
            component={Login}
            can={Auth.guest}
            title="تسجيل الدخول"
          />
          <AppRoute component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
