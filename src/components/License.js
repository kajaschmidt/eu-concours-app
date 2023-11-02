import React from "react";
import LicenseCheckbox from "./LicenseCheckbox";

export default function License(props) {

    return (
        <div className="licenses">
            <h4>Please select for which test you would like to study::</h4>
            <div className="licenses--selection">
                {props.licenses.map((licenseName) => (
                    <LicenseCheckbox
                        key={licenseName}
                        status={props.status}
                        license={licenseName}
                        handleChange={props.handleChangeLicense}
                    />
                ))}
            </div>
            {props.status.disabled === false && (
                <button
                    className="licenses--button"
                    onClick={props.handleSelectLicense}
                    disabled={props.status.disabled}
                >
                    Select
                </button>
            )}
            {props.status.disabled && (
                <button
                    className="licenses--button"
                    onClick={props.handleReset}
                >
                    Reset
                </button>
            )}
            {(props.displayFalseQuestionsButton) && (
                <button
                    onClick={props.handleFalseQuestion}
                    className="button-false-questions">
                    Study questions which you did not correctly respond to
                </button>)}
        </div>
    )
}
