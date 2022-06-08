import React from 'react';
import { Link } from 'react-router-dom';
import "./HomeView.css";
import fridgeImg from "../images/fridge.png"

function HomeView() {
    return (
      <div className="HomeView">
        <h1>WHAT'S IN MY FRIDGE?</h1>
        <h4 className="text-center">Click on the fridge to insert ingredients and get your meal!</h4>
        <div className="row text-center">
          <div className="col-offset-5">
            <Link to={'/getmeal'}>
            <img src={fridgeImg} alt="Big Fridge Vector - Refrigerator@seekpng.com" />
            </Link>
          </div>
        </div>
      </div>   
    );  
}

export default HomeView;