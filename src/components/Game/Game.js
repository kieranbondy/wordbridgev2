import React, {useState, useEffect} from 'react'
import Board from '../board/Board'
import LetterTray from '../LetterTray/LetterTray'
import { generateBoard } from '../../functions/boardGeneration'
import './Game.css'
export default function Game() {
    //States: Tracking mouse data and overall game data
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0, letter_id:''})
    const [gameData, setGameData] = useState({level:3, start:0, board:[],tray:[[[{id:1,value:'a'}]]], pickedUpTile:""})
    
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

      //this can be improved
    function findTileFromTray(id){
        let output
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

    function updateBoard(board,tile,first,second){
        let y = first-1
        let x = second-1
        let outcome = board
        tile.forEach(element => {
            y++
            x = second-1
            element.forEach(letter => {
                x++
                if(letter.value){
                    outcome[y][x] = letter
                }
            })
        });
        return outcome;
    }
    useEffect(()=>{
        const width = gameData.level + 2
        const height = gameData.level + 2
        const [newBoard, newStart, newLetters] = generateBoard(width,height, gameData.level)
        console.log(newLetters)
        setGameData((prevData) => { return {...prevData, board:newBoard, start: newStart, tray:[[[{id:'1123',value:'a'}]],[[{id:'24132',value:'b'}]],[[{id:'3123',value:'c'}],[{id:'3123',value:'d'}]],[[{id:'4213',value:'g'},{id:'4213',value:'g'}],[{id:'',value:''},{id:'4213',value:'g'}]]]}})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    //Triggers when a letter is dropped and updates game states
    useEffect(()=>{
        console.log(getClosest(mousePosition.x, mousePosition.y))
        const [first,second,type]=getClosest(mousePosition.x, mousePosition.y).split('_')
        if(type !== "failure"){
            const letter_id = mousePosition.letter_id.split('_')[0]
            console.log(findTileFromTray(letter_id))
            const [tile, trayIndex] = findTileFromTray(letter_id)
            if(type === 'play'){
                //Placing letter on game board

                setGameData((prevData) =>{
                    let boardCopy = [...prevData.board];
                    const trayCopy = [...prevData.tray];
                    boardCopy = updateBoard(boardCopy,tile,first,second);
                    trayCopy.splice(parseInt(trayIndex), 1)
                    return { ...prevData, board: boardCopy, tray: trayCopy };
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
