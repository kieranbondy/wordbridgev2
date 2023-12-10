import React, {useState, useEffect} from 'react'
import Board from '../board/Board'
import LetterTray from '../LetterTray/LetterTray'
import { generateBoard } from '../../functions/boardGeneration'
import wordsData from '../../data/words.json'
import './Game.css'
import { Link } from 'react-router-dom'

export default function Game() {
    //States: Tracking mouse data and overall game data
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0, letter_id:''})
    const [gameData, setGameData] = useState({level:3, start:0, board:[],tray:[[[{id:1,value:'a'}]]], pickedUpTile:""})


    function checkValid() {
        
        let board = JSON.parse(JSON.stringify(gameData.board))
        let output = []
        for(let i = 0; i <board.length; i++){
            for(let j = 0; j < board[0].length;j++){
                if(typeof board[i][j].value === 'string'){
                    output.push({letter:board[i][j].value, row:i, column:j})
                }
            }
        }
        if(output.length === 0){
            return [false, null]
        }
        let words = [output[0].letter]
        let wordIndex = 0
        let valid = output.length > 1 && output[0].column === 0;
        let horizontal = output.length > 1 ? output[1].row - output[0].row === 0 : false
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
        if(valid){
            for(let i = 0; i<words.length; i++){
                if(wordsData[words[i].toLowerCase()] !== 1){
                    valid = false;
                }
            }
        }
        return [valid, words];
    }
    function handleSubmit() {
        let [valid, words] = checkValid(gameData.board)
        console.log(`This is a valid solution: ${valid} using the words ${words}`)
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

      //this can be improved
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
    // Initial game setup --> calls board generation
    useEffect(()=>{
        const width = gameData.level + 2
        const height = gameData.level + 2
        const [newBoard, newStart, newLetters] = generateBoard(width,height, gameData.level)
        // const temp = [[[{id:'1123',value:'a'}]],[[{id:'24132',value:'b'}]],[[{id:'3123',value:'d'}],[{id:'3123',value:'o'}]],[[{id:'4213',value:'i'},{id:'4213',value:'l'}],[{id:'',value:''},{id:'4213',value:'a'}]]]
        setGameData((prevData) => { return {...prevData, board:newBoard, start: newStart, tray:newLetters}})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    //Triggers when a letter is dropped and updates game states
    useEffect(()=>{
        console.log(getClosest(mousePosition.x, mousePosition.y))
        const [first,second,type]=getClosest(mousePosition.x, mousePosition.y).split('_')
        if(type !== "failure"){
            const letter_id = mousePosition.letter_id.split('_')[0]
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
    <div className='title'>
        WordBridge
    </div>
    <div className='board-container'>
        <Board data={gameData.board} start={gameData.start} setGameData={setGameData}></Board>
    </div>
    <div className='board-container'>
        <LetterTray isMouseDown={isMouseDown} setIsMouseDown={setIsMouseDown} setGameData={setGameData} setMousePosition={setMousePosition} letters={gameData.tray} pickedUp={gameData.pickedUpTile}></LetterTray>
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


// GRAVEYARD


    // function hasPath(board) {
    //     let grid = JSON.parse(JSON.stringify(board));
    //     const height = grid.length;
    //     const width = grid[0].length;
    //     let first = true;
    //     // Helper function to perform DFS
    //     function dfs(row, col, currentPath) {
    //         // debugger
    //         // Check if the current position is out of bounds or already visited
    //         if (
    //             row < 0 ||
    //             row >= height ||
    //             col < 0 ||
    //             col >= width ||
    //             grid[row][col].value === 0 ||
    //             grid[row][col].value === 1 ||
    //             grid[row][col].visited
    //         ) {
    //         return;
    //         }

    //         // Mark the current cell as visited
    //         grid[row][col].visited = true;

    //         // Add the current cell to the current path
    //         currentPath.push(grid[row][col]);

    //         // If we are in the last row, update the path if it's shorter
    //         if (col === width - 1) {
    //             if(row+1<height && grid[row+1][col].value !== 0 && grid[row+1][col].value !== 1 ){
    //                     console.log(grid,grid[row+1][col])
    //             }
                
    //             const pathCopy = currentPath.slice();
    //             // Backtrack: unmark the current cell and remove it from the current path
    //             grid[row][col].visited = false;
    //             currentPath.pop();
    //             return pathCopy;
    //         }

    //         // Explore neighboring cells
    //         const neighbors = [
    //         [row - 1, col], // Up
    //         [row + 1, col], // Down
    //         [row, col - 1], // Left
    //         [row, col + 1], // Right
    //         ];

    //         for (const [r, c] of neighbors) {
    //             const path = dfs(r, c, currentPath);
    //             if (path && (!shortestPath || path.length < shortestPath.length)) {
    //               shortestPath = path;
    //             }
    //           }

    //         // Backtrack: unmark the current cell and remove it from the current path
    //         grid[row][col].visited = false;
    //         currentPath.pop();
    //         return shortestPath
    //     }

    //     // Initialize the shortest path
    //     let shortestPath = null;
    //     // Start DFS from each cell in the first row
    //     for (let i = 0; i < height; i++) {
    //         const path = dfs(i, 0, []);
    //         console.log(path, shortestPath)
    //         if (path && first && (!shortestPath || path.length < shortestPath.length)) {
    //             shortestPath = path;
    //             first = false
    //         }
    //     }

    //     // Reset the visited property in the grid
    //     grid.forEach((row) => row.forEach((cell) => (cell.visited = false)));

    //     return shortestPath;
    //   }
    // function trimBoard(board) {
    //     let output = []
    //     let boardCopy = JSON.parse(JSON.stringify(board));
    //     let occurences = []
    //     for(let i=0; i<board.length; i++) {
    //         let row = []
    //         let hasValue = false
    //         for(let j=0; j<board[i].length; j++) {
    //             let letter = board[i][j]
    //             if(letter.value !== 0 && letter.value !== 1 ){
    //                 hasValue = true
    //                 boardCopy[i][j] = {id:'',value:0}
    //                 occurences.push(j)
    //                 row.push(letter)
    //             } else {
    //                 row.push({id:'',value:''})
    //             }
    //         }
    //         if(hasValue){
    //             output.push(row)
    //         }
    //     };
    //     const minValue = Math.min(...occurences);
    //     const maxValue = Math.max(...occurences);
    //     let final = output.map(function(val) {
    //         return val.slice(minValue,maxValue+1)
    //     })
    //     return [final,boardCopy]
    // }