import React from 'react';
import walletStore from '../stores/wallet';
import {connect, disconnect} from "../helpers/wallet";

function Wallet() {
    // Load the data from store
    const { ready, connected, address } = walletStore(state => ({web3: state.web3, ready: state.ready, connected: state.connected, address: state.address}));

    const handleClick = async () => {
        if (!ready) {
            // Web3 must be ready before any interaction
            return;
        }

        if (!connected) {
            await connect();
        } else {
            // We want to disconnect the current account
            await disconnect();
        }
    }

    const classes = ['btn-wallet', 'btn'];
    let textButton = 'Loading';
    if (ready && !connected) {
        textButton = 'Connect'
    } else if (connected) {
        textButton = address.substr(0, 6) + '....' + address.substr(-4);
        classes.push('btn-wallet-connected');
    }

    return (
        <button id="wallet" onClick={handleClick}  className={classes.join(' ')}>
            {textButton}
        </button>
    );
}

export default Wallet;
