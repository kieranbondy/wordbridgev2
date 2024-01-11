import wordsData from '../data/words.json'

//Checking the validity of the submitted path
export function checkValid(boardState) {
    let board = JSON.parse(JSON.stringify(boardState))
    let output = []
    let totalPoints = 0;
    for(let i = 0; i <board.length; i++){
        for(let j = 0; j < board[0].length;j++){
            let letter = board[i][j]
            if(typeof letter.value === 'string'){
                output.push({letter:letter.value, row:i, column:j, final: letter.final})
                totalPoints += letter.point
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
    return [valid, words, totalPoints];
}


//Getting the closest spaces to dropped tile and returning if it is within range
export function getClosest(x, y, letter) {
    // return "failure_failure_failure"
    const elements = document.querySelectorAll('[id*="play"], [id*="tile"]'); // Get elements with IDs containing "play"
    let closestElement = null;
    let minDistance = Infinity;
  
    elements.forEach((element) => {
        if(element.id !== letter){
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

  export function createTile(inputArray) {
    // Find the maximum row and column numbers in the inputArray
    let maxRow = 0;
    let maxCol = 0;
    let startRow = inputArray[0].row
    let startCol = inputArray[0].col
    inputArray.forEach(item => {
        item.row = item.row-startRow
        item.col = item.col-startCol
        maxRow = Math.max(maxRow, item.row);
        maxCol = Math.max(maxCol, item.col);
    });


    // Create an empty matrix with rows and columns
    const matrix = [];

    for (let row = 0; row <= maxRow; row++) {
        const newRow = [];

        for (let col = 0; col <= maxCol; col++) {
        const matchingItem = inputArray.find(item => item.row === row && item.col === col);
        if (matchingItem) {
            newRow.push(matchingItem.letter);
        } else {
            newRow.push({ id: "", value: "" });
        }
        }

        matrix.push(newRow);
    }

    return matrix;
  }