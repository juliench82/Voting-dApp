import React from 'react';
import Wallet from "./Wallet";
import WorkflowStatus from "./WorkflowStatus";
import UserStatus from "./UserStatus";
import walletStore from "../zustand/wallet";
import contractStore from "../zustand/contract";
import RegisteringVoters from "./RegisteringVoters";
import StartProposalsRegistering from "./StartProposalsRegistering";
import EndProposalsRegistering from "./EndProposalsRegistering";
import StartVotingSession from "./StartVotingSession";
import EndVotingSession from "./EndVotingSession";
import TallyVotes from "./TallyVotes";
import RegisteringProposals from "./RegisteringProposals";
import VotingSession from "./VotingSession";
import ProposalsRegistrationEnded from "./ProposalsRegistrationEnded";
import NotConnected from "./NotConnected";
import VotingSessionEnded from "./VotingSessionEnded";
import VotesTallied from './VotesTallied';
import ContractAddress from "./ContractAddress"
import Whitelist from './Whitelist';
import ProposalsArray from './ProposalsArray';

function Voting() {
    const {isVoter, isOwner, connected} = walletStore(state => ({ isVoter: state.isVoter, isOwner: state.isOwner, connected: state.connected, voters: state.voters }));
    const {ready, workflowStatus} = contractStore(state => ({ ready: state.ready, workflowStatus: state.workflowStatus}));

    if (!ready) {
        return (
            <>
                <div id="main">
                    <p>Please connect your wallet</p>
                </div>
            </>
        );
    }

    let displayWorkflowStatus = false, displayStartProposalsRegistering = false, displayEndProposalsRegistering = false, displayStartVotingSession = false, displayTallyVotes = false, displayEndVotingSession = false, allowedAccess = false;

    if (isOwner || isVoter) {
        displayWorkflowStatus = true;
        allowedAccess = true;
    }

    if (isOwner && workflowStatus === '0') {
        displayStartProposalsRegistering = true;
    }

    if (isOwner && workflowStatus === '1') {
        displayEndProposalsRegistering = true;
    }

    if (isOwner && workflowStatus === '2') {
        displayStartVotingSession = true;
    }

    if (isOwner && workflowStatus === '3') {
        displayEndVotingSession = true;
    }

    if (isOwner && workflowStatus === '4') {
        displayTallyVotes = true;
    }

    if (isOwner && workflowStatus === '5') {

    }

    return (
        <>
            <div id="header">
                {!allowedAccess &&
                    <div><p>Please connect your wallet to get access to the application...</p>
                    </div>
                }
                <div className="side-right">
                    <Wallet/>
                </div>
            </div>
            <div id="main">
                        {allowedAccess &&
                            <div className="leftbar">
                                <UserStatus/>
                                <ContractAddress/>
                                <Whitelist/>
                                <ProposalsArray/>
                            </div>
                        }
                        {connected &&
                            <div id="sidebars">
                            {(displayWorkflowStatus || displayStartProposalsRegistering || displayEndProposalsRegistering || displayStartVotingSession || displayEndVotingSession || displayTallyVotes ) &&
                            <div className="sidebar">
                                {displayWorkflowStatus && <WorkflowStatus/>}
                                {displayStartProposalsRegistering && <StartProposalsRegistering/>}
                                {displayEndProposalsRegistering && <EndProposalsRegistering/>}
                                {displayStartVotingSession && <StartVotingSession/>}
                                {displayEndVotingSession && <EndVotingSession/>}
                                {displayTallyVotes && <TallyVotes/>}
                            </div>
                        }
                    </div>
                }
                <div id="content">
                    {allowedAccess &&
                        <div>
                            {!connected && <NotConnected/>}
                            {(isOwner && workflowStatus === '0') && <RegisteringVoters/>}
                            {(isVoter && workflowStatus === '1') && <RegisteringProposals/>}
                            {(isVoter && workflowStatus === '2') && <ProposalsRegistrationEnded/>}
                            {(isVoter && workflowStatus === '3') && <VotingSession/>}
                            {(isVoter && workflowStatus === '4') && <VotingSessionEnded/>}
                            {(isVoter && workflowStatus === '5') && <VotesTallied/>}
                        </div>
                    }
                </div>

            </div>
        </>
    )
}

export default Voting;
