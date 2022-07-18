import React from 'react';
import {endProposalsRegistering} from "../helpers/contract";

function EndProposalsRegistering() {

    const handleClick = async () => {
        await endProposalsRegistering();
    }

    return (
        <button className="btn-propreg" onClick={handleClick}>
            End proposals registratering
        </button>
    );
}

export default EndProposalsRegistering;