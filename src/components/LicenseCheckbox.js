import React from "react";

export default function LicenseCheckbox(props) {

    const Checkbox = props => (
        <input type="checkbox" {...props} />
    )

    return (
        <label>
            <Checkbox
                id={props.license}
                name={props.license}
                disabled={props.status.disabled}
                checked={props.status[props.license] === true}
                onChange={props.handleChange}
            />
            <span>{props.license.toUpperCase()}</span>
        </label>
    )
}