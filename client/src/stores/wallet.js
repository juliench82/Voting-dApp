import create from 'zustand';

const store = create(set => ({
    web3: null, // Web3 provider
    ready: false, // True when web3 provider is ready
    connected: false,
    address: null,
    isVoter: false,
    isOwner: false,
    hasVoted: false,
    votedProposalId: null,
    proposals: [],
    setWeb3: (web3) => set({web3}),
    connect: (address) => set(state => ({ connected: true, address })),
    disconnect: () => set({ connected: false, address: null, isVoter: false, isOwner: false, hasVoted: false }),
    resetVote: () => set({ isVoter: false, hasVoted: false }),
    addProposals: (proposals) => set({ proposals }),
    addProposal: (proposal) => set(state => {
        const newProposals = [...state.proposals];
        newProposals.push(proposal);
        return {proposals: newProposals}
    }),
}));

export default store;
