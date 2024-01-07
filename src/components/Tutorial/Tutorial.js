import React from 'react';
import {Link} from 'react-router-dom';
import './Tutorial.css'
import stepOne from '../../assets/tut1gif-ezgif.com-crop.gif'
import stepTwo from '../../assets/staticTutONE.png'

export default function Tutorial(){
    return (
        <>
        <div className='tutorialContainer'>
            <div className='pageTitle'>
                Tutorial
            </div>
            <div className='tutorials'>
            <div className='tutorialTwo'>
                    <img className='tutorialTwoImage' src={stepTwo}/>
                    <p>The word must start in the left most column and end on the indicated square.</p>
                </div>
                
                <div className='barrier'></div>

                <div className='tutorialOne'>
                    <img className='tutorialOneGif' src={stepOne}/>
                    <p>Drag tiles from the letter bank onto the board to form valid words.</p>
                </div>
            </div>
            <div className='buttons'>
                <Link to="/">
                <button className='back-button'>BACK</button>
                </Link>
            </div>
        </div>
        </>
    )
}