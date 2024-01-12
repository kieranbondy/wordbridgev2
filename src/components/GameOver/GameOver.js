import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import './GameOver.css'

export default function GameOver(){
    const location = useLocation()
    const score = location.state ? location.state.score : null;

    return(
        <>
        <div className='gameOverContainer'>
            <div className='title'>Game Over</div>
            <p>Final Score:</p>
            <h1>{score}</h1>
            <div className='buttons'>
                <Link to="/game">
                    <button className='playAgainButton'>PLAY AGAIN</button>
                </Link>
                <Link to="/">
                    <button className='homeButton'>HOME</button>
                </Link>
            </div>
        </div>
        </>
    )
}