import React, {useState, useEffect} from 'react'
import Board from '../board/Board'
import LetterTray from '../LetterTray/LetterTray'
import { generateBoard } from '../../functions/boardGeneration'
import wordsData from '../../data/words.json'
import './Game.css'
import { Link } from 'react-router-dom'
import PickedUpTile from '../Tile/PickedUpTile'
export default function Game() {
    //States: Tracking mouse data and overall game data
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0, letter_id:''})
    const [selectedTile, setSelectedTile] = useState({tile:[[]],id:'', position:{}, style:{position: 'absolute', display:'flex', cursor:'grabbing'}})
    const [gameData, setGameData] = useState({level:0, width:3, height:3, start:0, board:[],tray:[[[{id:1,value:'a'}]]]})


    //Checking the validity of the submitted path
    function checkValid() {
        let board = JSON.parse(JSON.stringify(gameData.board))
        let output = []
        for(let i = 0; i <board.length; i++){
            for(let j = 0; j < board[0].length;j++){
                let letter = board[i][j]
                if(typeof letter.value === 'string'){
                    output.push({letter:letter.value, row:i, column:j, final: letter.final})
                }
            }
        }
        if(output.length === 0){
            return [false, null]
        }
        let words = [output[0].letter]
        let wordIndex = 0
        let valid = Boolean(output.length > 1 && output[0].column === 0 && output[output.length-1].final);
        let horizontal = output.length > 1 ? output[1].row - output[0].row === 0 : false
        if(valid){
            for(let i=1;i<output.length;i++){
                if(i<output.length-1){
                    if(Math.abs(output[i-1].row - output[i].row) + Math.abs(output[i-1].column - output[i].column) !== 1){
                        valid = false
                        break
                    } else {
                        if(horizontal){
                            if(output[i-1].row - output[i].row === 0){
                                words[wordIndex] += output[i].letter
                            } else {
                                horizontal = !horizontal
                                wordIndex ++
                                words[wordIndex] = output[i-1].letter + output[i].letter
                            }
                        } else {
                            if(output[i-1].column - output[i].column === 0){
                                words[wordIndex] += output[i].letter
                            } else {
                                horizontal = !horizontal
                                wordIndex ++
                                words[wordIndex] = output[i-1].letter + output[i].letter
                            }
                        }
                    }
                } else {
                    if(output[i].column !== board[0].length-1){
                        valid = false
                        break
                    } else {
                        if(horizontal){
                            if(output[i-1].row - output[i].row === 0){
                                words[wordIndex] += output[i].letter
                            } else {
                                horizontal = !horizontal
                                wordIndex ++
                                words[wordIndex] = output[i-1].letter + output[i].letter
                            }
                        } else {
                            if(output[i-1].column - output[i].column === 0){
                                words[wordIndex] += output[i].letter
                            } else {
                                horizontal = !horizontal
                                wordIndex ++
                                words[wordIndex] = output[i-1].letter + output[i].letter
                            }
                        }
                    }
                }
            }
        }
        if(valid){
            for(let i = 0; i<words.length; i++){
                if(wordsData[words[i].toLowerCase()] !== 1){
                    valid = false;
                }
            }
        }
        return [valid, words];
    }

    //TODO: handle transition to next level
    function handleSubmit() {
        let [valid, words] = checkValid(gameData.board)
        if(valid){

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
            setGameData((prevData) => { return {...prevData, board:newBoard, start: newStart, tray:newLetters, width:width, height:height, level:level}})
        }
        console.log(`This is a valid solution: ${valid} using the words ${words}`)
    }
    
    //Function to update the currently selected tile and remove it from the tray
    function pickUpTile(id, letters, fromTray, x, y){
        if(id){
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
    
    //Getting the closest spaces to dropped tile and returning if it is within range
    function getClosest(x, y) {
        // return "failure_failure_failure"
        const elements = document.querySelectorAll('[id*="play"], [id*="tile"]'); // Get elements with IDs containing "play"
        let closestElement = null;
        let minDistance = Infinity;
      
        elements.forEach((element) => {
            if(element.id !== mousePosition.letter){
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
            
                const distance = Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2);
            
                if (distance < minDistance) {
                    minDistance = distance;
                    closestElement = element;
                }
            }
        });
        //Checking within range
        if(closestElement.id.includes('tile') && minDistance > 45){
            return "failure_failure_failure"
        }
        if(closestElement.id.includes('play') && minDistance > 30){
            return "failure_failure_failure"
        }
        return closestElement.id;
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
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    //Triggers when a letter is dropped and updates game states
    useEffect(()=>{
        const [first,second,type]=getClosest(mousePosition.x, mousePosition.y).split('_')
        if(type !== "failure"){
            if(type === 'play'){
                //Check for overlapping tiles

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mousePosition])

  return (
    <> 
    <div id='picked-up' style={selectedTile.style}>
        {selectedTile.id !== '' &&
            <PickedUpTile id={selectedTile.id} setMousePosition={setMousePosition} letters={selectedTile.tile}></PickedUpTile>
        }   
    </div>
    <div className='title'>
        WordBridge
    </div>
    <div className='board-container'>
        <Board setMousePosition={setMousePosition} setSelectedTile={setSelectedTile} data={gameData.board} pickUpTile={pickUpTile} start={gameData.start} setGameData={setGameData}></Board>
    </div>
    <div className='board-container'>
        <LetterTray setSelectedTile={setSelectedTile} isMouseDown={isMouseDown} setIsMouseDown={setIsMouseDown} pickUpTile={pickUpTile} setGameData={setGameData} setMousePosition={setMousePosition} letters={gameData.tray}></LetterTray>
    </div>

    <div className='board-container'>
        <div className='button-container'>
            <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
            <Link to="/">
                <button className='back-button'>BACK</button>
            </Link>
        </div>
    </div>
    </>
  )
}

