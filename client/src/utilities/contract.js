import votingContract from '../contracts/Voting.json';
import contractStore from '../zustand/contract';
import walletStore from '../zustand/wallet';
import Web3 from 'web3';

let contractInstance;

/**
 *
 * @param web3Provider
 * @return {Promise<void>}
 */
async function loadContract(web3Provider) {
    const networkId = await web3Provider.eth.net.getId();
    const deployedNetwork = votingContract.networks[networkId];

    if (!deployedNetwork || !deployedNetwork.address) {
        contractStore.setState({ noContractSet: true });
        return;
    }

    contractInstance = new web3Provider.eth.Contract(
        votingContract.abi,
        deployedNetwork && deployedNetwork.address,
    );

    const workflowStatus = await getWorkflowStatus();


    contractInstance.events.allEvents(
        {},
        (err, event) => {
            if (err) {
                return console.warn(err);
            }
            triggerEvent(event)
        }
    );

    subscribeEvent('WorkflowStatusChange', (event) => {
        contractStore.setState({ workflowStatus: event.returnValues.newStatus });
        switch (event.returnValues.newStatus) {
            case '0':
                walletStore.getState().resetVote();
                contractStore.getState().resetContract();
                break;
            case '1':
                contractStore.getState().addLog('Proposal registration is started');
                break;
            case '2':
                contractStore.getState().addLog('Proposal registration ended');
                break;
            case '3':
                contractStore.getState().addLog('Voting session started');
                break;
            case '4':
                contractStore.getState().addLog('Voting sessions ended');
                break;
            case '5':
                contractStore.getState().addLog('Votes tallied');
                break;
        }
    });

    subscribeEvent('VoterRegistered', (event) => {
        if (Web3.utils.toChecksumAddress(event.returnValues.voterAddress) === Web3.utils.toChecksumAddress(walletStore.getState().address)) {
            walletStore.setState({ isVoter: true });
            contractStore.getState().addLog('You have been registered as a voter');

        } else if (walletStore.getState().isOwner) {
            contractStore.getState().addLog('New voter added ' + event.returnValues.voterAddress);
        }

        contractStore.getState().addVoter({
            address: event.returnValues.voterAddress
        });
    });

    subscribeEvent('ProposalRegistered', async (event) => {
        if (Web3.utils.toChecksumAddress(event.returnValues.voter) === Web3.utils.toChecksumAddress(walletStore.getState().address)) {
            const proposal = await getProposal(event.returnValues.proposalId);

            contractStore.getState().addLog('Your proposal has been registered #' + event.returnValues.proposalId);

            walletStore.getState().addProposal({
                proposalId: event.returnValues.proposalId,
                description: proposal.description,
            });
        } else if(walletStore.getState().isOwner) {
            contractStore.getState().addLog('A new proposal has been registered #' + event.returnValues.proposalId);
        }
    });

    subscribeEvent('Voted', (event) => {
        if (Web3.utils.toChecksumAddress(event.returnValues.voter) === Web3.utils.toChecksumAddress(walletStore.getState().address)) {
            walletStore.setState({ hasVoted: true, votedProposalId: event.returnValues.proposalId });
            contractStore.getState().addLog('Your vote has been saved');
        } else if (walletStore.getState().isOwner) {
            contractStore.getState().addLog('A new vote happened from ' + event.returnValues.voter);
        }
    });

    contractStore.setState({ ready: true, workflowStatus, address: deployedNetwork.address });
}

/**
 *
 * @param address
 * @return {Promise<*[]>}
 */
async function getPermissions(address) {
    if (!contractInstance) {
        return;
    }
    const voter = await getVoter(address);

    if (voter.isRegistered) {
        walletStore.setState({ isVoter: true, hasVoted: voter.hasVoted, votedProposalId: voter.votedProposalId });
    }

    const owner = await contractInstance.methods.owner().call();

    if (Web3.utils.toChecksumAddress(owner) === Web3.utils.toChecksumAddress(address)) {
        walletStore.setState({ isOwner: true });
    }
}

/**
 *
 * @param address
 * @return {Promise<{hasVoted: boolean, isRegistered: boolean, votedProposalId}>}
 */
async function getVoter(address) {
    const voter = await contractInstance.methods.voters(address).call();

    return (({ isRegistered, hasVoted, votedProposalId, sessionId }) => ({ isRegistered, hasVoted, votedProposalId, sessionId }))(voter);
}

/**
 *
 * @return {Promise<null|*>}
 */
async function getWorkflowStatus() {
    if (!contractInstance) {
        return null;
    }
    return await contractInstance.methods.workflowStatus().call();
}

