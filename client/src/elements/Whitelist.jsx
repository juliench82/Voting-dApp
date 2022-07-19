import React, {useEffect} from 'react';
import {getVoters} from "../utilities/contract";
import contractStore from "../zustand/contract";

function Whitelist() {

    const {voters} = contractStore(state => ({ voters: state.voters }));
    const addVoters = contractStore.getState().addVoters;

    useEffect(() => {
        (async () => {
            addVoters(await getVoters());
        })();
    }, []);

    return (
        <><div className="whitelist">
            <><h3>Voters whitelisted</h3>
                <table>
                    <tbody>
                    {voters.map((voter, index) =>
                        <tr key={index}>
                            <td>{voter.address}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </>
    
        {voters.length === 0 &&
        <div>You don't have any voter registered yet</div>
        }
        </div>
        </>
    )
}

export default Whitelist;
