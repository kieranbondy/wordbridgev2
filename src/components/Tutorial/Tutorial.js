import React from 'react';
import {Link} from 'react-router-dom';
import './Tutorial.css'
import stepOne from '../../assets/tut1gif-ezgif.com-crop.gif'
import stepTwo from '../../assets/staticTutONE.png'
import stepThree1 from '../../assets/tut3right.png'
import stepThree2 from '../../assets/tut3wrong.png'
import scoreGif from '../../assets/score.gif'

export default function Tutorial(){
    return (
        <>
        <div className='tutorialContainer'>
            <div className='pageTitle'>
                Tutorial
            </div>
            <div className='description'>
                <p>Welcome to WordBridge! A fun word game where you build words out of letter tiles. Here is a short tutorial to get you started:</p>
            </div>
            <div className='tutorials'>
                <div className='gameplayTitle'>Gameplay</div>
                <div className='rowOne'>
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

                <div className='rowOne'>
                    <div className='tutorialThree'>
                        <img className='tutorialThreeR' src={stepThree1}></img>
                        <p>Construct your words so that each letter forms a continuous path.</p>
                    </div>
                    <div className='barrier'></div>
                    <div className='tutorialThree'>
                        <img className='tutorialThreeI' src={stepThree2}></img>
                        <p>Although both words above are valid, the solution would not be correct.</p>
                    </div>
                </div>
                <div className='scoringTitle'>Scoring</div>
                <div className='scoringTutorial'>
                    <p>WordBridge has a timer and a score at the top of the page. Crafting more difficult words leads to a higher score. If the timer runs out: Game Over!</p>
                    <img className='scoringGif' src={scoreGif}/>
                    <p>Have Fun!</p>
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