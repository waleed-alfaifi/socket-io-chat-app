import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AppRoute = ({
  component: Component,
  can = () => true,
  redirect = '/',
  title,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        can() ? (
          <Component
            title={title ? `محادثاتي | ${title}` : 'محادثاتي'}
            {...props}
          />
        ) : (
          <Redirect to={redirect} />
        )
      }
    ></Route>
  );
};

export default AppRoute;
