import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewEmployeeForm() {
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [positionId, setPositionId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [active, setActive] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const employee = {
      firstName,
      lastName,
      username,
      email,
      password,
      active,
      locked,
      positionId,
      siteId,
      
    };
    const response = await fetch("http://localhost:8000/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });

    if (!response.ok) {
      console.error("Failed to create employee");
    } else {
      console.log("Employee created successfully");
      console.log(response);
      navigate('/crud');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="positionId">Position ID:</label>
            <input
              type="text"
              id="positionId"
              value={positionId}
              onChange={(event) => setPositionId(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="siteId">Site ID:</label>
            <input
              type="text"
              id="siteId"
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="active">Active:</label>
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
          </div>
          <div>
            <label htmlFor="locked">Locked:</label>
            <input
              type="checkbox"
              id="locked"
              checked={locked}
              onChange={(event) => setLocked(event.target.checked)}
            />
          </div>
          <button type="submit">Create Employee</button>
        </form>
      );
    }
    
    export default NewEmployeeForm;
    