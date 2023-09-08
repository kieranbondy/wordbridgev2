import React, { useState, useEffect }  from 'react'
import './Tile.css' 
import singleTile from '../../assets/tiles/TileSingle.png'
// import TileCorner from '../../assets/tiles/TileCorner.png'
// import TileCorner2 from '../../assets/tiles/TileCorner2.png'

// import TileMiddleHoriz from '../../assets/tiles/TileMiddleHoriz.png'
// import TileMiddleVert from '../../assets/tiles/TileMiddleVert.png'
// import TileHorizontal from '../../assets/tiles/TileHorizontal.png'
// import TileVertical from '../../assets/tiles/TileVertical.png'
// import TileVertical2 from '../../assets/tiles/TileVertical2.png'
// import TileHorizontal2 from '../../assets/tiles/TileHorizontal2.png'
export default function Tile(props) {
    //States: Style for tile position and mousedown state to track drags
    const [targetStyle, setTargetStyle] = useState({});
    const [isMouseDown, setIsMouseDown] = useState(false);

    //Handling when a letter is clicked
    //When a user clicks on a letter the mousedown state is set to true and the letter will follow the users cursor
    const handleEvent = (event) => {
        if(event.type === "mousedown" || event.type === "touchstart"){
            setIsMouseDown(true)            
        }
        if(event.type === "mouseup"){
            setIsMouseDown(false);
            props.setMousePosition({x:event.clientX, y:event.clientY, letter:event.target.id})
        }
        if(event.type === "touchend"){
            const touch = event.changedTouches[0]
            setIsMouseDown(false);
            props.setMousePosition({x:touch.clientX, y:touch.clientY, letter:event.target.id})
        }
    }

    useEffect(() => {
        setTargetStyle({backgroundImage: `url(${singleTile})`})
    }, [isMouseDown])
    //On load setting default styles
    useEffect(() => {
        setTargetStyle({backgroundImage: `url(${singleTile})`})
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
    



  return (
    <>
    <div className='singleTile' onMouseDown={handleEvent} onTouchStart={handleEvent} onTouchEnd={handleEvent} onMouseUp={handleEvent} id={`${props.letter}_${props.index}_tile`}  style={targetStyle} >{props.letter}</div>
        
    </>
  )
}



// {tiles.map((row)=>(
//     <div className='row'>
//     {row.map((letter)=>(
//         <div onMouseDown={handleEvent} onMouseUp={handleEvent}>{letter}</div>
//     ))}
//     </div>
//     ))}

// function getTile(j, jLen, i, iLen){
//     if(j>0 && props.tileArr[i][j-1] !=  0 && j<jLen-1 && props.tileArr[i][j+1] !=  0){
//         return TileMiddleHoriz
//     }
//     if(i>0 && props.tileArr[i-1][j] !=  0 && i<iLen-1 && props.tileArr[i+1][j] !=  0){
//         return TileMiddleVert
//     }
//     if(j>0 && props.tileArr[i][j-1] !=  0 && i<iLen-1 && props.tileArr[i+1][j]!=  0){
//         return TileCorner
//     }
//     if(i>0 && props.tileArr[i-1][j] !=  0 && j<jLen-1 && props.tileArr[i][j+1]!=  0){
//         return TileCorner2
//     }
//     if( i>0 && props.tileArr[i-1][j] !=  0){
//         return TileVertical2
//     }
//     if( j>0 && props.tileArr[i][j-1] !=  0){
//         return TileHorizontal2
//     }
//     if(j<jLen-1 && props.tileArr[i][j+1] !=  0){
//         return TileHorizontal
//     }
//     if(i<iLen-1 && props.tileArr[i+1][j] !=  0){
//         return TileVertical
//     }

//     return singleTile;
// }

// for (let i=0; i<iLen; i++){
//     tiles.push([])
//     let jLen = props.tileArr[i].length
//     for (let j=0; j<jLen; j++){
//         var letter = props.tileArr[i][j]
//         if(letter){
//             // var radius = `${topLeft(j,jLen, i, iLen) ? '0px' : "5px"} ${topRight(j,jLen, i, iLen) ? '0px' : "5px"} ${botRight(j,jLen, i, iLen) ? '0px' : "5px"} ${botLeft(j,jLen, i, iLen) ? '0px' : "5px"}`
//             // var borderBot = `${i<iLen-1 && props.tileArr[i+1][j]!=  0 ? '3px solid #b58a64' : "3px solid #876648"}`
//             // var borderTop = `${i>0 && props.tileArr[i-1][j] !=  0 ? '3px solid #b58a64' : "3px solid #876648"}`
//             // var borderLeft = `${j>0 && props.tileArr[i][j-1] !=  0 ? '3px solid #b58a64' : "3px solid #876648"}`
//             // var borderRight = `${j<jLen-1 &&  props.tileArr[i][j+1] !=0? '3px solid  #b58a64' : "3px solid #876648"}` style={{backgroundImage: `url(${background})`}}
//             var background = getTile(j, jLen, i, iLen)
//             console.log('trigger')
//             setTargetStyle({backgroundImage: `url(${background})`})
//             tiles[counter].push(<div className='singleTile' id={letter}  style={targetStyle} >{letter}</div>)
//         } else {
//             tiles[counter].push(<div className='empty'></div>)
//         }
//     }
//     counter++;
// };