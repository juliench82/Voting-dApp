import React, {useEffect, useState} from 'react';
import {getResults} from "../helpers/contract";

function VotesTallied() {
    const [winningProposal, setWinningProposal] = useState(null);

    useEffect(() => {
        (async () => {
            setWinningProposal(await getResults());
        })();
    }, []);

    if (winningProposal === null) {
        return <><p>No winning proposal</p></>;
    }

    return (
        <>
            <div className="winning">
            <h2>Winning proposal</h2>
            <p>
                Proposal #{winningProposal.proposalId} win with {winningProposal.voteCount} vote(s) :
            </p>
            <p><b>{winningProposal.description}</b></p>
            </div>
        </>
    )
}

export default VotesTallied;

