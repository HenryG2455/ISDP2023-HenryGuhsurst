import React, { useState} from "react";
import EditForm from './EditForm';
import Table from 'react-bootstrap/Table';

const EmployeeTable = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState({});

  const handleEdit = (employee) => {
    console.log(employee);
    setSelectedEmployee(employee);
  };

  async function deleteEmp(event){
      let id = parseInt(event.target.value);
      //console.log(typeof id);
      const response = await fetch("http://localhost:8000/employee/"+id, 
      {
          method: "Delete",
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