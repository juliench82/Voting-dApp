import React from 'react';
import {startVotingSession} from "../helpers/contract";

function StartVotingSession() {

    const handleClick = async () => {
        await startVotingSession();
    }

    return (
        <button className="btn-propreg" onClick={handleClick}>
            Start voting session
        </button>
    );
}

export default StartVotingSession;