import './Tile.css' 
//I need to pass in the starting point of the cursor so the letter knows to go there

export default function Tile2(props) {
        const handleEvent = (event) => {
            if(event.type === "touchstart"){
                const touch = event.touches[0]
                props.pickUpTile(event.target.parentElement.parentElement.id, props.letters, true, touch.clientX, touch.clientY)
                
                const onTouchMove = (event) => {
                    if (event.cancelable) event.preventDefault(); // Prevent default touch action
                    const touch = event.touches[0];
                    props.setSelectedTile((prev) => {return {...prev, style:{
                        ...prev.style,
                        display: 'flex',
                        position: 'absolute',
                        left: `${touch.clientX-25}px`,
                        top: `${touch.clientY-25}px`,
                    }}});
                  };
                  
                  const onTouchEnd = (event) => {
                    const touch = event.changedTouches[0]
                    props.setMousePosition({x:touch.clientX, y:touch.clientY, letter_id:event.target.parentElement.parentElement.id})
                    
                    // handle touchend here
                }

                event.target.addEventListener("touchmove", onTouchMove);
                event.target.addEventListener("touchend", onTouchEnd);
                return()=>{
                    event.target.removeEventListener("touchmove", onTouchMove);
                    event.target.removeEventListener("touchend", onTouchEnd);
                }
            }
            if(event.type === "mousedown" && !props.isPhone){
                props.pickUpTile(event.target.parentElement.parentElement.id, props.letters, true, event.clientX, event.clientY) 
                // handle touchstart here         
            }
        }    

        function generateStyle(i,j,arr){
            let borderRadius = ['7px','7px','7px','7px']
            let height = props.isPhone ? 44 : 54
            let width = props.isPhone ? 44 : 54
            if(arr[i][j].value === ''){
                return{width: `${width+4}px`,
                height: `${height}px`,
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
                fontWeight: 'bold',
            }
        }

        return (
            <>
            <div 
            id={`${props.letters[0][0].id}_${props.index}_tile`} 
            onMouseDown={handleEvent} onTouchStart={handleEvent} 
            style={{cursor: 'grab', touchAction: 'none'}}>

            {props.letters.map((row, i) => {
                return(
                    <div key={i} className='letterContainer'>
                        {row.map((letter, j) =>{
                        return(
                            <div key = {j} 
                                style={generateStyle(i,j,props.letters)} className='tile'>
                                <div className='tile-divider' ></div>
                                <div className='tile-value'>{letter.value}</div>
                                <div className='tile-point'>{letter.point}</div>
                            </div>
                            )

                        })}
                    </div>
                    )
                }
            )}
                
            </div>  
        
        </>
        );
}

