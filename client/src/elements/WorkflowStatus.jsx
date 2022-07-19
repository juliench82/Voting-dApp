import React from 'react';
import contractStore from "../zustand/contract";
import {getWorkflowStatusName} from "../utilities/contract";

function WorkflowStatus() {

    const {workflowStatus} = contractStore(state => ({ workflowStatus: state.workflowStatus}));
    
    return (
        <div>
            <h3>Status</h3>
            {[0,1,2,3,4,5].map((status)=>{
                return (
                    <div className="Status" key={status}>
                        {workflowStatus === status.toString() ? '├' : ' '}  {getWorkflowStatusName(status)}
                    </div>
                )
            })}
        </div>
    );
}

export default WorkflowStatus;
