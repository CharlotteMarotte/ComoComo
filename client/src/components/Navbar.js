import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar(props) {
  return (
    <nav className="Comonavbar navbar navbar-expand-sm navbar-light">
      {/* "Logo" */}
      <a className="navbar-brand" href="/">
        ¿Cómo Como?
      </a>
      {/* Hamburger Icon */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menu */}
      <div
        className="collapse navbar-collapse justify-content-end me-auto"
        id="navbarNav"
      >
        <ul className="navbar-nav justify-content-end">
          <li className="nav-item">
            <NavLink to="/" style={{ color: 'black', textDecoration: 'none' }}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/getmeal"
              style={{ color: 'black', textDecoration: 'none' }}
            >
              Get Meal
            </NavLink>
          </li>
        </ul>
        {/* Right-aligned stuff, based on whether user is logged in */}
        {props.user ? (
          <ul className="navbar-nav">
            <li className="nav-item">
              {/* My Favorites button which leads the user to myfavorites page */}
              <NavLink to={'/favorites/'}>
                <button
                  className="nav-item btn btn-light .text-nowrap"
                  onClick={(e) => props.navigateFavoritesCb()}
                  title="show favorites"
                  type="button"
                >
                  {props.user.firstname}'s Favorites 💛
                </button>
              </NavLink>
            </li>
            <li className="nav-item">
              {/* Log out user. Then go to home page. */}
              <NavLink className="nav-link" to="/" onClick={props.logoutCb}>
                Logout
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
