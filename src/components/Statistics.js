import React, {useEffect} from "react"

export default function Statistics(props) {

    return (
        <div className="statistics">
            <p>Successful: {props.stats.successfulQuestions.length}</p>
            <p>Fail: {props.stats.failedQuestions.length}</p>
        </div>
    )
}