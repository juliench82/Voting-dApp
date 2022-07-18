import React from 'react';
import {startVotingSession} from "../utilities/contract";

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