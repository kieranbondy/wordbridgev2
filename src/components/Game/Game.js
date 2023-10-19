import React, {useState, useEffect} from 'react'
import Board from '../board/Board'
import LetterTray from '../LetterTray/LetterTray'
import { generateBoard } from '../../functions/boardGeneration'
import './Game.css'
import Tile2 from '../Tile/Tile2'
export default function Game() {
    //States: Tracking mouse data and overall game data
    // gameData currently hardcoded for testing
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0, letter:''})
    const [gameData, setGameData] = useState({level:3, start:0, board:[],tray:[[['a']],[['b']],[['c'],['d']],[['p','i']]], pickedUpTile:""})
    
    //Getting the closest spaces to dropped tile and returning if it is within range
    function getClosest(x, y) {
        // return "failure_failure_failure"
        const elements = document.querySelectorAll('[id*="play"], [id*="tile"]'); // Get elements with IDs containing "play" (CSS query?)
        console.log(elements)
        // setting parameter bounds
        let closestElement = null;
        let minDistance = Infinity;
      
        //iterates through all elements that match above query
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
        console.log("Closest Element: ", closestElement.id)
        return closestElement.id;
      }

    //Board generation, calculates board size based on gameLevel
    useEffect(()=>{
        const width = gameData.level + 2
        const height = gameData.level + 2
        const [newBoard, newStart, newLetters] = generateBoard(width,height, gameData.level) //calls generateBoard from functions directory
        setGameData((prevData) => { return {...prevData, board:newBoard, start: newStart, tray:[[['a']],[['b']],[['c'],['d']],[['p','i']]]}})
        console.log("Initial Board: ", newBoard)
    },[])

    //Triggers when a letter is dropped and updates game states
    useEffect(()=>{
        const [first,second,type]=getClosest(mousePosition.x, mousePosition.y).split('_') //splits the return value
        console.log(first, second, type)
        if(type !== "failure"){
            const [letter,trayIndex] = mousePosition.letter.split('_')
            console.log(letter)
            if(type === 'play'){
                //Placing letter on game board

                setGameData((prevData) =>{
                    const updatedBoard = [...prevData.board];
                    const updatedTray = [...prevData.tray];
                    updatedBoard[first][second] = letter;
                    updatedTray.splice(parseInt(trayIndex), 1)
                    console.log("Updated Board: ", updatedBoard);
                    return { ...prevData, board: updatedBoard, tray: updatedTray };
                })
            } else if(type === 'tile'){
                setGameData((prevData) => {
                    const updatedTray = [...prevData.tray]; // Create a copy of the original tray array
                  
                    const index1 = parseInt(trayIndex);
                    const index2 = parseInt(second);
                  
                    // Swap the elements at index1 and index2 in the updatedTray array
                    [updatedTray[index1], updatedTray[index2]] = [updatedTray[index2], updatedTray[index1]];
                  
                    // Return the updated data with the modified tray array
                    return { ...prevData, tray: updatedTray };
                  });
            }
            
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mousePosition])
    //What is difference between "play" and "tile" tags?
    //Nvm, you gotta keep track of gameboard and letter bank (tray)

  return (
    <> 
    <div className='board-container'>
        <Board data={gameData.board} start={gameData.start} setGameData={setGameData}></Board>
    </div>
    <div className='board-container'>
        <LetterTray isMouseDown={isMouseDown} setIsMouseDown={setIsMouseDown} setGameData={setGameData} setMousePosition={setMousePosition} letters={gameData.tray} pickedUp={gameData.pickedUpTile}></LetterTray>
    </div>
    <div>
        {/* <Tile2 letters={[['o']]}></Tile2>
        <Tile2 letters={[['a','b']]}></Tile2>
        <Tile2 letters={[['z'],['c']]}></Tile2>
        <Tile2 letters={[['h',0],['g','d']]}></Tile2> */}
    </div>
    </>
  )
}
