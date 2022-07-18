import {getPermissions} from "./contract";
import walletStore from "../stores/wallet";

async function connect() {
    const storeConnect = walletStore.getState().connect;
    const web3 = walletStore.getState().web3;

    const accounts = await web3.eth.getAccounts();

    if (Array.isArray(accounts) && accounts[0]) {
        storeConnect(accounts[0]);
        await getPermissions(accounts[0]);
        return true;
    }

    return false;
}

function disconnect() {
    walletStore.getState().disconnect();
}

export {connect, disconnect}
