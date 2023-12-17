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
                props.pickUpTile(id,letter,false, event.clientX, event.clientY)
                return {...prev, board:newBoard}
            })
        }
    }
    function handleTouch(event){
        console.log("picked up with touch")
        const inner = event.target.innerHTML
        const id = event.target.id.split('_')[2]
        if(inner){
            const touch = event.touches[0];
            props.setGameData((prev) => {
                const [letter, newBoard] = getWholePiece(prev.board, id)
                props.pickUpTile(id,letter,false, touch.clientX, touch.clientY)
                return {...prev, board:newBoard}
            })
            const onTouchMove = (event) => {
                // if (event.cancelable) event.preventDefault(); // Prevent default touch action
                const touch = event.touches[0];
                props.setSelectedTile((prev) => {return {...prev, style:{
                    ...prev.style,
                    display: 'flex',
                    position: 'absolute',
                    left: `${touch.clientX-25}px`,
                    top: `${touch.clientY-25}px`,
                }}});
              };
              
              const onTouchEnd = (event) => {
                const touch = event.changedTouches[0]
                props.setMousePosition({x:touch.clientX, y:touch.clientY, letter_id:event.target.parentElement.parentElement.id})
                event.target.removeEventListener("touchmove", onTouchMove);
                event.target.removeEventListener("touchend", onTouchEnd);
                // handle touchend here
            }

            event.target.addEventListener("touchmove", onTouchMove);
            event.target.addEventListener("touchend", onTouchEnd);
        }
    }
    return (
        <>
    {/* <div>{startArr.map((sq)=>(<div key={uuidv4()}>{sq}</div>))}</div> */}
    
    <div className="board">{board.map((row)=>(
        <div className='row' key={uuidv4()}>
        {row.map((space)=>(
            <div key={uuidv4()} onMouseDown={handleClick} onTouchStart={handleTouch}>{space}</div>
        ))}
        </div>
    ))}</div>
    </>
  )
}
