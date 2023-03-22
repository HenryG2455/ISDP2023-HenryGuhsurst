import React, { useState, useLayoutEffect } from 'react';
import RecordsTable from "./CRUD_Components/Records/RecordsTable";
import { useNavigate} from 'react-router-dom';
import { Table } from 'react-bootstrap';

let res;
export default function RecordCRUD() {
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState('');
    const [txns, setTxns] = useState([]);
    useLayoutEffect(() => {
        // Check For User
        getEmps();
        //console.log("TEST");
      },[]);
    
    async function getEmps(){
        try {
          res = await fetch('http://localhost:8000/txn/getall');
        } catch (error) {
          // TypeError: Failed to fetch
          console.log('There was an error', error);
        }
        if (!res.ok) {
          setErrorText("Server Error");
        }else{
          const tempstxns = await res.json();
          console.log(tempstxns);
          setTxns(tempstxns);
        }
        
    }
    function toAddPage(){
        navigate('/addemployee');
    }
  return (
    <div>
        <h4>Records CRUD Page</h4>
        <RecordsTable  txns={txns} />
    </div>
  )
}
