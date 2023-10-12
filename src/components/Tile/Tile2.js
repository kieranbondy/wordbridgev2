import React, { useState, useEffect } from 'react'
import './Tile.css' 
//I need to pass in the starting point of the cursor so the letter knows to go there

export default function Tile2(props) {
        const startMouseDown = `${props.pickedUp[0]}_tile` === props.id
        const [targetStyle, setTargetStyle] = useState(startMouseDown ? {position: 'absolute',left: `${props.pickedUp[1]-25}px`,top: `${props.pickedUp[2]-25}px`,}:{});
        const [isMouseDown, setIsMouseDown] = useState(startMouseDown);

        const handleEvent = (event) => {
            if(event.type === "mousedown" || event.type === "touchstart"){
                setIsMouseDown(true)            
            }
            if(event.type === "mouseup"){
                props.setGameData((prev)=>{
                    return({...prev, pickedUpTile:""})
                })
                setIsMouseDown(false);
                props.setMousePosition({x:event.clientX, y:event.clientY, letter:event.target.parentElement.parentElement.id})
            }
            if(event.type === "touchend"){
                const touch = event.changedTouches[0]
                props.setGameData((prev)=>{
                    return({...prev, pickedUpTile:""})
                })
                setIsMouseDown(false);
                props.setMousePosition({x:touch.clientX, y:touch.clientY, letter:event.target.parentElement.parentElement.id})
            }
        }
        // useEffect(() => {
        //     setTargetStyle({})
        // }, [isMouseDown])
        //On load setting default styles
        useEffect(() => {
            setTargetStyle(startMouseDown ? {position: 'absolute',left: `${props.pickedUp[1]-25}px`,top: `${props.pickedUp[2]-25}px`,}:{})
          }, []);
          //Handles tracking the cursor when a tile is clicked both mobile and web
    useEffect(() => {
        //WEB Changing the position of the tile through styling to follow the mouse
        const handleMouseMove = (event) => {
          if (isMouseDown) {
            // Do something while the mouse button is down
            const newStyle = {
                ...targetStyle,
                position: 'absolute',
                left: `${event.clientX-25}px`,
                top: `${event.clientY-25}px`,
            }
            setTargetStyle(newStyle)
          }
        };
        //MOBILE Changing the position of the tile through styling to follow the mouse
        const handleTouchMove = (event) => {
            if (isMouseDown) {
              // Do something while the touch is moving
              const touch = event.touches[0];
              const newStyle = {
                ...targetStyle,
                position: 'absolute',
                left: `${touch.clientX-25}px`,
                top: `${touch.clientY-25}px`,
            }
            setTargetStyle(newStyle)
            }
          };
      
          window.addEventListener('touchmove', handleTouchMove);
          window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('mousemove', handleMouseMove);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isMouseDown]);

        function generateStyle(i,j,arr){
            let style ={}
            let borderRadius = ['5px','5px','5px','5px']
            let height = 54
            let width = 54
            if(arr[i][j] === 0){
                return{width: '52px',
                height: '52px',
                display:'none'
            }
            }
            let borderWidth = ['2px','2px','2px','2px']
            if(j>0 && !Number.isInteger(arr[i][j-1])){
                borderRadius[0] = '0px'
                borderRadius[3] = '0px'
                borderWidth[3] = '0px'
                width += 2
            }
            if(i>0 && !Number.isInteger(arr[i-1][j])){
                borderRadius[0] = '0px'
                borderRadius[1] = '0px'
                borderWidth[0] = '0px'
                height += 2
            }
            if(j<arr[i].length-1 && !Number.isInteger(arr[i][j+1])){
                borderRadius[1] = '0px'
                borderRadius[2] = '0px'
                borderWidth[1] = '0px'
                width += 2
            }
            if(i<arr.length-1 && !Number.isInteger(arr[i+1][j])){
                borderRadius[2] = '0px'
                borderRadius[3] = '0px'
                borderWidth[2] = '0px'
                height += 2
            }
            
            
            return{width: `${width}px`,
                height: `${height}px`,
                border: 'red solid',
                borderRadius: borderRadius.join(' '),
                borderWidth: borderWidth.join(' ')}
        }
        return (
            <>
            <div id={props.id} onMouseDown={handleEvent} onTouchStart={handleEvent} onTouchEnd={handleEvent} onMouseUp={handleEvent} style={targetStyle}>
            {props.letters.map((row, i) => {
                return(
                    <div className='letterContainer'>
                {row.map((letter, j) =>{
                    return(
                        <div style={generateStyle(i,j,props.letters)}>{letter}</div>
                    )

                })}
                </div>
                )
            })}
                
                </div>  
        
        </>
        );
}

