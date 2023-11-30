import React from 'react'
import './LetterTray.css'
import Tile2 from '../Tile/Tile2';
import { v4 as uuidv4 } from 'uuid';

export default function LetterTray(props) {
  return (
    <div className='tray-container'>
        {props.letters.map((letter,index) => {
            return (
            <div key={uuidv4()} className='tile-container'>
                <Tile2 id={`${letter[0][0].id}_${index}_tile`} index={index} letters={letter} setGameData={props.setGameData} setMousePosition={props.setMousePosition} pickedUp={props.pickedUp}></Tile2>
            </div>
            )
        })}
    </div>
  )
}
