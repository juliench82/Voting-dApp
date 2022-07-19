import React from 'react';
import walletStore from "../zustand/wallet";

function UserStatus() {

    const {isVoter, isOwner} = walletStore(state => ({ isVoter: state.isVoter, isOwner: state.isOwner }));

    return (
    <div>
        <h3>Your status(es)</h3>
        <div className="Status">
            <div>{isOwner ? '†' : ' '} Owner</div>
            <div>{isVoter ? '†' : ' '} Voter</div>
        </div>
    </div>    
    );
}

export default UserStatus;
