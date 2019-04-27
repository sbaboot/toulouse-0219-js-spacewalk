import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Title from './title';
import './Apod.css';

class Apod extends Component {
  constructor() {
    super();
    this.state = {
      image: {}
    };
  }
  // Appel de l'API de la Nasa Image of the day

  componentDidMount() {
    fetch(
      'https://api.nasa.gov/planetary/apod?api_key=638oh8hjQBkop6DfIzCRlVqF4q0vyFJ2yvGX6KqZ'
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          image: data
        });
      });
  }

  render() {
    // Décomposition du state
    const { image } = this.state;

    return (
      <div className="container-fluid bg-gradient">
        <div className="container-apod mx-auto">
          <div className="p-4 mx-auto">
            <Title title="Astronomy Picture of the Day" idStyle="titleSecondWhite" className="text-center" />

          </div>
          <div className="row pb-5">
            <div className="col-md-7 pb-3">
              {/* // Si type vidéo, afficher le player sinon afficher l'image */}
              {image.media_type === 'video' ? <ReactPlayer url={image.url} /> : <img src={image.url} alt={image.title} className="img-apod" />}
            </div>
            <div className="col-md-5 text-white">
              <h3>{image.title}</h3>
              <p>{image.date}</p>
              <p>{image.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Apod;
