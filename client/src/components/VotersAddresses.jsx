import React, {useEffect, useState} from 'react';

function VotersAddresses({addresses}) {
  const votersAddresses = 
    <div>
      <hr/>
      <table>
        <tbody>
          <tr><th>Voters Addresses</th></tr>
          {addresses.map((address) => 
            (<tr key={address.id}><td>{address.returnValues._voterAddress}</td></tr>))}
        </tbody>
      </table>
    </div>

return (
    <div>
      {VotersAddresses}
    </div>
  );
}
  
export default VotersAddresses;