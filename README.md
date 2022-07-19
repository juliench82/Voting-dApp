# Voting-dApp

contract address on Ropsten: https://ropsten.etherscan.io/address/0x7D4775e5BA6803e476041A9C4266a7bC85b24A22

### Vidéo démo des fonctionnalités de votre Front

https://www.loom.com/share/4bc74243a9ea49288177112bbd5f1b74

### Le lien Github Pages

https://juliench82.github.com/Voting-dApp

## Installation

```sh
truffle unbox react
npm install @openzeppelin/contracts --save
npm install @openzeppelin/test-helpers --save
npm install @truffle/hdwallet-provider dotenv
npm install zustand (for state management) - https://www.npmjs.com/package/zustand
```

### Votre Dapp doit permettre : 

- l’enregistrement d’une liste blanche d'électeurs.
- à l'administrateur de commencer la session d'enregistrement de la proposition.
- aux électeurs inscrits d’enregistrer leurs propositions.
- à l'administrateur de mettre fin à la session d'enregistrement des propositions.
- à l'administrateur de commencer la session de vote.
- aux électeurs inscrits de voter pour leurs propositions préférées.
- à l'administrateur de mettre fin à la session de vote.
- à l'administrateur de comptabiliser les votes.
- à tout le monde de consulter le résultat.

### Revoir le code sol pour enlever la faille de sécurité

Le calcul de la proposition gagnante se fait désormais au moment du vote.

### Une utilisation d'event

client/src/utilities/contract.js

### License

MIT