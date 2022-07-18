import React from 'react';
import {nextStatus} from "../utilities/contract";

function NextStatus() {

    const handleClick = async () => {
        await nextStatus();
    }

    return (
        <button className="btn-status" onClick={handleClick}>
            Next Status
        </button>
    );
}

export default NextStatus;
