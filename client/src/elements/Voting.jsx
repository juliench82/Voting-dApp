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
import GetResults from "./GetResults";
import RegisteringProposals from "./RegisteringProposals";
import VotingSession from "./VotingSession";
import NextStatus from "./NextStatus";
import ProposalsRegistrationEnded from "./ProposalsRegistrationEnded";
import NotConnected from "./NotConnected";
import VotingSessionEnded from "./VotingSessionEnded";
import VotesTallied from "./VotesTallied";
import ContractAddress from "./ContractAddress"

function Voting() {
    const {isVoter, isOwner, connected} = walletStore(state => ({ isVoter: state.isVoter, isOwner: state.isOwner, connected: state.connected }));
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
                    <div><p>Please connect your wallet to get access to the application...</p>
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
                                <ContractAddress/>
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
