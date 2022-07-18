import React, {useEffect, useState} from 'react';
import {getProposals, vote} from "../helpers/contract";
import walletStore from "../stores/wallet";

function VotingSession() {
    const [proposals, setProposals] = useState([]);

    const {hasVoted, votedProposalId} = walletStore(state => ({ hasVoted: state.hasVoted, votedProposalId: state.votedProposalId }));

    useEffect(() => {
        (async () => {
            setProposals(await getProposals());
        })();
    }, []);

    const handleClick = async (proposalId) => {
        await vote(proposalId);
    }

    return (
        <>
            <div className="test">
            <h2>Proposals available for vote</h2>
            Please pick up your favourite proposal.
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Proposal</th>
                        <th>Vote</th>
                    </tr>
                </thead>
                <tbody>
                {proposals.map((proposal) =>
                    <tr key={proposal.id}>
                        <td><span className="proposal-id">{proposal.id}</span></td>
                        <td>{proposal.description}</td>
                        <td>
                            {(hasVoted && votedProposalId === proposal.id) && '√'}
                            {(hasVoted && votedProposalId !== proposal.id) && ''}
                            {!hasVoted && <button onClick={() => handleClick(proposal.id)}>Vote</button>}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </>
    )
}

export default VotingSession;

