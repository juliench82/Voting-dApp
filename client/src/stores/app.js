import create from 'zustand';

const store = create(set => ({
    startError: null,
}));

export default store;
