import React from "react";

export default function EmployeeTable({ employees }) {
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
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

