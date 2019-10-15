import React from 'react';
import { Form, Input, Button } from 'reactstrap';
import Error from 'components/Error';
import Avatar from 'components/Avatar';
import axios from 'axios';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      name: user.name,
      about: user.about,
      remaingCharsName: user.name ? 20 - user.name.length : 20,
      remaingCharsAbout: user.about ? 100 - user.about.length : 100,
    };
    this.fileUpload = React.createRef();
  }

  showFileUpload = () => {
    this.fileUpload.current.click();
  };

  onImageChange = e => {
    const { files } = e.target;
    if (files && files[0]) {
      this.setState({
        image: URL.createObjectURL(files[0]),
        avatar: files[0],
      });
    }
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    });
  };

  onKeyUp = () => {
    const { name, about } = this.state;
    this.setState({
      remaingCharsName: name ? 20 - name.length : 20,
      remaingCharsAbout: about ? 100 - about.length : 100,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { toggle } = this.props;
    const { name, about, avatar } = this.state;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    if (avatar) {
      data.append('avatar', avatar, avatar.name);
    }

    axios
      .post('/api/account/', data)
      .then(toggle)
      .catch(error => {
        this.setState({ error: error.response.data.message });
      });
  };

  onClose = () => {
    const { user, toggle } = this.props;
    this.setState({
      image: false,
      name: user.name,
      about: user.about,
    });
    toggle();
  };

  render() {
    const { open, user } = this.props;
    const {
      name,
      about,
      image,
      error,
      remaingCharsName,
      remaingCharsAbout,
    } = this.state;
    return (
      <div className={open ? 'side-profile open' : 'side-profile'}>
        <div className="nav-link clickable" onClick={this.onClose}>
          <i className="fa fa-arrow-right" />
        </div>

        <div className="d-flex flex-column">
          <div className="text-center">الملف الشخصي</div>
          <Form onSubmit={this.onSubmit}>
            <Error error={error} />

            <div className="text-center my-2" onClick={this.showFileUpload}>
              <Avatar src={user.avatar} file={image} />
            </div>

            <input
              type="file"
              ref={this.fileUpload}
              onChange={this.onImageChange}
              className="d-none"
            />

            <div className="bg-white p-3">
              <div className="form-group">
                <label className="text-muted">الاسم</label>
                <Input
                  value={name}
                  name="name"
                  onChange={this.onChange}
                  onKeyUp={this.onKeyUp}
                  required
                  autoComplete="off"
                />
                <small
                  className={`${
                    remaingCharsName < 0 ? 'text-danger' : 'text-muted'
                  }`}
                >
                  متبقي: {remaingCharsName}
                </small>
              </div>

              <div className="form-group">
                <label className="text-muted">رسالة الحالة</label>
                <Input
                  value={about}
                  name="about"
                  onChange={this.onChange}
                  onKeyUp={this.onKeyUp}
                  autoComplete="off"
                />
                <small
                  className={`${
                    remaingCharsAbout < 0 ? 'text-danger' : 'text-muted'
                  }`}
                >
                  متبقي: {remaingCharsAbout}
                </small>
              </div>

              <div className="form-group">
                <Button block className="mt-3">
                  حفظ
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditProfile;
