import sorted_words from '../data/words_sorted.json'
//This function creates an empty game board
export function generateBoard(width, height, level){
    let grid = new Array(height).fill(0).map(() => new Array(width).fill(0));
    const rocks = Math.floor(Math.random() * width);
    //adding rocks to the board
    for (let i = 0; i < rocks; i++) {
        const randomRow = Math.floor(Math.random() * height);
        const randomCol = Math.floor(Math.random() * width);
        grid[randomRow][randomCol] = 1;
    }
    //temporary first generation just deleting a rock if its there.
    const first = [0,0];
    grid[first[0]][0] = 0;
    // grid = [
    //     [0, 1, 0, 0, 1],
    //     [0, 0, 1, 0, 1],
    //     [1, 0, 0, 0, 0],
    //     [0, 1, 1, 1, 0],
    //   ];
    const path = findPath(grid, first)
    //Randomizes string and then turns string into array of characters
    const letters = [...randomizeString(generateLetters(path, "", "", 2))]
    // for (let index = 0; index < random-1; index++) {
    //     lettersList=lettersList+alphabet[Math.floor(Math.random() * alphabet.length)] 
    // }
    console.log(path, letters)
    return [grid,first, letters];
}

//Finds a random path accross the maze
export function findPath(grid, start){
    const rows = grid.length;
    const cols = grid[0].length;
  
    // Create a queue for BFS where each element is an object { x, y, path }
    const queue = [];
    
    // Initialize the starting point
    queue.push({ x: 0, y: 0, path: [start] });
    
    // Create a visited array to keep track of visited cells
    const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
    
    // Define the possible moves (right, down, up, left)
    const dx = [1, 0, 0, -1];
    const dy = [0, 1, -1, 0];
    
    while (queue.length > 0) {
      const { x, y, path } = queue.shift();
  
      // Check if we have reached the final column
      if (y === cols - 1) {
        return path; // Path found, return it
      }
      
      // Mark the current cell as visited
      visited[x][y] = true;
      
      // Explore the neighboring cells
      for (let i = 0; i < 4; i++) {
        const newX = x + dx[i];
        const newY = y + dy[i];
        
        // Check if the new cell is within bounds and is an open space (0)
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && grid[newX][newY] === 0 && !visited[newX][newY]) {
          // Create a new path by extending the current path
          const newPath = [...path, [newX, newY]];
          
          queue.push({ x: newX, y: newY, path: newPath });
          visited[newX][newY] = true;
        }
      }
    }
    
    return null; // No path to the final column
  }


export function generateLetters(path, letter, lettersList){
    console.log(path)
    let count = 0;
    const index = path[0][0] === path[1][0] ? 0 : 1
    while(count < path.length -1 && path[count][index] === path[count+1][index]){
        count++;
    }
    const word = getWord(count+1, letter)
    console.log(word, lettersList)
    lettersList = lettersList ? lettersList + word.slice(1) : lettersList + word
    if(path.length > count+1){
        lettersList = generateLetters(path.slice(count), word.slice(-1), lettersList)
    } else {
        return lettersList
    }
    //Adding random extra letters
    return lettersList

}

function randomizeString(str){
    // convert the string to an array of characters
    const chars = str.split("");
    // iterate over the array from the end to the beginning
    for (let i = chars.length - 1; i > 0; i--) {
     // choose a random index from 0 to i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // swap the current character with the randomly chosen one
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    // convert the array back to a string and return it
    return chars.join("");
}

function getWord(length, startingLetter){
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    if(length > 1){
        if(startingLetter === ''){
            startingLetter = alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        const words = sorted_words[length][startingLetter.toLowerCase()]
        console.log(startingLetter, words, length)
        if(!words){
            console.log("OH NO IT BROKE")
            return '0'
        }
        const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
        console.log("generated word: ", word)
    // if(first){
    //     setLetters((previous)=>previous+word)
    //     setCurrLetters((previous)=>previous+word)
    //     first = false;
    // }else{
    //     setLetters((previous)=>previous+word.slice(1))
    //     setCurrLetters((previous)=>previous+word.slice(1))
    // }
    return word
} 
} 