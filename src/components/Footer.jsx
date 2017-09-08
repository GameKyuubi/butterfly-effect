import React from 'react';
import Divider from 'material-ui/Divider';

import './styles/footer.css';

const Footer = () => (
  <footer className="restrict-width">
    <Divider className="footer-divider" />
    <p className="grow">Code Chrysalis © 2017</p>
  </footer>
);

export default Footer;
