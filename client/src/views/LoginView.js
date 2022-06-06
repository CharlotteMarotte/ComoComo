import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './LoginView.css';

function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleChange(event) {
    let { name, value } = event.target;
    switch (name) {
      case 'usernameInput':
        setUsername(value);
        break;
      case 'passwordInput':
        setPassword(value);
        break;
      default:
        break;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.loginCb(username, password);
  }

  return (
    <div className="LoginView row col-4 offset-4">
      <h2>Login</h2>

      {props.loginError && (
        <div className="alert alert-warning text-center">{props.loginError}</div>
      )}
      <form className="body-background" onSubmit={handleSubmit}>
        <div className="container-fluid justify-content-center align-items-center h-100">
          <div className="card p-3 text-center py-4">
            <div className="mt-3 px-3">
              <input
                className="form-control"
                name="usernameInput"
                placeholder="Username"
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 px-3">
              <input
                className="form-control"
                name="passwordInput"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 d-grid px-3">
              <button className="btn btn-primary btn-block btn-signup text-uppercase">
                <span>Sign in</span>
              </button>
            </div>
            {/* <!-- Register buttons --> */}
            <div className="text-center col-6 offset-3 mt-3">
              <p>
                Not a member? <NavLink to="/signup">Register</NavLink>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginView;
