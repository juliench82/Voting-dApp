import React from 'react';
import walletStore from "../zustand/wallet";

function UserStatus() {

    const {isVoter, isOwner} = walletStore(state => ({ isVoter: state.isVoter, isOwner: state.isOwner }));

    return (
        <div className="test">
            <h3>Your permissions :</h3>
            <div>{isOwner ? '√' : ' '} Owner</div>

            <div>{isVoter ? '√' : ' '} Voter</div>
        </div>
    );
}

export default UserStatus;
