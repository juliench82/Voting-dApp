import create from 'zustand';

const store = create(set => ({
    ready: false,
    address: null,
    workflowStatus: null,
    votingSessionId: null,
    voters: [],
    log: null,
    noContractSet: null,
    addLog: (log) => set({log}),
    addVoters: (voters) => set({ voters }),
    addVoter: (voter) => set(state => {
        const newVoters = [...state.voters];
        newVoters.push(voter);
        return {voters: newVoters}
    }),
    resetContract: () => set({ voters: [] }),
}));

export default store;
