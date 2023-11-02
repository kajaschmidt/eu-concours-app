import React from "react"

export default function Question(props) {

    console.log("Run Question")

    function changeColor(answer) {
        let color = "rgba(197,194,194,0.85)"
        let weight = "normal"
        let fontColor = "black"

        const red = "linear-gradient(60deg, #ef3e53 1%, rgb(246, 78, 78) 100%)"
        const green = "linear-gradient(60deg, #74c215 1%, rgb(183, 225, 98) 100%)"
        if (props.currentQuestion.disabled === true) {
            if (props.currentQuestion.selectedAnswer === answer.label) {
                color = answer.value === true ? green : red
            } else if (answer.value === true) {
                color = "#83ce11"
            }
        }
        return {
            background: color,
            fontWeight: weight,
            color: fontColor
        }
    }

    return (
        <div className="mcq">
            <div className="mcq--question">
                <h2>{props.currentQuestion.question}</h2>
            </div>
            <div className="mcq--answers">
                {props.currentQuestion.answers.map((answer, index) => (
                <div className="radio" key={index} style={changeColor(answer)}>
                    <label key={index} htmlFor={index}>
                        <input
                            type="radio"
                            id={index}
                            key={answer.label}
                            value={answer.label}
                            checked={props.currentQuestion.selectedAnswer === answer.label}
                            disabled={props.currentQuestion.disabled}
                            onChange={props.handleSelection}
                        />
                        <div className="radio--text">{answer.label}</div>
                    </label>
                </div>
                ))}
            </div>
        </div>
    )

}