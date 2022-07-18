import React, {useEffect} from 'react';
import Voting from './elements/Voting'
import web3 from "./utilities/web3";
import {loadContract} from "./utilities/contract";
import walletStore from "./zustand/wallet";
import './App.css';
import {connect, disconnect} from "./utilities/wallet";

function App() {
  useEffect(() => {
    web3(async () => {
      await disconnect();
      await connect();
    }).then(async (web3Provider) => {
      walletStore.setState({ web3: web3Provider, ready: true });
      await loadContract(web3Provider);
      await connect();
    });
  }, []);

  return <Voting/>;
}
export default App;
