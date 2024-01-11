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
            var point_val = props.data[i][j].point

            if(letter === 0){
                board[i].push(<div className={props.data[i][j].final ? 'square empty-square-final':'square empty-square'} id={`${i}_${j}_play`}></div>)
            }
            else if ( letter === 1){
                board[i].push(<div className='square rock-square' id={`${i},${j}`}></div>)
            } else {
                checkMatchedTile(i, j, props.data)
                board[i].push(
                <div style={checkMatchedTile(i, j, props.data)} className={props.data[i][j].final ? 'letter-square-final':'letter-square'} id={`${i}_${j}_${props.data[i][j].id}_play`}>
                    <div className='tile-divider'></div>
                    <div className='tile-value'>{letter}</div>
                    <div className='tile-point'>{point_val}</div>
                    </div>)
            }
        }
    };

    function checkMatchedTile(row, col, data){
        let borderRadius = ['7px','7px','7px','7px']
        let borderWidth = ['4px','4px','4px','4px']
        let height = props.isPhone ? 44 : 50
        let width = props.isPhone ? 44 : 50
        let marginleft = '2px'
        let marginright = '2px'
        let margintop = '2px'
        let marginbottom = '2px'
        let paddingtop = '0px'

        const currentID = data[row][col].id

        //Checks if there is a tile with matching ID to the right
        if (col < data[row].length - 1){
            const rightID = data[row][col + 1].id
            if (currentID === rightID){
                borderRadius[1] = '0px'
                borderRadius[2] = '0px'
                borderWidth[1] = '0px'
                marginright = '0px'
                width += 6
            }
        }

        //Checks if there is a tile with matching ID to the left
        if (col > 0){
            const leftID = data[row][col - 1].id
            if (currentID === leftID){
                borderRadius[0] = '0px'
                borderRadius[3] = '0px'
                borderWidth[3] = '0px'
                marginleft = '0px'
                width += 6
            }
        }

        if (row < data.length-1){
            const belowID = data[row+1][col].id
            if (currentID === belowID){
                borderRadius[2] = '0px'
                borderRadius[3] = '0px'
                borderWidth[2] = '0px'
                height += 6
                marginbottom = '0px'
            }
        }

        if (row > 0){
            const aboveID = data[row-1][col].id
            if (currentID === aboveID){
                borderRadius[0] = '0px'
                borderRadius[1] = '0px'
                borderWidth[0] = '0px'
                height += 6
                margintop = '0px'
            }
        }

        return{
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: borderRadius.join(' '),
            borderWidth: borderWidth.join(' '),
            borderStyle: 'solid',
            backgroundColor: "#ffe27a",
            display: 'flex',
            marginRight: marginright,
            marginLeft: marginleft,
            marginBottom: marginbottom,
            marginTop: margintop,
            paddingTop: paddingtop
        }
    }

    function getWholePiece(board,id){
        let output = []
        let boardCopy = JSON.parse(JSON.stringify(board));
        let occurences = []
        for(let i=0; i<board.length; i++) {
            let row = []
            let hasValue = false
            for(let j=0; j<board[i].length; j++) {
                let letter = JSON.parse(JSON.stringify(board[i][j]))
                if(letter.id === id){
                    hasValue = true
                    boardCopy[i][j] = {id:'',value:0,final:letter.final}
                    occurences.push(j)
                    letter.final = false
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
            const [letter, newBoard] = getWholePiece(props.data, id)
            props.setGameData((prev) => {
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
                if (event.cancelable) event.preventDefault();
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
                props.setMousePosition({x:touch.clientX, y:touch.clientY, letter_id:event.target.id})
                // handle touchend here
            }

            event.target.addEventListener("touchmove", onTouchMove);
            event.target.addEventListener("touchend", onTouchEnd);

            return () => {
                event.target.removeEventListener("touchmove", onTouchMove);
                event.target.removeEventListener("touchend", onTouchEnd);
            }
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
