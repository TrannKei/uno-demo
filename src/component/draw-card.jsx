import React from "react";
import Card from '../ass/card-back.png'
function DrawCard (){

    return(
        <>
        <div className="draw-box">
            <img className="draw-card" src={Card}/>
            <img className="draw-card  draw-card-2" src={Card}/>
            <img className="draw-card  draw-card-3" src={Card}/>
            <img className="draw-card  draw-card-4" src={Card}/>
            <img className="draw-card  draw-card-5" src={Card}/>
            {/* <img className="draw-card  draw-card-6" src={Card}/>
            <img className="draw-card  draw-card-7" src={Card}/> */}
        </div>
        </>
    )
}
export default DrawCard