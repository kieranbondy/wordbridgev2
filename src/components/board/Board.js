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
            var id = props.data[i][j].id

            if(letter === 0){
                board[i].push(<div className='empty-square' id={`${i}_${j}_play`}></div>)
            } else if ( letter === 1){
                board[i].push(<div className='rock-square' id={`${i},${j}`}></div>)
            } else{
                checkMatchedTile(i, j, props.data)
                board[i].push(<div style={checkMatchedTile(i, j, props.data)} className='letter-square' id={`${i}_${j}_${props.data[i][j].id}_play`}>{letter}</div>)
            }
        }
    };

    function checkMatchedTile(row, col, data){
        let borderRadius = ['7px','7px','7px','7px']
        let borderWidth = ['4px','4px','4px','4px']
        let height = 50
        let width = 54
        let marginleft = '2px'
        let marginright = '2px'
        let margintop = '2px'
        let marginbottom = '2px'

        console.log("inside match check")
        const currentID = data[row][col].id

        console.log(currentID)
        //Checks if there is a tile with matching ID to the right
        if (col < data[row].length - 1){
            console.log("inside conditional")
            const rightID = data[row][col + 1].id
            if (currentID === rightID){
                borderRadius[1] = '0px'
                borderRadius[2] = '0px'
                borderWidth[1] = '0px'
                marginright = '0px'
                width += 2
            }
        }

        //Checks if there is a tile with matching ID to the left
        if (col > 0){
            console.log("inside conditional")
            const leftID = data[row][col - 1].id
            if (currentID === leftID){
                borderRadius[0] = '0px'
                borderRadius[3] = '0px'
                borderWidth[3] = '0px'
                marginleft = '0px'
                width += 2
            }
        }

        if (row < data.length-1){
            const belowID = data[row+1][col].id
            if (currentID === belowID){
                borderRadius[2] = '0px'
                borderRadius[3] = '0px'
                borderWidth[2] = '0px'
                height += 4
                marginbottom = '0px'
            }
        }

        if (row > 0){
            const aboveID = data[row-1][col].id
            if (currentID === aboveID){
                borderRadius[0] = '0px'
                borderRadius[1] = '0px'
                borderWidth[0] = '0px'
                height += 4
                margintop = '0px'
            }
        }

        return{
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: borderRadius.join(' '),
            borderWidth: borderWidth.join(' '),
            borderColor: "#f1c52f",
            borderStyle: 'solid',
            backgroundColor: "#ffe27a",
            display: 'flex',
            marginRight: marginright,
            marginLeft: marginleft,
            marginBottom: marginbottom,
            marginTop: margintop
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
                let letter = board[i][j]
                console.log("letter:", letter)
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
        const [i,j,id] = event.target.id.split('_')
        
        if(inner){
            props.setGameData((prev) => {
                const [letter, newBoard] = getWholePiece(prev.board, id)
                const newTray = prev.tray;
                const temp = prev.board[i][j].id
                newTray.push(letter)
                return {...prev, tray:newTray, board:newBoard, pickedUpTile:[`${temp}_${newTray.length-1}`,event.clientX, event.clientY]}
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
