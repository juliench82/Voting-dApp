import React from 'react';
import {nextStatus} from "../utilities/contract";

function NextStatus() {

    const handleClick = async () => {
        await nextStatus();
    }

    return (
        <button className="btn-status" onClick={handleClick}>
            Get the winning proposal
        </button>
    );
}

export default NextStatus;
