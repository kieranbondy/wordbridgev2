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
            var letter = props.data[i][j].value
            if(letter === 0){
                board[i].push(<div className='empty-square' id={`${i}_${j}_play`}></div>)
            } else if ( letter === 1){
                board[i].push(<div className='rock-square' id={`${i},${j}`}></div>)
            } else{
                board[i].push(<div className='letter-square' id={`${i}_${j}_${props.data[i][j].id}_play`}>{letter}</div>)
            }
        }
    };

    function getWholePiece(board,id){
        let output = []
        let boardCopy = JSON.parse(JSON.stringify(board));
        let occurences = []
        for(let i=0; i<board.length; i++) {
            let row = []
            let hasValue = false
            for(let j=0; j<board[i].length; j++) {
                let letter = board[i][j]
                if(letter.id === id){
                    hasValue = true
                    boardCopy[i][j] = {id:'',value:0}
                    occurences.push(j)
                    row.push(letter)
                } else {
                    row.push({id:'',value:''})
                }
            }
            if(hasValue){
                output.push(row)
            }
        };
        const minValue = Math.min(...occurences);
        const maxValue = Math.max(...occurences);
        let final = output.map(function(val) {
            return val.slice(minValue,maxValue+1)
        })
        return [final,boardCopy]
    }

    function handleClick(event){
        console.log("picked up")
        const inner = event.target.innerHTML
        const id = event.target.id.split('_')[2]
        if(inner){
            props.setGameData((prev) => {
                const [letter, newBoard] = getWholePiece(prev.board, id)
                props.pickUpTile(id,letter,false)
                return {...prev, board:newBoard}
            })
        }
    }
    return (
        <>
    {/* <div>{startArr.map((sq)=>(<div key={uuidv4()}>{sq}</div>))}</div> */}
    
    <div className="board">{board.map((row)=>(
        <div className='row' key={uuidv4()}>
        {row.map((space)=>(
            <div key={uuidv4()} onMouseDown={handleClick} onTouchStart={handleClick}>{space}</div>
        ))}
        </div>
    ))}</div>
    </>
  )
}
