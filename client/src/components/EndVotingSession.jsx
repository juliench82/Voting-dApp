import React from 'react';
import {endVotingSession} from "../helpers/contract";

function EndVotingSession() {

    const handleClick = async () => {
        await endVotingSession();
    }

    return (
        <button className="btn-propreg" onClick={handleClick}>
            End voting session
        </button>
    );
}

export default EndVotingSession;