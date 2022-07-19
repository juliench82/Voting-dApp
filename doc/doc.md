### Voting <small>: Voting</small>

Author: Julien Chevallier
<br>

**Functions**

***

###### addProposal

Only registered voters can add a proposal.

| Name | Type | Description |
| --- | --- | --- |
|  _description | string | : Proposal's description. Emits a {ProposalRegistered} event. Requirements: - `WorkflowStatus` must be at the ProposalsRegistrationStarted state. - `Description` can't be empty. - `Max length` = 50 proposals. |

Returns:

No parameters

***

###### addVoter

Only the owner can call the function.

| Name | Type | Description |
| --- | --- | --- |
|  _address | address | : address of the voter. Emits a {VoterRegistered} event. Requirements: - `WorkflowStatus` must be at the RegisteringVoters state. - `voter` cannot be already registered. |

Returns:

No parameters

***

###### endProposalsRegistering

Current status must be RegisteringVoters.  Emits a {WorkflowStatusChange} event.

No parameters

Returns:

No parameters

***

###### endVotingSession

Current status must be VotingSessionStarted.  Emits a {WorkflowStatusChange} event.

No parameters

Returns:

No parameters

***

###### getOneProposal

Only registered voters can call the function.

| Name | Type | Description |
| --- | --- | --- |
|  _id | uint256 | : ID of the proposal. |

Returns:

| Name | Type | Description |
| --- | --- | --- |
|  | tuple |  |

***

###### getVoter

Only registered voters can call the function.

| Name | Type | Description |
| --- | --- | --- |
|  _address | address | : address of the voter. |

Returns:

| Name | Type | Description |
| --- | --- | --- |
|  | tuple |  |

***

###### getWinningProposalId

Only owner can call this function.

No parameters

Returns:

| Name | Type | Description |
| --- | --- | --- |
| proposalId | uint256 |  |
| description | string |  |
| voteCount | uint256 |  |

***

###### owner

Returns the address of the current owner.

No parameters

Returns:

| Name | Type | Description |
| --- | --- | --- |
|  | address |  |

***

###### proposals

****Add Documentation for the method here****

| Name | Type | Description |
| --- | --- | --- |
|  | uint256 |  |

Returns:

| Name | Type | Description |
| --- | --- | --- |
| description | string |  |
| voteCount | uint256 |  |

***

###### renounceOwnership

Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.

No parameters

Returns:

No parameters

***

###### startProposalsRegistering

Current status must be RegisteringVoters.  Emits a {WorkflowStatusChange} event.

No parameters

Returns:

No parameters

***

###### startVotingSession

Current status must be ProposalsRegistrationEnded.  Emits a {WorkflowStatusChange} event.

No parameters

Returns:

No parameters

***

###### tallyVotes

Current status must be VotingSessionEnded Emits a {WorkflowStatusChange} event. Requirements: - `WorkflowStatus` must be at the VotingSessionEnded state. - `Max length` = 50 proposals.

No parameters

Returns:

No parameters

***

###### transferOwnership

Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

| Name | Type | Description |
| --- | --- | --- |
| newOwner | address |  |

Returns:

No parameters

***

###### vote

Only registered voters can vote. Voters can vote only once.

| Name | Type | Description |
| --- | --- | --- |
|  _proposalId | uint256 | : id of the proposal. Emits a {Voted} event. Requirements: - `WorkflowStatus` must be at the VotingSessionStarted state. - `voter` cannot have already voted. |

Returns:

No parameters

***

###### voters

****Add Documentation for the method here****

| Name | Type | Description |
| --- | --- | --- |
|  | address |  |

Returns:

| Name | Type | Description |
| --- | --- | --- |
| isRegistered | bool |  |
| hasVoted | bool |  |
| votedProposalId | uint256 |  |

***

###### winningProposalId

****Add Documentation for the method here****

No parameters

Returns:

| Name | Type | Description |
| --- | --- | --- |
|  | uint256 |  |

***

###### workflowStatus

****Add Documentation for the method here****

No parameters

Returns:

| Name | Type | Description |
| --- | --- | --- |
|  | uint8 |  |
