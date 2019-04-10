import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/style-search.css';
// Affichage de la card image dans les résultats
const Image = item => (
  <div className="col col-md-3">
    {/* Début de la card */}
    <div className="card cardStyle m-1">
      {/* Lien sur l'image */}
      <Link to={`/asset/${item.id}`}>
        <img className="mr-3 card-img-top display-search" alt={item.title} src={item.thumb} />
      </Link>
      <div className="card-body">
        {/* Type du média affiché dans un badge */}
        <div className="badge badge-pill badge-warning">{item.type}</div>
        {/* Lien sur le titre */}
        <Link to={`/asset/${item.id}`}>
          <h5 className="card-text">{item.title}</h5>
        </Link>
        {/* Date de publication */}
        <p>{item.date}</p>
        <div>
          {/* Affichage de chaque mot-clé dans un badge */}
          {item.keywords[0].map(keyword => (
            <div className="badge badge-primary mr-1">{keyword}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


export default Image;
