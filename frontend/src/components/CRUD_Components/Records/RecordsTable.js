import React, { useState, useEffect} from "react";
import EditForm from './EditForm';
import Table from 'react-bootstrap/Table';

const RecordsTable = ({ txns }) => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  useEffect(()=>{
    //console.log(employees);
  })

  const handleEdit = (employee) => {
    console.log(employee);
    setSelectedEmployee(employee);
  };

  async function cancelTxn(event){
      let id = parseInt(event.target.value);
      //console.log(typeof id);
      const response = await fetch("http://localhost:8000/txn/cancel/"+id, 
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
                <button value={txn.txnID} onClick={cancelTxn}>Cancel</button>
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