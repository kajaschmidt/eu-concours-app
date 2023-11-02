import React, {useEffect} from "react"
import Question from "./Question"
import ProgressBar from "./ProgressBar";

export default function QuestionBox(props) {

    /*
    This class should select a question and forward
    all necessary information to the question section,
    as well as the prev / next question buttons
    * */

    console.log("Run QuestionBox")

    let question = props.data.questions[props.stats.index] // TODO: randomize selection of question

    const [currentQuestion, setCurrentQuestion] = React.useState({
        id: question.id,
        question: question.question,
        answers: question.answers,
        correctAnswer: question.correctAnswer,
        selectedAnswer: question.selectedAnswer,
        previousId: "",
        disabled: false,
    })

    console.log(currentQuestion)

    // Display other question if there was an index change
    useEffect(() => {
        // Get question with current index value
        question = props.data.questions[props.stats.index]

        // Set the question that will be displayed
        setCurrentQuestion(prevState => {
            const disabledVar = question.selectedAnswer === "" ? false : true
            return {
                ...prevState,
                id: question.id,
                question: question.question,
                answers: question.answers,
                selectedAnswer: question.selectedAnswer,
                correctAnswer: question.correctAnswer,
                disabled: disabledVar,
            }
        })

    }, [props.stats.index])


    function handlePreviousQuestion(event) {
        console.log("PREVIOUS QUESTION")
        props.changeIndex(false)
    }

    function handleNextQuestion(event) {
        console.log("NEXT QUESTION")
        props.changeIndex(true)
    }

    // COPIED TO ADJUST
    function handleSelection(event) {
        const {value} = event.target
        console.log("Handle selection: "+value)
        setCurrentQuestion(prevData => {
            return {
                ...prevData,
                selectedAnswer: value,
                disabled: true,
            }
        })
        props.setHandleEvaluation(true)
    }

    // Evaluate selected Answer if evaluation is handled
    useEffect(() => {
        if (props.stats.handleEvaluation === true) {
            const answeredCorrectly = currentQuestion.selectedAnswer === currentQuestion.correctAnswer
            props.evaluateSelectedAnswer(currentQuestion.selectedAnswer, answeredCorrectly, currentQuestion.id)
        }
    }, [props.stats.handleEvaluation])

    console.log("Current question disabled: "+currentQuestion.disabled)

    return (
        <div className="questionbox">
            <Question
                key={currentQuestion.id}
                currentQuestion={currentQuestion}
                handleSelection={handleSelection}
            />
            <div className="mcq--buttons">
                <button
                    onClick={handlePreviousQuestion}
                    className="button-left"
                    disabled={props.stats.index === 0}
                >
                    Previous question
                </button>
                {(props.stats.index + 1 < props.data.questions.length) && (
                    <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestion.disabled === false}
                        className="button-right">
                        Next question
                    </button>)}
            </div>
            <ProgressBar
                totalQuestions={props.data.questions.length}
                index={props.stats.index+1}
                progress={props.stats.progress}
            />
        </div>
    )

}
