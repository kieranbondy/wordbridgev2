
//This function creates an empty game board
export function generateBoard(width, height, level){
    const grid = new Array(height).fill(0).map(() => new Array(width).fill(0));
    const rocks = Math.floor(Math.random() * width);
    console.log(rocks)
    //adding rocks to the board
    for (let i = 0; i < rocks; i++) {
        const randomRow = Math.floor(Math.random() * height);
        const randomCol = Math.floor(Math.random() * width);
        grid[randomRow][randomCol] = 1;
    }
    //temporary first generation just deleting a rock if its there.
    const first = Math.floor(Math.random() * height);
    grid[first][0] = 0;
    return [grid,first];
}

export function generateLetters(board){

}