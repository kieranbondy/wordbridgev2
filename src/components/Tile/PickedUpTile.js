import './Tile.css' 
//I need to pass in the starting point of the cursor so the letter knows to go there

export default function PickedUpTile(props) {
        const handleEvent = (event) => {
            if(event.type === "mouseup"){
                props.setMousePosition({x:event.clientX, y:event.clientY, letter_id:event.target.parentElement.parentElement.id})
            }
            if(event.type === "touchend"){
                const touch = event.changedTouches[0]
                props.setMousePosition({x:touch.clientX, y:touch.clientY, letter_id:event.target.parentElement.parentElement.id})
            }
        }

        //TODO: refactor this into a file for helper functions
        function generateStyle(i,j,arr){
            let borderRadius = ['7px','7px','7px','7px']
            let height = 54
            let width = 54
            if(arr[i][j].value === ''){
                return{width: '58px',
                height: '54px',
            }
            }
            let borderWidth = ['4px','4px','4px','4px']

            //side by side tiles
            if(j>0 && arr[i][j-1].value !== ''){
                borderRadius[0] = '0px'
                borderRadius[3] = '0px'
                borderWidth[3] = '0px'
                width += 2
            }
            //up down tiles
            if(i>0 && arr[i-1][j].value !== ''){
                borderRadius[0] = '0px'
                borderRadius[1] = '0px'
                borderWidth[0] = '0px'
                height += 4
            }
            if(j<arr[i].length-1 && arr[i][j+1].value !== ''){
                borderRadius[1] = '0px'
                borderRadius[2] = '0px'
                borderWidth[1] = '0px'
                width += 2
            }
            if(i<arr.length-1 && arr[i+1][j].value !== ''){
                borderRadius[2] = '0px'
                borderRadius[3] = '0px'
                borderWidth[2] = '0px'
                height += 4
            }
            
            //const backgroundColor = "lightblue";
            //const backgroundImage = 'url("src/assets/fulltile.png")'
            //const backgroundSize = 'cover'
            
            return{width: `${width}px`,
                height: `${height}px`,
                borderRadius: borderRadius.join(' '),
                borderWidth: borderWidth.join(' '),
                borderColor: "#f1c52f",
                borderStyle: 'solid',
                backgroundColor: "#ffe27a",
                //backgroundImage: backgroundImage,
                //backgroundSize: backgroundSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
            }
        }
        return (
            <>
            <div id={`${props.letters[0][0].id}_picked_up`} onMouseUp={handleEvent} onTouchEnd={handleEvent}>
            {props.letters.map((row, i) => {
                return(
                    <div key={i} className='letterContainer'>
                {row.map((letter, j) =>{
                    return(
                        <div key={j} style={generateStyle(i,j,props.letters)}>{letter.value}</div>
                    )

                })}
                </div>
                )
            })}
                
                </div>  
        
        </>
        );
}
