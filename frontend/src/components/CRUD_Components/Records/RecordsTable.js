import React, { useState, useEffect} from "react";
import EditForm from './EditForm';
import Table from 'react-bootstrap/Table';

const RecordsTable = ({ user,txns }) => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  useEffect(()=>{
    //console.log(employees);
  })

  const handleEdit = (employee) => {
    console.log(employee);
    setSelectedEmployee(employee);
  };

  async function cancelTxn(txn){

      //console.log(typeof id);
      let txnAudit = {
        txnID:txn.txnID,
        txnType: txn.txnType,
        status: txn.status,
        SiteID: user.siteID,
        deliveryID: txn.deliveryID,
        employeeID: user.employeeID,
        notes: user.username+' Edited Order',
      };
      fetch('http://localhost:8000/txnaudit/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(txnAudit)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      const response = await fetch("http://localhost:8000/txn/cancel/"+txn.txnID, 
      {
          method: "Post",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
      console.error("Failed to delete employee");
      } else {
      console.log("Employee deleted successfully");
      //console.log(response);
      window.location.reload();
      }
  }
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
            <th>To</th>
            <th>From</th>
            <th>Status</th>
            <th>Type</th>
            <th>Transaction-ID</th>
            <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {txns.map((txn) => (
          <React.Fragment key={txn.txnID}>
            <tr >
              <td>{txn.siteIDTo}</td>
              <td>{txn.siteIDFrom}</td>
              <td>{txn.status}</td>
              <td>{txn.txnType}</td>
              <td>{txn.txnID}</td>
              <td>
                <button value={txn.txnID} onClick={cancelTxn(txn)}>Cancel</button>
              </td>
            </tr>
            
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default RecordsTable;
// {selectedEmployee.employeeID === employee.employeeID && (
//     <tr>
//       <td colSpan="5">
//         <EditForm employee={selectedEmployee} />
//       </td>
//     </tr>
//   )}