import React from 'react';
import {startProposalsRegistering} from "../utilities/contract";

function StartProposalsRegistering() {

    const handleClick = async () => {
        await startProposalsRegistering();
    }

    return (
        <button className="btn-propreg" onClick={handleClick}>
            Start proposals registering
        </button>
    );
}

export default StartProposalsRegistering;