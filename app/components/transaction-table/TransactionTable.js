import React from 'react'

export default function TransactionTable() {
  return (
    <div className='mt-10'> 
        <div className="overflow-x-auto">
    <table className="table table-xs">
      <thead>
        <tr>
          <th>Name</th>
          <th>Job</th>
          <th>company</th>
          <th>location</th>
          <th>Last Login</th>
          <th>Favorite Color</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lorelei Blackstone</td>
          <td>Data Coordiator</td>
          <td>Witting, Kutch and Greenfelder</td>
          <td>Kazakhstan</td>
          <td>6/3/2020</td>
          <td>Red</td>
        </tr>
      </tbody>
      
    </table>
  </div>
    </div>
  )
}
