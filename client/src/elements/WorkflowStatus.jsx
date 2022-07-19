import React from 'react';
import contractStore from "../zustand/contract";
import {getWorkflowStatusName} from "../utilities/contract";

function WorkflowStatus() {

    const {ready, workflowStatus} = contractStore(state => ({ready: state.ready, workflowStatus: state.workflowStatus}));

    if (!ready) {
        // Status not yet initialized
        return <></>;
    }

    return (
        <div>
            <h3>Current state</h3>
            {[0,1,2,3,4,5].map((status)=>{
                return (
                    <div className="Status" key={status}>
                        {workflowStatus === status.toString() ? '†' : ' '}  {getWorkflowStatusName(status)}
                    </div>
                )
            })}
        </div>
    );
}

export default WorkflowStatus;
