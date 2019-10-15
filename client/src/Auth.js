import axios from 'axios';

const Auth = {
  login: user => {
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = user.token;
  },
  init: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.defaults.headers.common['Authorization'] = user ? user.token : '';
  },
  user: () => localStorage.getItem('user') !== null,
  guest: () => localStorage.getItem('user') === null,
  setUser: updatedUser => {
    const user = JSON.parse(localStorage.getItem('user'));
    updatedUser.token = user.token;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
  getToken: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? user.token : '';
  },
  logout: () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('user');
    window.location.reload();
  },
};

export default Auth;
