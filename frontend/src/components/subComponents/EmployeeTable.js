import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeTable({ employees }) {
    const navigate = useNavigate();
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
    <table>
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
          <tr key={employee.employeeID}>
            <td>{employee.employeeID}</td>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.active ? "Yes" : "No"}</td>
            <td>
              <button>Edit</button>
              <button value={employee.employeeID} onClick={deleteEmp}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

