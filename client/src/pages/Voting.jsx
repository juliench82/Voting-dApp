import React from 'react';
import Wallet from "../components/Wallet";
import WorkflowStatus from "../components/WorkflowStatus";
import UserStatus from "../components/UserStatus";
import VotersAddresses from "../components/VotersAddresses";
import ProposalsArray from "../components/ProposalsArray";
import walletStore from "../stores/wallet";
import contractStore from "../stores/contract";
import appStore from "../stores/app";
import RegisteringVoters from "./RegisteringVoters";
import StartProposalsRegistering from "../components/StartProposalsRegistering";
import EndProposalsRegistering from "../components/EndProposalsRegistering";
import StartVotingSession from "../components/StartVotingSession";
import EndVotingSession from "../components/EndVotingSession";
import GetResults from "../components/GetResults";
import RegisteringProposals from "./RegisteringProposals";
import VotingSession from "./VotingSession";
import NextStatus from "../components/NextStatus";
import ProposalsRegistrationEnded from "./ProposalsRegistrationEnded";
import NotConnected from "./NotConnected";
import VotingSessionEnded from "./VotingSessionEnded";
import VotesTallied from "./VotesTallied";

function Voting() {
    const {isVoter, isOwner, connected} = walletStore(state => ({ isVoter: state.isVoter, isOwner: state.isOwner, connected: state.connected }));
    const {ready, noContractSet, workflowStatus, address} = contractStore(state => ({ ready: state.ready, noContractSet: state.noContractSet, workflowStatus: state.workflowStatus, address: state.address}));
    const {startError} = appStore(state => ({startError: state.startError}));

    if (!ready) {
        return (
            <>
                <div id="main">
                    <p>Please connect your wallet</p>
                    {startError !== null ? startError : "Please connect your wallet"}
                </div>
            </>
        );
    }

    if (noContractSet) {
        return (
            <>
                <div id="main">
                    No contract set
                </div>
            </>
        );
    }

    let displayWorkflowStatus = false, displayNextStatus = false, displayResetBallot = false, displayStartProposalsRegistering = false, displayEndProposalsRegistering = false, displayStartVotingSession = false, displayGetWinner = false, displayEndVotingSession = false, allowedAccess = false;

    if (isOwner || isVoter) {
        displayWorkflowStatus = true;
        allowedAccess = true;
    }

    if (isOwner && workflowStatus === '0') {
        displayNextStatus = false;
        displayStartProposalsRegistering = true;
    }

    if (isOwner && workflowStatus === '1') {
        displayNextStatus = false;
        displayEndProposalsRegistering = true;
    }

    if (isOwner && workflowStatus === '2') {
        displayNextStatus = false;
        displayStartVotingSession = true;
    }

    if (isOwner && workflowStatus === '3') {
        displayNextStatus = false;
        displayEndVotingSession = true;
    }

    if (isOwner && workflowStatus === '4') {
        displayGetWinner = true;
    }

    if (isOwner && workflowStatus === '5') {
        displayResetBallot = false;
    }

    return (
        <>
            <div id="header">
           
                {!allowedAccess &&
                    <div><p>You are not allowed to access the application.</p>
                    <a target="_blank" rel="noopener noreferrer" href={'https://ropsten.etherscan.io/address/' + address}>Contract address : {address}</a>
                    </div>       
                }
                <div className="side-right">
                    <Wallet/>
                </div>

            </div>

            <div id="main">
                {connected &&
                    <div id="sidebars">
                        {(displayWorkflowStatus || displayNextStatus || displayStartProposalsRegistering || displayEndProposalsRegistering || displayStartVotingSession || displayEndVotingSession || displayGetWinner || displayResetBallot) &&
                            <div className="sidebar">
                                {displayWorkflowStatus && <WorkflowStatus/>}
                                {displayNextStatus && <NextStatus/>}
                                {displayStartProposalsRegistering && <StartProposalsRegistering/>}
                                {displayEndProposalsRegistering && <EndProposalsRegistering/>}
                                {displayStartVotingSession && <StartVotingSession/>}
                                {displayEndVotingSession && <EndVotingSession/>}
                                {displayGetWinner && <GetResults/>}
                                {/*{displayResetBallot && <ResetBallot/>}*/}
                            </div>
                        }
                        {allowedAccess &&
                            <div className="sidebar">
                                <UserStatus/>
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
