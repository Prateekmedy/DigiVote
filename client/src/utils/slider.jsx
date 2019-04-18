import React, { Component } from 'react';
import Slider from "react-slick";
import "../index.css";

export default class SlideDemo extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1
    };

    let cards = [1,2,3,4,5,6,7,8,9]
    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
         {
          cards.map((item, index) =>
            <div key={index}><h1>{item}</h1></div>
          )   
         }
        </Slider>
      </div>
    );
  }
}

