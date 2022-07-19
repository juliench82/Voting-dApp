import React from 'react';
import walletStore from "../zustand/wallet";

function UserStatus() {

    const {isVoter, isOwner} = walletStore(state => ({ isVoter: state.isVoter, isOwner: state.isOwner }));

    return (
    <div>
        <h3>Your role(s)</h3>
        <div className="Status">
            <div>Owner {isOwner ? '┤' : ' '} </div>
            <div>Voter {isVoter ? '┤' : ' '} </div>
        </div>
    </div>    
    );
}

export default UserStatus;
