import sorted_words from '../data/words_sorted.json'
const { v4: uuidv4 } = require('uuid');

//This function creates an empty game board
export function generateBoard(width, height, level){
    //creating array of unique objects
    const grid = new Array(height).fill(null).map(() => {
        return new Array(width).fill(null).map(()=> { return {id: "", value: 0 }});
      });
    const rocks = Math.floor((width+height+level%3)/2)-3;
    //adding rocks to the board
    for (let i = 0; i < rocks; i++) {
        const randomRow = Math.floor(Math.random() * height);
        const randomCol = Math.floor(Math.random() * width);
        grid[randomRow][randomCol].value = 1;
    }
    //temporary first generation just deleting a rock if its there.
    const first = [0,0];
    grid[first[0]][first[1]].value = 0;
    // grid = [
    //     [0, 1, 0, 0, 1],
    //     [0, 0, 1, 0, 1],
    //     [1, 0, 0, 0, 0],
    //     [0, 1, 1, 1, 0],
    //   ];
    
    
    const path = findRandomPath(grid, {row:0,column:0})
    let letters = generateLettersFromPath(path, level)
    letters = addRandomLetters(letters,level)
    // const letters = generateLetterTiles(letterPath)
    //Randomizes string and then turns string into array of characters
    // for (let index = 0; index < random-1; index++) {
    //     lettersList=lettersList+alphabet[Math.floor(Math.random() * alphabet.length)] 
    // }
    return [grid,first, letters];
}


function generateLettersFromPath(path, level){
    let grid = [...Array(5)].map(e => Array(5).fill(''));
    let horizontal = path.length > 1 ? path[1].row - path[0].row === 0 : false
    let startingLetter = ''
    let length = 0
    let words = []
    let word
    let redo = false;
    for(let i=1; i< path.length; i++){
        if(horizontal){
            if(path[i].row - path[i-1].row === 0){
                length++
            } else {
                word = getWord(length+1,startingLetter)
                if(word === '0'){
                    redo = true;
                    break;
                }
                let start = path[i].column - (word.length-1)
                for(let letter of word){
                    grid[path[i-1].row][start] = letter
                    start++
                }
                words.push([word, horizontal])
                startingLetter = word.slice(-1)
                length = 1
                horizontal = !horizontal
            }
        } else {
            if(path[i].column - path[i-1].column === 0){
                length++
            } else {
                word = getWord(length+1,startingLetter)
                if(word === '0'){
                    redo = true;
                    break;
                }
                let start = path[i].row - (word.length-1)
                for(let letter of word){
                    grid[start][path[i-1].column] = letter
                    start++
                }
                words.push([word, horizontal])
                startingLetter = word.slice(-1)
                length = 1
                horizontal = !horizontal
            }
        }
        if(i === path.length-1){
            word = getWord(length+1,startingLetter)
            let start = path[i].column - (word.length-1)
            for(let letter of word){
                grid[path[i].row][start] = letter
                start++
            }
            words.push([word, horizontal])
            startingLetter = word.slice()
            length = 1
            horizontal = !horizontal
        }
    }
    if(redo){
        console.log('redo')
        return generateLettersFromPath(path, level)
    } else {
        console.log("Generated words: ", words)
        // console.log('TILES: ', generateLetterTiles(grid, path))
        return generateLetterTiles(grid, path, level)
    } 
}

function generateLetterTiles(grid,path, level){
    let max = path.length < 3 ? path.length : 3
    let tileSize = weightedRandom(level, max);
    const startRow = path[0].row;
    const startCol = path[0].column;
    const endRow = path[tileSize].row;
    const endCol = path[tileSize].column;
    const id = uuidv4();
    const subArray = grid.slice(startRow, endRow+1).map(row => 
        row.slice(startCol, endCol+1).map(val => 
            ({id:id, value:val})));
    let restOfPath = path.slice(tileSize+1)
    if(restOfPath.length === 0){
        return [[...subArray]]
    } else {
        return [[...subArray], ...generateLetterTiles(grid, restOfPath, level)];
    }
    

}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
//TODO Add different letter shapes
function addRandomLetters(letters,level){
    let numOfLetters = 3-level%4
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for(let i =0; i<numOfLetters;i++){
        let id = uuidv4()
        letters.push( [[{id:id, value:alphabet[Math.floor(Math.random() * alphabet.length)]}]] )
    }

    return(letters)

}

function weightedRandom(level, max) {
    let three = 3-max === 0 ? (level*2)/100 : 0
    let two = max-2 >= 0 ? (level*4)/100 : 0
    let one = 1-two-three
    // Generate a random number between 0 and 1
    const rand = Math.random();
    // Define the weighted probabilities
    const probabilities = {
        0: one, 
        1: two, 
        2: three
    };

    // Initialize the cumulative probability
    let cumulativeProbability = 0;

    // Iterate through the probabilities and check where the random number falls
    for (const number in probabilities) {
        cumulativeProbability += probabilities[number];
        if (rand <= cumulativeProbability) {
            return parseInt(number); // Convert the selected number to an integer
        }
    }
}

//X and Y are inverted in this function need to fix it
export function findRandomPath(grid, start) {
    const rows = grid.length;
    const cols = grid[0].length;
  
    // Create a queue for BFS where each element is an object { x, y, path }
    const queue = [];
  
    // Initialize the starting point
    queue.push({ row: 0, column: 0, path: [start] });
  
    // Create a visited array to keep track of visited cells
    const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
  
    // Define the possible moves (right, down, up, left)
    const drow = [1, 0];
    const dcolumn = [0, 1];
  
    while (queue.length > 0) {
      // Randomly select an element from the queue
      const randomIndex = Math.floor(Math.random() * queue.length);
      const { row, column, path } = queue[randomIndex];
      queue.splice(randomIndex, 1); // Remove the selected element from the queue
  
      // Check if we have reached the final column
      if (column === cols - 1) {
        return path; // Path found, return it
      }
  
      // Mark the current cell as visited
      visited[row][column] = true;
  
      // Shuffle the order of possible moves
      const directions = Array.from({ length: 4 }, (_, i) => i);
      directions.sort(() => Math.random() - 0.5);
  
      // Explore the neighboring cells in a random order
      for (let i = 0; i < 4; i++) {
        const newRow = row + drow[directions[i]];
        const newColumn = column + dcolumn[directions[i]];
  
        // Check if the new cell is within bounds and is an open space (0)
        if (newRow >= 0 && newRow < rows && newColumn >= 0 && newColumn < cols && grid[newRow][newColumn].value === 0 && !visited[newRow][newColumn]) {
          // Create a new path by extending the current path
          const newPath = [...path, { row: newRow, column: newColumn }];
  
          queue.push({ row: newRow, column: newColumn, path: newPath });
          visited[newRow][newColumn] = true;
        }
      }
    }
  
    return null; // No path to the final column
  }




function getWord(length, startingLetter){
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    if(length > 1){
        if(startingLetter === ''){
            startingLetter = alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        const words = sorted_words[length][startingLetter.toLowerCase()]
        if(!words){
            console.log("OH NO IT BROKE")
            return '0'
        }
        const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    return word
    } 
} 