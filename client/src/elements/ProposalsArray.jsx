import React, {useEffect} from 'react';
import {getProposals} from "../utilities/contract";
import walletStore from "../zustand/wallet";

function ProposalsArray() {

    const {address, proposals} = walletStore(state => ({ address: state.address, proposals: state.proposals }));
    const addProposals = walletStore.getState().addProposals;

    useEffect(() => {
        (async () => {
            addProposals(await getProposals(address));
        })();
    }, []);

    return (
        <><div className="proposals">
            {proposals.length > 0 &&
                <><h3>Your proposals</h3>
                    <table>
                        <tbody>
                        {proposals.map((proposal, index) =>
                            <tr key={index}>
                                <td>{proposal.description}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    
                </>
            }

            {proposals.length === 0 &&
            <div><h3>Your proposals</h3>You don't have any proposal registered yet</div>}
            </div>
        </>
    )
}

export default ProposalsArray;

