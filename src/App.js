import React, {useEffect} from 'react';

import Header from "./components/Header";
import License from "./components/License";
import QuestionBox from "./components/QuestionBox";
import Statistics from "./components/Statistics";

//import data from "./data/data";
const data = require("./data/data.json");

export default function App() {

    // Popup when you try to refresh the page
    useEffect(() => {
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []); // TODO: untoggle

    /* ---------------------- S T A T E S ---------------------- */

    // State of selected license
    const [checkedLicense, setCheckedLicense] = React.useState({
        epso: false,
        disabled: false,
    })

    const [stats, setStats] = React.useState({
        index: "", // The index value in which allData.questions is iterated in
        progress: 0, // Percentage of questions achieved
        successfulQuestions: [],
        failedQuestions: [],
        handleEvaluation: false
    })

    /* ---------------------- V A R I A B L E S ---------------------- */

    // Define licenses for which there are questions
    const licenses = ["epso"]

    /* ---------------------- F U N C T I O N S ---------------------- */

    // State of all relevant questions
    const [allData, setAllData] = React.useState({
        questions: "",
        //answeredQuestions: []
    })


    // Get list of questions for the licenses that have been selected
    // And re-shuffle them
    function getQuestions() {
        let relevantQuestions = []
        licenses.forEach((licenseName) => {
            if (checkedLicense[licenseName]) {
                let questions = data.questions.filter((q) => {
                    return q.license == licenseName.toUpperCase()
                })
                relevantQuestions = relevantQuestions.concat(questions)
            }
        })
        return relevantQuestions
    }

    function randomizeQuestions(relevantQuestions) {
        let randomizedQuestions = relevantQuestions.sort(() => Math.random() - 0.5)
        // Shuffle answers
        relevantQuestions.forEach((q) => {
            q.answers = q.answers.sort(() => Math.random() - 0.5)
            q.nCorrect = 0
            q.nFalse = 0
            q.selectedAnswer = ""
            q.correctAnswer = getCorrectAnswer(q)
        })
        return randomizedQuestions
    }

    function evaluateSelectedAnswer(answer, answeredCorrectly, currentQuestionId) {
        if (answeredCorrectly === true) {
            console.log("> Correct answer")
            setStats(prevStats => {
                return {
                    ...prevStats,
                    successfulQuestions: prevStats.successfulQuestions.concat(currentQuestionId),
                    handleEvaluation: false,
                }
            })

            setAllData(prevData => {
                const updatedQuestions = prevData.questions
                updatedQuestions.forEach((q) => {
                    if (q.id === currentQuestionId) {
                        q.nCorrect = q.nCorrect + 1
                        q.selectedAnswer = answer
                    }
                })

                return {
                    ...prevData,
                    questions: updatedQuestions
                }
            })

        } else {
            console.log("> Wrong answer")
            setStats(prevStats => {
                return {
                    ...prevStats,
                    failedQuestions: prevStats.failedQuestions.concat(currentQuestionId),
                    handleEvaluation: false,
                }
            })

            setAllData(prevData => {
                const updatedQuestions = prevData.questions
                updatedQuestions.forEach((q) => {
                    if (q.id === currentQuestionId) {
                        q.nFalse = q.nFalse + 1
                        q.selectedAnswer = answer
                    }
                })

                return {
                    ...prevData,
                    questions: updatedQuestions
                }
            })
        }
        console.log("Finished evaluateSelectedAnswer()")
    }

    function setHandleEvaluation(state) {
        setStats(prevStats => {
            return {
                ...prevStats,
                handleEvaluation: state
            }
        })
    }

    // TODO: Test: Successful + Fail = props.stats.successfulQuestions.length

    function changeIndex(add) {
        const nQuestions = allData.questions.length-1
        if (add === true) {
            setStats(prevStats => {
                return {
                    ...prevStats,
                    index: prevStats.index + 1,
                    progress: ((prevStats.index+1) / nQuestions)*100
                }
            })
        } else {
            setStats(prevStats => {
                return {
                    ...prevStats,
                    index: prevStats.index - 1,
                    progress: ((prevStats.index-1) / nQuestions)*100
                }
            })
        }
    }

    // Identify the correct answer of a question
    function getCorrectAnswer(question) {
        for (let i = 0; i < 4; i++) {
            if (question.answers[i].value === true) {
                return question.answers[i].label
            }
        }
    }

    /* ---------------------- H A N D L E S ---------------------- */

    // Handle selection of a license
    function handleChangeLicense(event) {
        const {name} = event.target
        setCheckedLicense(prevData => {
            return {
                ...prevData,
                [name]: !prevData[name]
            }
        })

        setStats(prevStats => {
            return {
                ...prevStats,
                index: 0
            }
        })
    }

    // Finalize the selection of the licenses
    // TODO: Impact on questions that have to be studied
    function handleSelectLicense(event) {
        // Ensure that license selection is disabled
        setCheckedLicense(prevData => {
            return {
                ...prevData,
                disabled: true
            }
        })

        // Update list of relevant questions
        let questionsList = getQuestions()
        questionsList = randomizeQuestions(questionsList)
        setAllDataQuestions(questionsList)

    }

    function setAllDataQuestions(questionsList) {
        setAllData(prevData => {
            return {
                ...prevData,
                questions: questionsList,
            }
        })
    }

    // Handle reset of license selection
    function handleReset(event) {
        if (window.confirm("Fragenauswahl resetten?")) {
            setCheckedLicense(prevData => {
                return {
                    ...prevData,
		    epso: "",
                    disabled: false,
                }
            })
            // Set index to 0 (triggers useEffect() in QuestionBox.js)
            setStats(prevStats => {
                return {
                    ...prevStats,
                    index: "",
                    successfulQuestions: [],
                    failedQuestions: [],
                    handleEvaluation: false
                }
            })
        }
    }

    function getFalseQuestions() {
        let falseQuestions = []
        allData.questions.forEach((q) => {
            if (stats.failedQuestions.includes(q.id)) {
                q.selectedAnswer = ""
                q.answers = q.answers.sort(() => Math.random() - 0.5)
                falseQuestions = falseQuestions.concat(q)
            }
        })
        return falseQuestions
    }

    function handleFalseQuestions() {
        // Get false questions and replace the allData.questions list
        let falseQuestions = getFalseQuestions()
        falseQuestions = randomizeQuestions(falseQuestions)
        setAllDataQuestions(falseQuestions)

        console.log("Run handleFalseQuestion")

        // Set index to 0 (triggers useEffect() in QuestionBox.js)
        setStats(prevStats => {
            return {
                ...prevStats,
                index: 0,
                failedQuestions: [],
            }
        })
    }

    console.log(allData.questions)

    return (
        <div>
            <Header />
            <main>
                <License
                    status={checkedLicense}
                    licenses={licenses}
                    handleChangeLicense={handleChangeLicense}
                    handleSelectLicense={handleSelectLicense}
                    handleReset={handleReset}
                    displayFalseQuestionsButton={parseInt(stats.index+1) === parseInt(allData.questions.length)}
                    handleFalseQuestion={handleFalseQuestions}
                />
                <br />
                {checkedLicense.disabled && (
                    <div>
                        <QuestionBox
                            key="1"
                            data={allData}
                            stats={stats}
                            evaluateSelectedAnswer={evaluateSelectedAnswer}
                            setHandleEvaluation={setHandleEvaluation}
                            changeIndex={changeIndex}
                        />
                        <br/>
                        <Statistics
                        stats={stats}/>
                    </div>)}
                <br />
            </main>
        </div>
    )
}
