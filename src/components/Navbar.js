/* eslint-disable no-alert */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

function Navbar({ account }) {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-1 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="https://rumsan.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Rumsan Academy
      </a>
      {account ? <Button variant="light">{account}</Button> : <Button variant="danger">N/A</Button>}
    </nav>
  );
}
Navbar.propTypes = {
  account: PropTypes.string.isRequired,
};

export default Navbar;
