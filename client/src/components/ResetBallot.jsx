import React from 'react';
import {resetBallot} from "../helpers/contract";

function ResetBallot() {
    const handleClick = async () => {
        await resetBallot();
    }

    return (
        <button className="btn-status btn-reset" onClick={handleClick}>
            Reset the voting session
        </button>
    );
}

export default ResetBallot;
