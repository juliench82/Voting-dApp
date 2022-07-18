import React, {useEffect} from 'react';
import Voting from './pages/Voting'
import web3 from "./helpers/web3";
import {loadContract} from "./helpers/contract";
import walletStore from "./stores/wallet";
import './assets/css/normalize.css';
import './assets/css/app.css';
import {connect, disconnect} from "./helpers/wallet";
import appStore from "./stores/app";

function App() {
  useEffect(() => {
    web3(async () => {
      await disconnect();
      await connect();
    }).then(async (web3Provider) => {
      walletStore.setState({ web3: web3Provider, ready: true });

      // Load the contract
      try {
        await loadContract(web3Provider);
      } catch (e) {
        appStore.setState({startError: 'Loading contract failed. Please check your network'})
      }

      await connect();
    });
  }, []);

  return <Voting />;
}
export default App;
