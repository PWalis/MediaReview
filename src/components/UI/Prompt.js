import React from "react";
import { unstable_useBlocker as useBlocker } from "react-router-dom";

const Prompt = ({ when, message }) => {
    const block = when;
    useBlocker(() => {
        if(block) {
            return ! window.confirm(message);
        }
        return false;
    })

    return (
        <div key={block}></div>
    )
}

export default Prompt;