import React, {useEffect, useState} from 'react';
import {getWinningProposalId} from "../utilities/contract";

function VotesTallied() {
    const [winningProposal, setWinningProposal] = useState(null);

    useEffect(() => {
        (async () => {
            setWinningProposal(await getWinningProposalId());
        })();
    }, []);

    if (winningProposal === null) {
        return (<>
        <div className="winning">
        <h2>Oh la la</h2>
        </div>
        </>
        )
    }

    return (
        <><div className="winning">
            <h2>The winning proposal is</h2>
            <p>{winningProposal.description} with {winningProposal.voteCount} vote(s) !</p>
            </div>
        </>
    )
}

export default VotesTallied;