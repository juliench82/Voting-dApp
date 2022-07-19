import React from "react";
import {tallyVotes} from "../utilities/contract";

function TallyVotes() {

    const handleClick = async () => {
        await tallyVotes();
    }

    return (
        <button className="btn-propreg" onClick={handleClick}>
            Tally votes
        </button>
    );
}

export default TallyVotes;