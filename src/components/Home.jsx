import React from 'react';

import './styles/home.css';

const Home = () => (
  <div id="home" className="restrict-width">
    <h1>{'Relay'}</h1>
    <p>{'World\'s first autonomous drone delivery routing system.'}</p>
    <h2>{'Instructions'}</h2>
    <ol>
      <li>{'Enter pickup and drop-off location address into the search bars in \'Send\' tab.'}</li>
      <ul>
        <li>{'eg. Moto-Azabu 3-1-35 Moto-Azabu Minato Ku Tokyo'}</li>
        <li>{'eg. Rakuten Crimson House'}</li>
      </ul>
      <li>{'Click \'Search\' to route delivery. Confirm that the path is OK.'}</li>
      <li>{'Click \'Send\' to start delivery. '}<b>{'Keep tracking number for reference.'}</b></li>
      <li>{'Enter tracking number into search bar in \'Track\' tab to track the deliery.'}</li>
    </ol>
  </div>
);

export default Home;
