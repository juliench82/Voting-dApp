import React from 'react';
import contractStore from "../zustand/contract";

function ContractAddress() {
    const {address} = contractStore(state => ({address: state.address}));

    return (
    <div>
        <h3>Contract address</h3>
        <div className="contract">
        <div><a target="_blank" rel="noopener noreferrer" href={'https://ropsten.etherscan.io/address/' + address}> {address}</a></div>
        </div>
    </div>
    );
}

export default ContractAddress;
