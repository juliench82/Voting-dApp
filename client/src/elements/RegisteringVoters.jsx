import React, {useEffect, useState} from 'react';
import {setVoter, getVoters} from "../utilities/contract";
import contractStore from "../zustand/contract";

function RegisteringVoters() {
    const [getInput, setInput] = useState('');
    const [getDisabled, setDisabled] = useState(true);

    const {voters} = contractStore(state => ({ voters: state.voters }));
    const addVoters = contractStore.getState().addVoters;

    useEffect(() => {
        (async () => {
            addVoters(await getVoters());
        })();
    }, []);

    const handleAddVoter = async () => {
        await setVoter(getInput);
        setInput('');
    }

    const handleInputChange = (e) => {
        setDisabled(!isAddressValid(e.target.value));
        setInput(e.target.value);
    }
    
    const isAddressValid = (address) => {
        if (typeof address !== 'string') {
            return false;
        }

        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    let allowedAccess=false;

    return (
        <>
            <div className="central">
            <h2>Add a voter</h2>
            <input className="input-address" value={getInput} onChange={handleInputChange} />
            <button disabled={getDisabled} onClick={handleAddVoter}>Add voter</button>
                <><h3>Voters whitelisted</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {voters.map((voter, index) =>
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{voter.address}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </>
        
            {voters.length === 0 &&
            <div>
                You don't have any voter registered yet</div>
            }
            </div>
        </>
    )
}

export default RegisteringVoters;

