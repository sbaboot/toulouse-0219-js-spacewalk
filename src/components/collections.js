import React from 'react';
import './collections.css';

const Collections = ({ url, name, handleTag, i }) => (
  <div
    role="button"
    tabIndex={i}
    className="allCollections"
    style={{
      backgroundImage: 'url(' + url + ')',
      cursor: 'pointer'
    }}
    onClick={() => handleTag(name)}
  >
    <p>{name}</p>
  </div>
);

export default Collections;
