import React from 'react'

// Copied from https://www.geeksforgeeks.org/how-to-create-a-custom-progress-bar-component-in-react-js/

export default function ProgressBar(props) {

    const progressStyle = {
        width: `${props.progress}%`
    }

    //const progresstext = {
    //    padding: 10,
    //    color: 'black',
    //    fontWeight: 900
    //}
    //<span style={progresstext}>{`${props.progress}%`}</span>

    return (
        <div className="progressbar">
            <div className="progressbar--progress" style={progressStyle}>
            </div>

        </div>
    )
}

//<span>Frage {props.index} von {props.totalQuestions}</span>
//const ProgressBar = ({bgcolor,progress,height}) => {