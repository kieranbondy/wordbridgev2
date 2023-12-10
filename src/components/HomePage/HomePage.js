import React from 'react';
import {Link} from 'react-router-dom';
import './HomePage.css'


// simple home page for now, using react routes
export default function HomePage(){
    return (
        <>
        <div className='homeContainer'>
            <h1>Welcome to WordBridge!</h1>
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