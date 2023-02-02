import React, { useState, useLayoutEffect } from 'react';
import EmployeeTable from "./CRUD_Components/EmployeeTable";
import { useNavigate} from 'react-router-dom';
import { Table } from 'react-bootstrap';

let res;
export default function EmployeeCRUD() {
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState('');
    const [emps, setEmps] = useState([]);
    useLayoutEffect(() => {
        // Check For User
        getEmps();
        //console.log("TEST");
      },[]);
    
    async function getEmps(){
        try {
          res = await fetch('http://localhost:8000/employee');
        } catch (error) {
          // TypeError: Failed to fetch
          console.log('There was an error', error);
        }
        if (!res.ok) {
          setErrorText("Server Error");
        }else{
          const emps = await res.json();
          console.log(emps);
          setEmps(emps);
        }
        
    }
    function toAddPage(){
        navigate('/addemployee');
    }
  return (
    <div>
        EmployeeCRUD Page<br/>
        <button onClick={toAddPage}>Add Employee</button><br/>
        <EmployeeTable  employees={emps} />
    </div>
  )
}
