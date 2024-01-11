import React, { useEffect } from 'react'
import './Timer.css'

export default function Timer({time}) {
    useEffect(() => {
        document.getElementById('timer').style.width = time*2 + 'px'
        document.getElementById('timer').style.backgroundColor = determineColor(1 - (time/90));
      }); 

    function determineColor(i){
       
        let g = 215 - Math.floor(150*i)
        let b = 102 - Math.floor(46*i)
        return ('rgb(' + 255 + ',' + g + ',' + b + ')')
      }
    return (
      <div className='timer' id='timer'></div>
    )
}

