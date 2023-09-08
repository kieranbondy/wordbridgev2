import React from 'react'
import Tile from '../Tile/Tile'
import './LetterTray.css'
import { v4 as uuidv4 } from 'uuid';

export default function LetterTray(props) {
  return (
    <div className='tray-container'>
        {props.letters.map((letter,index) => {
            return (
            <div key={uuidv4()} className='tile-container'>
                <Tile index={index} letter={letter} setMousePosition={props.setMousePosition}></Tile>
            </div>
            )
        })}
    </div>
  )
}
