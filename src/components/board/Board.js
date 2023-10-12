import React from 'react'
import './Board.css'
import { v4 as uuidv4 } from 'uuid';

export default function Board(props) {
    let board =[];
    // let startArr = [];
    let height = props.data.length
    //Sorting the grid into rocks, open spaces, and filled spaces
    for (let i=0; i<height; i++){
        board.push([])
        let width = props.data[i].length
        // startArr.push(i === props.start ? <div className='start-square'></div>:<div className='empty-start-square'></div>)
        for (let j=0; j<width; j++){
            var letter = props.data[i][j]
            if(letter === 0){
                board[i].push(<div className='empty-square' id={`${i}_${j}_play`}></div>)
            } else if ( letter === 1){
                board[i].push(<div className='rock-square' id={`${i},${j}`}></div>)
            } else{
                board[i].push(<div className='letter-square' id={`${i}_${j}_play`}>{letter}</div>)
            }
        }
    };

    function handleClick(event){
        const inner = event.target.innerHTML
        const [i,j,extra] = event.target.id.split('_')
        console.log(event)
        if(inner){
            props.setGameData((prev) => {
                const newTray = prev.tray;
                const newBoard = prev.board;
                const temp = prev.board[i][j]
                newBoard[i][j] = 0;
                newTray.push([[inner]])
                return {...prev, tray:newTray, board:newBoard, pickedUpTile:[`${temp}_${newTray.length-1}`,event.clientX, event.clientY]}
            })
        }
    }
    return (
        <>
    {/* <div>{startArr.map((sq)=>(<div key={uuidv4()}>{sq}</div>))}</div> */}
    <div>{board.map((row)=>(
        <div className='row' key={uuidv4()}>
        {row.map((space)=>(
            <div key={uuidv4()} onMouseDown={handleClick} onTouchStart={handleClick}>{space}</div>
        ))}
        </div>
    ))}</div>
    </>
  )
}
