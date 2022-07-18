const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Voting = artifacts.require('Voting');

contract('Voting', (accounts) => {

    const owner = accounts[0];
    const adasaurus = accounts[1];
    const buitreraptor = accounts[2];
    const carnotaurus = accounts[3];
    const denver = accounts[4];

    const WorkflowStatus = Object.freeze({
      'RegisteringVoters':0,
      'ProposalsRegistrationStarted':1,
      'ProposalsRegistrationEnded':2,
      'VotingSessionStarted': 3,
      'VotingSessionEnded': 4,
      'VotesTallied': 5
    });

    function VotingNewInstance() {
    return Voting.new({ from: owner });
    }

    // Testing contract creation
    describe('Testing contract creation', function () {
        it('should create a new contract instance', async () => {
            const instance = await VotingNewInstance();
            expect(instance.address).to.be.not.null;
        });
    });

    let votingInstance, result;

    // Testing the WorkflowStatusChange events mechanism
    describe('Test WorkflowStatusChange events', function () {

        describe('Step 1: "RegisteringVoters"', function () {
            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(adasaurus, {from: owner});
            });

            it('should be initialized with "RegisteringVoters"', async () => {
                expect(await votingInstance.workflowStatus()).to.be.bignumber.equal(new BN(WorkflowStatus.RegisteringVoters));
            });
            it('should reject "addProposal" function', async () => {
                await expectRevert(votingInstance.addProposal('test', {from: adasaurus}), 'Proposals are not allowed yet');
            });
            it('should reject "endProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.endProposalsRegistering({from: owner}), 'Registering proposals havent started yet');
            });
            it('should reject "startVotingSession" function', async () => {
                await expectRevert(votingInstance.startVotingSession({from: owner}), 'Registering proposals phase is not finished');
            });
            it('should reject "setVote" function', async () => {
                await expectRevert(votingInstance.setVote(1, {from: adasaurus}), 'Voting session havent started yet');
            });
            it('should reject "endVotingSession" function', async () => {
                await expectRevert(votingInstance.endVotingSession({from: owner}), 'Voting session havent started yet');
            });
            it('should reject "tallyVotes" function', async () => {
                await expectRevert(votingInstance.tallyVotes({from: owner}), 'Current status is not voting session ended');
            });
        });

        describe('Step 2: "ProposalsRegistrationStarted"', function () {
            let result;

            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(adasaurus, {from: owner});
            });

            it('should be rejected if caller is not the owner', async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: adasaurus}), 'Ownable: caller is not the owner.');
            });
            it('should update internal state to "ProposalsRegistrationStarted"', async () => {
                result = await votingInstance.startProposalsRegistering({from: owner});
                expect(await votingInstance.workflowStatus()).to.be.bignumber.equal(new BN(WorkflowStatus.ProposalsRegistrationStarted));
            });
            it('should emit a "WorkflowStatusChange" status change event', async () => {
                expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.RegisteringVoters), newStatus: new BN(WorkflowStatus.ProposalsRegistrationStarted)})
            });
            it('should reject "addVoter" function', async () => {
                await expectRevert(votingInstance.addVoter(adasaurus, {from: owner}), 'Voters registration is not open yet');
            });
            it('should reject "startProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: owner}), 'Registering proposals cant be started now');
            });
            it('should reject "startVotingSession" function', async () => {
                await expectRevert(votingInstance.startVotingSession({from: owner}), 'Registering proposals phase is not finished');
            });
            it('should reject "setVote" function', async () => {
                await expectRevert(votingInstance.setVote(1, {from: adasaurus}), 'Voting session havent started yet');
            });
            it('should reject "endVotingSession" function', async () => {
                await expectRevert(votingInstance.endVotingSession({from: owner}), 'Voting session havent started yet');
            });
            it('should reject "tallyVotes" function', async () => {
                await expectRevert(votingInstance.tallyVotes({from: owner}), 'Current status is not voting session ended');
            });
        });

        describe('Step 3: "endProposalsRegistering"', function () {
            let result;

            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(adasaurus, {from: owner});
                await votingInstance.startProposalsRegistering({from: owner});
            });

            it('should be rejected if caller is not the owner', async () => {
                await expectRevert(votingInstance.endProposalsRegistering({from: adasaurus}), 'Ownable: caller is not the owner.');
            });
            it('should update internal state to "ProposalsRegistrationEnded"', async () => {
                result = await votingInstance.endProposalsRegistering({from: owner});
                expect(await votingInstance.workflowStatus()).to.be.bignumber.equal(new BN(WorkflowStatus.ProposalsRegistrationEnded));
            });
            it('should emit a "WorkflowStatusChange" status change event', async () => {
                expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.ProposalsRegistrationStarted), newStatus: new BN(WorkflowStatus.ProposalsRegistrationEnded)})
            });
            it('should reject "addVoter" function', async () => {
                await expectRevert(votingInstance.addVoter(adasaurus, {from: owner}), 'Voters registration is not open yet');
            });
            it('should reject "startProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: owner}), 'Registering proposals cant be started now');
            });
            it('should reject "addProposal" function', async () => {
                await expectRevert(votingInstance.addProposal('test', {from: adasaurus}), 'Proposals are not allowed yet');
            });
            it('should reject "endProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.endProposalsRegistering({from: owner}), 'Registering proposals havent started yet');
            });
            it('should reject "endVotingSession" function', async () => {
                await expectRevert(votingInstance.endVotingSession({from: owner}), 'Voting session havent started yet');
            });
            it('should reject "tallyVotes" function', async () => {
                await expectRevert(votingInstance.tallyVotes({from: owner}), 'Current status is not voting session ended');
            });
        });

        describe('Step 4: "startVotingSession"', function () {
            let result;
            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(adasaurus, {from: owner});
                await votingInstance.startProposalsRegistering({from: owner});
                await votingInstance.endProposalsRegistering({from: owner});
            });

            it('should be rejected if caller is not the owner', async () => {
                await expectRevert(votingInstance.startVotingSession({from: adasaurus}), 'Ownable: caller is not the owner.');
            });
            it('should update internal state to "VotingSessionStarted"', async () => {
                result = await votingInstance.startVotingSession({from: owner});
                expect(await votingInstance.workflowStatus()).to.be.bignumber.equal(new BN(WorkflowStatus.VotingSessionStarted));
            });
            it('should emit a "WorkflowStatusChange" status change event', async () => {
                expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.ProposalsRegistrationEnded), newStatus: new BN(WorkflowStatus.VotingSessionStarted)})
            });
            it('should reject "addVoter" function', async () => {
                await expectRevert(votingInstance.addVoter(adasaurus, {from: owner}), 'Voters registration is not open yet');
            });
            it('should reject "startProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: owner}), 'Registering proposals cant be started now');
            });
            it('should reject "addProposal" function', async () => {
                await expectRevert(votingInstance.addProposal('test', {from: adasaurus}), 'Proposals are not allowed yet');
            });
            it('should reject "endProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.endProposalsRegistering({from: owner}), 'Registering proposals havent started yet');
            });
            it('should reject "startVotingSession" function', async () => {
                await expectRevert(votingInstance.startVotingSession({from: owner}), 'Registering proposals phase is not finished');
            });
            it('should reject "tallyVotes" function', async () => {
                await expectRevert(votingInstance.tallyVotes({from: owner}), 'Current status is not voting session ended');
            });
        });

        describe('Step 4: "endVotingSession"', function () {
            let result;
            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(adasaurus, {from: owner});
                await votingInstance.startProposalsRegistering({from: owner});
                await votingInstance.endProposalsRegistering({from: owner});
                await votingInstance.startVotingSession({from: owner});
            });

            it('should be rejected if caller is not the owner', async () => {
                await expectRevert(votingInstance.endVotingSession({from: adasaurus}), 'Ownable: caller is not the owner.');
            });
            it('should update internal state to "VotingSessionEnded"', async () => {
                result = await votingInstance.endVotingSession({from: owner});
                expect(await votingInstance.workflowStatus()).to.be.bignumber.equal(new BN(WorkflowStatus.VotingSessionEnded));
            });
            it('should emit a "WorkflowStatusChange" status change event', async () => {
                expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.VotingSessionStarted), newStatus: new BN(WorkflowStatus.VotingSessionEnded)})
            });
            it('should reject "addVoter" function', async () => {
                await expectRevert(votingInstance.addVoter(adasaurus, {from: owner}), 'Voters registration is not open yet');
            });
            it('should reject "startProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: owner}), 'Registering proposals cant be started now');
            });
            it('should reject "addProposal" function', async () => {
                await expectRevert(votingInstance.addProposal('test', {from: adasaurus}), 'Proposals are not allowed yet');
            });
            it('should reject "endProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.endProposalsRegistering({from: owner}), 'Registering proposals havent started yet');
            });
            it('should reject "startVotingSession" function', async () => {
                await expectRevert(votingInstance.startVotingSession({from: owner}), 'Registering proposals phase is not finished');
            });
            it('should reject "setVote" function', async () => {
                await expectRevert(votingInstance.setVote(1, {from: adasaurus}), 'Voting session havent started yet');
            });
            it('should reject "endVotingSession" function', async () => {
                await expectRevert(votingInstance.endVotingSession({from: owner}), 'Voting session havent started yet');
            });
        });

        describe('Step 5: "tallyVotes"', function () {
            let result;
            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(adasaurus, {from: owner});
                await votingInstance.startProposalsRegistering({from: owner});
                await votingInstance.endProposalsRegistering({from: owner});
                await votingInstance.startVotingSession({from: owner});
                await votingInstance.endVotingSession({from: owner});
            });

            it('should be rejected if caller is not the owner', async () => {
                await expectRevert(votingInstance.endVotingSession({from: adasaurus}), 'Ownable: caller is not the owner.');
            });
            it('should update internal state to "VotingSessionEnded"', async () => {
                result = await votingInstance.tallyVotes({from: owner});
                expect(await votingInstance.workflowStatus()).to.be.bignumber.equal(new BN(WorkflowStatus.VotesTallied));
            });
            it('should emit a "WorkflowStatusChange" status change event', async () => {
                expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.VotingSessionEnded), newStatus: new BN(WorkflowStatus.VotesTallied)})
            });
            it('should reject "addVoter" function', async () => {
                await expectRevert(votingInstance.addVoter(adasaurus, {from: owner}), 'Voters registration is not open yet');
            });
            it('should reject "startProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: owner}), 'Registering proposals cant be started now');
            });
            it('should reject "addProposal" function', async () => {
                await expectRevert(votingInstance.addProposal('test', {from: adasaurus}), 'Proposals are not allowed yet');
            });
            it('should reject "endProposalsRegistering" function', async () => {
                await expectRevert(votingInstance.endProposalsRegistering({from: owner}), 'Registering proposals havent started yet');
            });
            it('should reject "setVote" function', async () => {
                await expectRevert(votingInstance.setVote(1, {from: adasaurus}), 'Voting session havent started yet');
            });
            it('should reject "startVotingSession" function', async () => {
                await expectRevert(votingInstance.startVotingSession({from: owner}), 'Registering proposals phase is not finished');
            });
            it('should reject "endVotingSession" function', async () => {
                await expectRevert(votingInstance.endVotingSession({from: owner}), 'Voting session havent started yet');
            });
            it('should reject "tallyVotes" function', async () => {
                await expectRevert(votingInstance.tallyVotes({from: owner}), 'Current status is not voting session ended');
            });
        });
    });

    // Variables initialization
    describe('Test public variables initialization', function () {
        before(async () => {
        votingInstance = await VotingNewInstance();
        });

        it('winningProposalID is initialized to 0', async () => {
            expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal('0');
        });

        it('WorkflowStatus should be set to 0', async () => {
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal('0');
        });
    });

    // Added voters and starting proposal registration
    const restoreStartProposalsRegistering = async () => {
        votingInstance = await VotingNewInstance();
        await votingInstance.addVoter(owner);
        await votingInstance.addVoter(adasaurus);
        await votingInstance.addVoter(buitreraptor);
        await votingInstance.startProposalsRegistering();
    }

    // Added proposals and starting voting session
    const restoreVotingSessionStarted = async () => {
        await restoreStartProposalsRegistering();
        await votingInstance.addProposal('This is a proposal from adasaurus', {from: adasaurus});
        await votingInstance.addProposal('This is a proposal from buitreraptor', {from: buitreraptor});
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
    }

    // Added voters, added proposals, added votes and ending voting session
    const restoreVotingSessionEnded = async () => {
        await restoreVotingSessionStarted();
        await votingInstance.setVote(0, {from: owner});
        await votingInstance.setVote(1, {from: adasaurus});
        await votingInstance.setVote(1, {from: buitreraptor});
        await votingInstance.endVotingSession();
    }

    // Added voters, added proposals, added votes and state is tally votes
    const restoreVotesTallied = async () => {
        await restoreVotingSessionEnded();
        await votingInstance.tallyVotes();
    }
    
    // Reset the contract
    before(async () => {
        votingInstance = await VotingNewInstance();
    });

    describe('Getters', async () => {

        before(async () => {
            await restoreVotesTallied();
        });

        describe('Test getVoter function', async () => {
            it('Only voters can get a voter', async () =>{
                await expectRevert(votingInstance.getVoter.call(owner, {from: carnotaurus}), 'You\'re not a voter');
            });

            it('Get a voter', async () => {
                expect((await votingInstance.getVoter.call(owner, {from: adasaurus})).isRegistered).to.be.true;
                expect((await votingInstance.getVoter.call(owner, {from: adasaurus})).votedProposalId).to.be.equal('0');
                expect((await votingInstance.getVoter.call(owner, {from: adasaurus})).hasVoted).to.be.true;
            });

            it('should require 1 parameter', async () => {
                await expectRevert( votingInstance.getVoter(), 'Invalid number of parameters for "getVoter". Got 0 expected 1!');
            });

            it('should require an address as parameter', async () => {
                await expectRevert( votingInstance.getVoter('test'), 'invalid address (argument="address", value="test", code=INVALID_ARGUMENT, version=address/5.0.5) (argument="_addr", value="test", code=INVALID_ARGUMENT, version=abi/5.0.7)' );
            });
        });

        describe('Test getOneProposal function', async () => {
            it('Only voters can get a proposal', async () =>{
                await expectRevert(votingInstance.getOneProposal.call(owner, {from: carnotaurus}), 'You\'re not a voter');
            });

            it('Get one proposal', async () => {
                expect((await votingInstance.getOneProposal.call('0', {from: adasaurus})).description).to.be.equal('This is a proposal from adasaurus');
            });
        });
    });

    describe('Test addVoter function', async () => {

        beforeEach(async () => {
            votingInstance = await VotingNewInstance();
        });

        it('Only owner can add a voter', async () =>{
            await expectRevert(votingInstance.addVoter(carnotaurus, {from: adasaurus}), 'Ownable: caller is not the owner');
            await expectRevert(votingInstance.addVoter(carnotaurus, {from: buitreraptor}), 'Ownable: caller is not the owner');
            await votingInstance.addVoter(carnotaurus, {from: owner});
            expect((await votingInstance.getVoter.call(carnotaurus, {from: carnotaurus})).isRegistered).to.be.true;
        });

        it('Add a voter with correct values', async () => {
            await votingInstance.addVoter(adasaurus, {from: owner});
            const voteradasaurus = await votingInstance.getVoter.call(adasaurus, {from: adasaurus});
            expect(voteradasaurus.isRegistered).to.be.true;
            expect(voteradasaurus.hasVoted).to.be.false;
            expect(voteradasaurus.votedProposalId).to.be.bignumber.equal('0');

            await votingInstance.addVoter(buitreraptor, {from: owner});
            const voterbuitreraptor = await votingInstance.getVoter.call(buitreraptor, {from: adasaurus})
            expect(voterbuitreraptor.isRegistered).to.be.true;
            expect(voterbuitreraptor.hasVoted).to.be.false;
            expect(voterbuitreraptor.votedProposalId).to.be.bignumber.equal('0');
        });

        it('should require 1 parameter', async () => {
            await expectRevert( votingInstance.addVoter(), 'Invalid number of parameters for "addVoter". Got 0 expected 1!');
        });
        it('should require an address as parameter', async () => {
            await expectRevert( votingInstance.addVoter('test'), 'invalid address (argument="address", value="test", code=INVALID_ARGUMENT, version=address/5.0.5) (argument="_addr", value="test", code=INVALID_ARGUMENT, version=abi/5.0.7)' );
        });

        it('Can\'t add a voter twice', async () => {
            await votingInstance.addVoter(adasaurus, {from: owner});
            await expectRevert(votingInstance.addVoter(adasaurus), 'Already registered');
        });

        it('Emits the VoterRegistered event', async () => {
            const registeradasaurus = await votingInstance.addVoter(adasaurus, {from: owner});
            expectEvent(registeradasaurus, 'VoterRegistered', {
                voterAddress: adasaurus,
            });

            const registerbuitreraptor = await votingInstance.addVoter(buitreraptor, {from: owner});
            expectEvent(registerbuitreraptor, 'VoterRegistered', {
                voterAddress: buitreraptor,
            });
        });
    });

    describe('Test addProposal function', async () => {
        // No need to test again workflow status, it has been done before

        beforeEach(async () => {
            await restoreStartProposalsRegistering();
        });

        it('Only a voter can add a proposal', async () =>{
            await expectRevert(votingInstance.addProposal('This is a proposal from carnotaurus', {from: carnotaurus}), 'You\'re not a voter');
            await expectRevert(votingInstance.addProposal('This is the last of the dinos', {from: denver}), 'You\'re not a voter');
            await votingInstance.addProposal('This is a proposal from adasaurus', {from: adasaurus});
            expect((await votingInstance.getOneProposal.call('0', {from: adasaurus})).description).to.be.equal('This is a proposal from adasaurus');
        });

        it('Can\'t add an empty proposal', async () => {
            await expectRevert(votingInstance.addProposal('', {from: adasaurus}), 'Vous ne pouvez pas ne rien proposer');
        });

        it('Add a proposal with correct values', async () => {
            await votingInstance.addProposal('This is a proposal from adasaurus', {from: adasaurus})
            const proposaladasaurus = await votingInstance.getOneProposal.call('0', {from: adasaurus});
            expect(proposaladasaurus.description).to.be.equal('This is a proposal from adasaurus');
            expect(proposaladasaurus.voteCount).to.be.bignumber.equal('0');

            await votingInstance.addProposal('This is a proposal from buitreraptor', {from: buitreraptor})
            const proposalbuitreraptor = await votingInstance.getOneProposal.call('1', {from: buitreraptor});
            expect(proposalbuitreraptor.description).to.be.equal('This is a proposal from buitreraptor');
            expect(proposalbuitreraptor.voteCount).to.be.bignumber.equal('0');
        });

        it('should require 1 parameter', async () => {
            await expectRevert( votingInstance.getOneProposal(0, 10, {from: adasaurus}), 'Invalid number of parameters for "getOneProposal". Got 2 expected 1!');
        });
        it('should reject negative proposal id', async () => {
            await expectRevert( votingInstance.getOneProposal(-10, {from: adasaurus}), 'value out-of-bounds (argument="_id", value=-10, code=INVALID_ARGUMENT, version=abi/5.0.7)');
        });
        it('should reject proposal id out of bounds', async () => {
            await expectRevert.unspecified( votingInstance.getOneProposal(100, {from: adasaurus}));
        });

        it('Emits the ProposalRegistered event', async () => {
            const registeradasaurus = await votingInstance.addProposal('This is a proposal from adasaurus', {from: adasaurus});
            expectEvent(registeradasaurus, 'ProposalRegistered', {
                proposalId: '0',
            });

            const registerbuitreraptor = await votingInstance.addProposal('This is a proposal from buitreraptor', {from: buitreraptor});
            expectEvent(registerbuitreraptor, 'ProposalRegistered', {
                proposalId: '1',
            });
        });
    });

    describe('Testing setVote function', async () => {

        beforeEach(async () => {
            await restoreVotingSessionStarted();
        });

        it('Only a voter can vote', async () =>{
            await expectRevert(votingInstance.setVote('0', {from: carnotaurus}), 'You\'re not a voter');
            await expectRevert(votingInstance.setVote('1', {from: denver}), 'You\'re not a voter');
            await votingInstance.setVote('0', {from: adasaurus});
            expect((await votingInstance.getOneProposal.call('0', {from: adasaurus})).voteCount).to.be.bignumber.equal('1');
        });

        it('Can\'t vote for non existing proposal', async () => {
            await expectRevert(votingInstance.setVote('3', {from: adasaurus}), 'Proposal not found');
        });

        it('Can\'t vote twice', async () => {
            await votingInstance.setVote('0', {from: adasaurus});
            await expectRevert(votingInstance.setVote('0', {from: adasaurus}), 'You have already voted');
        });

        it('Add a vote with correct values', async () => {
            await votingInstance.setVote(0, {from: owner});
            await votingInstance.setVote(1, {from: adasaurus});
            await votingInstance.setVote(1, {from: buitreraptor});

            const proposalZero = await votingInstance.getOneProposal.call('0', {from: adasaurus});
            const proposalOne = await votingInstance.getOneProposal.call('1', {from: adasaurus});

            expect(proposalZero.voteCount).to.be.bignumber.equal('1');
            expect(proposalOne.voteCount).to.be.bignumber.equal('2');
        });

        it('should require 1 parameter', async () => {
            await expectRevert( votingInstance.setVote('', {from: adasaurus}), 'invalid BigNumber string (argument="value", value="", code=INVALID_ARGUMENT, version=bignumber/5.0.8)');
        });
        it('should revert for out of proposals boundaries (negative)', async () => {
            await expectRevert( votingInstance.setVote(-10, {from: adasaurus}), 'value out-of-bounds (argument="_id", value=-10, code=INVALID_ARGUMENT, version=abi/5.0.7)');
        });
        it('should revert for out of proposals boundaries (positive)', async () => {
            await expectRevert( votingInstance.setVote(100, {from: adasaurus}), 'Proposal not found');
        });

        it('Save a vote to a voter', async () => {
            await votingInstance.setVote(1, {from: adasaurus});
            await votingInstance.setVote(0, {from: buitreraptor});

            const voteadasaurus = await votingInstance.getVoter.call(adasaurus);
            const votebuitreraptor = await votingInstance.getVoter.call(buitreraptor);
            const voteOwner = await votingInstance.getVoter.call(owner);

            expect(voteadasaurus.votedProposalId).to.be.bignumber.equal('1');
            expect(voteadasaurus.hasVoted).to.be.true;

            expect(votebuitreraptor.votedProposalId).to.be.bignumber.equal('0');
            expect(votebuitreraptor.hasVoted).to.be.true;

            expect(voteOwner.hasVoted).to.be.false;
        });

        it('Emits the Voted event', async () => {
            const registeradasaurus = await await votingInstance.setVote(1, {from: adasaurus});
            expectEvent(registeradasaurus, 'Voted', {
                voter: adasaurus,
                proposalId: '1',
            });

            const registerbuitreraptor = await votingInstance.setVote(0, {from: buitreraptor});
            expectEvent(registerbuitreraptor, 'Voted', {
                voter: buitreraptor,
                proposalId: '0',
            });
        });
    });

    describe('Test tallyVotes function', async () => {

        beforeEach(async () => {
            await restoreVotingSessionEnded();
        });

        it('Only owner can tally votes', async () =>{
            await expectRevert(votingInstance.tallyVotes({from: adasaurus}), 'Ownable: caller is not the owner');
            await votingInstance.tallyVotes();
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal('5');
        });

        it('Emits "WorkflowStatusChange" event', async () => {
            const tx = await votingInstance.tallyVotes({from: owner});
            expectEvent(tx, 'WorkflowStatusChange', {previousStatus: new BN(WorkflowStatus.VotingSessionEnded), newStatus: new BN(WorkflowStatus.VotesTallied)});
        });

        it('Set the correct winning proposal ID', async () => {
            // before tallyVotes the winningPropsalID should be equal to 0
            expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal('0');
            await votingInstance.tallyVotes();
            // adasaurus and buitreraptor have voted for proposal 1 and owner for proposal 0 so proposal 1 is the winningProposalID
            expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal('1');
        });
    });

    // bonus : Test for a draw in case we made improvements and set the initial proposal ID value to begin at 1 :
    describe('Test draw', async () => {

            before(async () => {
                votingInstance = await VotingNewInstance();
                await votingInstance.addVoter(owner);
                await votingInstance.addVoter(adasaurus);
                await votingInstance.addVoter(buitreraptor);
                await votingInstance.addVoter(denver);
                await votingInstance.startProposalsRegistering({from: owner});
                await votingInstance.addProposal('This is a proposal from adasaurus', {from: adasaurus});
                await votingInstance.addProposal('This is the last of the dinos', {from: denver});
                await votingInstance.endProposalsRegistering({from: owner});
                await votingInstance.startVotingSession({from: owner});
                await votingInstance.setVote(0, {from: owner});
                await votingInstance.setVote(1, {from: adasaurus});
                await votingInstance.setVote(1, {from: buitreraptor});
                await votingInstance.setVote(0, {from: denver});
                await votingInstance.endVotingSession({from: owner});
            });

        it('should set the winning proposal id as first proposal set', async () => {
        expect(await votingInstance.winningProposalID()).to.be.bignumber.equal(new BN(0))
        });
    });


});