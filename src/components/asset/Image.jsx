import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  RedditShareButton,
  TumblrShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
} from 'react-share';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import React from 'react';
import Title from '../title';


// Affichage de la page de l'image avec les détails
const Image = (
  {
    description, href, title, date, keywords
  }
) => (
    <div className='container'>
      <Link to="/search">
        <div className="btn btn-light mt-4">Back to results</div>
      </Link>
      <div className="text-center row mx-auto">
        <div className="col">
          <Title title={title} idStyle="titleSecond" />
          <p>{date}</p>
          <div>
            {/* Affichage de chaque mot-clé dans un badge */}
            {keywords[0] && keywords[0].map(keyword => (
              <div className="badge badge-primary mr-1">{keyword}</div>
            ))}
          </div>
          <div>
            <p>{description}</p>
            <img className="shadow p-3 mb-3 bg-white rounded img-fluid" alt={title} src={href} />
          </div>
          <div className="row text-center mx-auto d-flex justify-content-center mb-5">
            <div>
              <FacebookShareButton url={href}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>
            <div>
              <TwitterShareButton url={href} title={title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>
            <div>
              <LinkedinShareButton url={href} title={title}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
            <div>
              <WhatsappShareButton url={href} title={title}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
            <div>
              <PinterestShareButton url={href} media={href} description={title}>
                <PinterestIcon size={32} round />
              </PinterestShareButton>
            </div>
            <div>
              <RedditShareButton url={href} title={title}>
                <RedditIcon size={32} round />
              </RedditShareButton>
            </div>
            <div>
              <TumblrShareButton url={href} title={title}>
                <TumblrIcon size={32} round />
              </TumblrShareButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

Image.propTypes = {
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  keywords: PropTypes.string.isRequired
};

export default Image;
