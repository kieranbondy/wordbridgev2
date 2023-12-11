import React from 'react';
import {Link} from 'react-router-dom';
import './HomePage.css'
import logo from '../../assets/wordBridgeLogo.png'


// simple home page for now, using react routes
export default function HomePage(){
    return (
        <>
        <div className='homeContainer'>
            <img src={logo} alt="logo"/>
            <div className='buttons'>
                <Link to="/game">
                    <button className='startButton'>START</button>
                </Link>
                <Link to="/tutorial">
                    <button className='tutButton'>TUTORIAL</button>
                </Link>
            </div>
        </div>
        </>
    )    
}