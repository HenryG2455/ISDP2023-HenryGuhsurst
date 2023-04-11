import React, { useState, useEffect} from "react";
import EditForm from './EditForm';
import Table from 'react-bootstrap/Table';

const EmployeeTable = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  useEffect(()=>{
    //console.log(employees);
  })

  const handleEdit = (employee) => {
    console.log(employee);
    setSelectedEmployee(employee);
  };

  async function deleteEmp(event){
      let id = parseInt(event.target.value);
      //console.log(typeof id);
      let txnAudit = {
        txnID:0,
        txnType: "Remove Emp",
        status: "Success",
        SiteID: selectedEmployee.siteID,
        deliveryID: 0,
        employeeID: selectedEmployee.employeeID,
        notes: 'admin removed a employee',
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
      const response = await fetch("http://localhost:8000/employee/active/"+id, 
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
          <th>Employee-ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Position</th>
          <th>Active</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <React.Fragment key={employee.employeeID}>
            <tr >
              <td>{employee.employeeID}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.posn.permissionLevel}</td>
              <td>{employee.active ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>Edit</button>
                <button value={employee.employeeID} onClick={deleteEmp}>Delete</button>
              </td>
            </tr>
            {selectedEmployee.employeeID === employee.employeeID && (
              <tr>
                <td colSpan="5">
                  <EditForm employee={selectedEmployee} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default EmployeeTable;