/**
 *
 * @param address
 * @return {Promise<*>}
 */
async function setVoter(address) {
    return await contractInstance.methods.addVoter(address).send({from: walletStore.getState().address});
}

/**
 *
 * @param proposalId
 * @return {Promise<*>}
 */
async function vote(proposalId) {
    return await contractInstance.methods.vote(proposalId).send({from: walletStore.getState().address});
}

/**
 *
 * @return {Promise<*>}
 */
async function nextStatus() {
    return await contractInstance.methods.nextStatus().send({from: walletStore.getState().address});
}

/**
 *
 * @return {Promise<*>}
 */
 async function startProposalsRegistering() {
    return await contractInstance.methods.startProposalsRegistering().send({from: walletStore.getState().address});
}

/**
 *
 * @return {Promise<*>}
 */
 async function endProposalsRegistering() {
    return await contractInstance.methods.endProposalsRegistering().send({from: walletStore.getState().address});
}

/**
 *
 * @return {Promise<*>}
 */
 async function startVotingSession() {
    return await contractInstance.methods.startVotingSession().send({from: walletStore.getState().address});
}

/**
 *
 * @return {Promise<*>}
 */
 async function endVotingSession() {
    return await contractInstance.methods.endVotingSession().send({from: walletStore.getState().address});
}

/**
 *
 * @param proposal
 * @return {Promise<*>}
 */
async function addProposal(proposal) {
    return await contractInstance.methods.addProposal(proposal).send({from: walletStore.getState().address});
}

/**
 *
 * @param proposalId
 * @return {Promise<*>}
 */
async function getProposal(proposalId) {
    return await contractInstance.methods.proposals(proposalId).call();
}

/**
 *
 * @param workflowStatus
 * @return {string}
 */
function getWorkflowStatusName(workflowStatus) {
    workflowStatus = workflowStatus.toString();
    let status;

    switch (workflowStatus) {
        case '0':
            status = 'Registering voters'
            break;
        case '1':
            status = 'Proposal registration'
            break;
        case '2':
            status = 'Proposal registration has ended'
            break;
        case '3':
            status = 'Voting session'
            break;
        case '4':
            status = 'Voting session has ended'
            break;
        case '5':
            status = 'Votes have been tallied'
            break;
        default:
            status = 'This status does not exist'
    }

    return status;
}

/**
 *
 * @return {Promise<*[]>}
 */
async function getVoters() {
    const voterEvents = await contractInstance.getPastEvents('VoterRegistered', {
        fromBlock: 0,
        toBlock: 'latest',
    });

    const voters = [];

    for (const voter of voterEvents) {
        voters.push({
            address: voter.returnValues.voterAddress,
        });
    }

    return voters;
}

/**
 *
 * @param addressFrom
 * @return {Promise<*[]>}
 */
async function getProposals(addressFrom = null) {

    const proposals = await contractInstance.getPastEvents('ProposalRegistered', {
        fromBlock: 0,
        toBlock: 'latest',
    });

    const proposalsArray = [];

    for (const proposalEvent of proposals) {
        const proposal = await getProposal(proposalEvent.returnValues.proposalId);
        proposalsArray.push({
            id: proposalEvent.returnValues.proposalId,
            description: proposal.description,
            voteCount: proposal.voteCount,
        });
    }

    return proposalsArray;
}

/**
 *
 * @return {Promise<*>}
 */
 async function tallyVotes() {
    return await contractInstance.methods.tallyVotes().send({from: walletStore.getState().address});
}

/**
 *
 */
 async function getWinningProposalId() {
    const winning = await contractInstance.methods.getWinningProposalId().call();
    return {proposalId: winning.proposalId, description: winning.description, voteCount: winning.voteCount};

}

const subscriptions = {};
function subscribeEvent(eventName, callback) {
    if (subscriptions[eventName] === undefined) {
        subscriptions[eventName] = [];
    }
    subscriptions[eventName].push(callback);
}

function triggerEvent(event) {
    if (subscriptions[event.event] !== undefined) {
        for (const evt of Object.values(subscriptions[event.event])) {
            evt(event);
        }
    }
    if (subscriptions['*'] !== undefined) {
        for (const evt of Object.values(subscriptions['*'])) {
            evt(event);
        }
    }
}

export {
    loadContract,
    getWorkflowStatus,
    getPermissions,
    getVoters,
    setVoter,
    vote,
    getWorkflowStatusName,
    nextStatus,
    startProposalsRegistering,
    endProposalsRegistering,
    startVotingSession,
    endVotingSession,
    addProposal,
    getProposals,
    tallyVotes,
    getWinningProposalId
};
