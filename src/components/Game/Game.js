import React, {useState, useEffect} from 'react'
import Board from '../board/Board'
import Timer from '../Timer/Timer'
import LetterTray from '../LetterTray/LetterTray'
import { generateBoard } from '../../functions/boardGeneration'
import './Game.css'
import PickedUpTile from '../Tile/PickedUpTile'
import { checkValid, getClosest, createTile } from '../../functions/helpers'
import {useNavigate} from 'react-router-dom'

export default function Game() {
    //States: Tracking mouse data and overall game data
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0, letter_id:''})
    const [selectedTile, setSelectedTile] = useState({tile:[[]],id:'', position:{}, style:{position: 'absolute', display:'flex', cursor:'grabbing'}})
    const [gameData, setGameData] = useState({level:0, width:3, height:3, start:0, board:[],tray:[[[{id:1,value:'a'}]]]})
    const [score, setScore] = useState(0)
    const [time, setTime] = useState(90)
    const [isPhone, setIsPhone] = useState(window.innerWidth < 700)
    const navigate = useNavigate()

    // Initial game setup --> calls board generation
    useEffect(()=>{
        const [newBoard, newStart, newLetters] = generateBoard(gameData.width,gameData.height, gameData.level)
        setGameData((prevData) => { return {...prevData, board:newBoard, start: newStart, tray:newLetters}})
    
        //Setting up movement tracking for tile placing
        const handleMouseMove = (e) => {
            const newStyle = {
                ...selectedTile.style,
                display: 'flex',
                position: 'absolute',
                left: `${e.clientX-25}px`,
                top: `${e.clientY-25}px`,
            }
          setSelectedTile((prev) => {return {...prev, style:newStyle}});
        };

        
        // Add mousemove event listener when the component mounts
        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleResize = () => {
        setIsPhone(window.innerWidth < 700);
    };

    useEffect(() => {
        const interval = setInterval(() => {
          if (time > 0) {
            setTime(time - 1);
          }
          else {
            console.log("gameover");
            clearInterval(interval)
            navigate('/gameover', {state: {score}})
          }
        }, 1000);
    
        return () => clearInterval(interval);
      }, [time, navigate, score]);



    function clear() {
        let droppedLetters = {}
        const board = JSON.parse(JSON.stringify(gameData.board))
        for(let i = 0; i <board.length; i++){
            for(let j = 0; j < board[0].length;j++){
                let letter = board[i][j]
                if(typeof letter.value === 'string'){
                    board[i][j] = {id:'',value:0,final:letter.final}
                    letter.final = false
                    if(droppedLetters[letter.id]){
                        droppedLetters[letter.id].push({letter:letter, row:i, col:j})
                    } else {
                        droppedLetters[letter.id] = [{letter:letter, row:i, col:j}]
                    }
                    // droppedLetters.push([[letter]])
                }
            }
        }

        const entries = Object.entries(droppedLetters);

        setGameData((prev) => {
            let newTray = JSON.parse(JSON.stringify(prev.tray))
            for (const [, value] of entries) {
                newTray.push(createTile(value))
            }
            return {...prev, board: board, tray: newTray}
        })
    }
    //TODO: handle transition to next level
    function handleSubmit() {
        let [valid, words, points] = checkValid(gameData.board)
        if(valid){
            setScore((prev) => { return prev+points})
            let width = gameData.width
            let height = gameData.height
            let level = gameData.level + 1
            if(level%3 === 0){
                // Randomly decide whether to increase height or width
                if (Math.random() < 0.5) {
                    // Increase height by one if it's less than or equal to width
                    if (height <= width) {
                        height++;
                    } else {
                        // Increase width by one if it's less than height
                        width++;
                    }
                } else {
                    // Increase width by one if it's less than or equal to height
                    if (width <= height) {
                        width++;
                    } else {
                        // Increase height by one if it's less than width
                        height++;
                    }
                }
            }
            const [newBoard, newStart, newLetters] = generateBoard(width,height, level)
            setTime(prev => {return prev + Math.floor((90-prev)*.3)})
            setGameData((prevData) => { return {...prevData, board:newBoard, start: newStart, tray:newLetters, width:width, height:height, level:level}})
        } else {
            clear()
        }
        console.log(`This is a valid solution: ${valid} using the words ${words} worth ${points} points`)
    }
    
    //Function to update the currently selected tile and remove it from the tray
    function pickUpTile(id, letters, fromTray, x, y){
        //ERROR ON LINE 131
        if (id){
            setSelectedTile(prev => ({...prev, tile: letters, id:id, style:{...prev.style, left: `${x-25}px`,top: `${y-25}px`,}}))
            let letter_id = id.split('_')[0]

            if(fromTray){
                const trayIndex = findTileFromTray(letter_id)[1]
                setGameData((prevData) =>{
                    const trayCopy = [...prevData.tray];
                    trayCopy.splice(parseInt(trayIndex), 1)
                    return { ...prevData, tray: trayCopy };
                })
            }
        }
    }

    //TODO: optimize? this can be improved
    function findTileFromTray(id){
        let output =[]
        let index = 0
        gameData.tray.forEach(element => {
            index++
            if(element[0][0].id === id){
                let outputIndex = index-1
                output = [element,outputIndex];
            }
        });
        return output;
    }

    //Function that takes in a multi tile and updates the board with all of its letters
    function updateBoard(board,tile,first,second){
        let y = first-1
        let x = second-1
        let outcome = JSON.parse(JSON.stringify(board))
        let tileCheck = true

        tile.forEach(element => {
            if(y >= outcome.length - 1){
                tileCheck = false
                return
            }
            y++
            x = second-1
            element.forEach(letter => {
                if (x >= outcome[y].length - 1){
                    tileCheck = false
                    return
                }
                
                x++
                if(letter.value){
                    if(outcome[y][x].value === 0){
                        if(outcome[y][x].final){
                            letter['final'] = true
                        }
                        outcome[y][x] = letter
                    }else{
                        tileCheck = false
                    }
                }
            })
        });
        return tileCheck ? outcome:false;
    }

    

    //Triggers when a letter is dropped and updates game states
    useEffect(()=>{
        if(mousePosition.letter_id){
            const [first,second,type]=getClosest(mousePosition.x, mousePosition.y, mousePosition.letter_id).split('_')
            if(type !== "failure"){
                if(type === 'play'){
                    //Placing letter on game board
                    console.log("placing letter")
                    setGameData((prevData) =>{
                        let boardCopy = [...prevData.board];
                        boardCopy = updateBoard(boardCopy,selectedTile.tile,first,second);
                        if (boardCopy === false){
                            const updatedTray = [...prevData.tray]
                            updatedTray.push(selectedTile.tile)
                            return {...prevData, board: prevData.board, tray: updatedTray }
                        } else{
                            return { ...prevData, board: boardCopy};
                        }
                        
                    })
                } else if(type === 'tile'){
                    //TODO Improve this maybe depending on what half ot the screen you are on it will place the tile on that end of the tray
                    setGameData((prevData) => {
                        const updatedTray = [...prevData.tray]; // Create a copy of the original tray array
                        const index2 = parseInt(second);
                        updatedTray.splice(index2, 0, selectedTile.tile)
                        // Swap the elements at index1 and index2 in the updatedTray array                  
                        // Return the updated data with the modified tray array
                        return { ...prevData, tray: updatedTray };
                    });
                }
                else {
                    setGameData((prevData) => {
                        const updatedTray = [...prevData.tray]
                        updatedTray.push(selectedTile.tile)
                        return {...prevData, tray: updatedTray }
                    })
                }
                
            } else if(selectedTile.id !== '') {
                console.log("return to tray")
                setGameData((prevData) => {
                    const updatedTray = [...prevData.tray]
                    updatedTray.push(selectedTile.tile)
                    return {...prevData, tray: updatedTray }
                })
            }
            setSelectedTile({tile:[[]],id:'', position:{}, style:{position: 'absolute', display:'flex', cursor:'grabbing'}})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mousePosition])

  return (
    <> 
    <div id='picked-up' style={selectedTile.style}>
        {selectedTile.id !== '' &&
            <PickedUpTile isPhone={isPhone} id={selectedTile.id} setMousePosition={setMousePosition} letters={selectedTile.tile}></PickedUpTile>
        }   
    </div>
    <div className='title'>
        WordBridge
    </div>
    <div className='time'>
        <Timer time={time}></Timer>
    </div>
    <div className='score'>
        {score}
    </div>
    <div className='board-container'>
        <Board isPhone={isPhone} setMousePosition={setMousePosition} setSelectedTile={setSelectedTile} data={gameData.board} pickUpTile={pickUpTile} start={gameData.start} setGameData={setGameData}></Board>
    </div>
    <div className='board-container'>
        <LetterTray isPhone={isPhone} setSelectedTile={setSelectedTile} isMouseDown={isMouseDown} setIsMouseDown={setIsMouseDown} pickUpTile={pickUpTile} setGameData={setGameData} setMousePosition={setMousePosition} letters={gameData.tray}></LetterTray>
    </div>

    <div className='board-container'>
        <div className='button-container'>
            <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
            <button className='back-button' onClick={clear}>CLEAR</button>
        </div>
    </div>
    </>
  )
}

