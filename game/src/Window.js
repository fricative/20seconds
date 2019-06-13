import React from 'react';

const styleObject = (x, y, objectType) => {
    return {
        position: 'absolute',
        margin: '5px',
        padding: "5px",
        left: x + 'px',
        top: y + 'px',
        color: objectType === "plane" ? "red" : "yellow"
    }
}

const Plane = (props) => <font style={styleObject(props.coordinate[0], props.coordinate[1], "plane")}>*</font>;

const Window = (props) => {
    return (
        <div>
            {props.stones.map((stone, i) =>
                <font key={i} style={styleObject(stone.x, stone.y, "stone")}>*</font>)}
            <Plane coordinate={props.coordinate} />
        </div>
    );
}

export default Window;