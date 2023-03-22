import React, { useState } from "react";
import Table from "react-bootstrap/Table";

function CustomerSearch() {
  const [emailTerm, setEmailTerm] = useState("");
  const [txnTerm, setTxnTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearch = async () => {
    try {
        let URL = `http://localhost:8000/txn/onlineOrder/find/${emailTerm}/${txnTerm}`;
        console.log(URL);
        const response = await  fetch(URL);
        const data = await response.json();
        setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputemail = (event) => {
    setEmailTerm(event.target.value);
  };

  const handleInputTxn = (event) => {
    setTxnTerm(event.target.value);
  };

  return (
    <div>
      <span>Search For Order:</span>
      <label>
        Email:
        <input type="text" value={emailTerm} onChange={handleInputemail} />
      </label>
      <label>
        TxnID:
        <input type="number" value={txnTerm} min={0} placeholder={"0000"} onChange={handleInputTxn} />
      </label>
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 ? (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Site ID To</th>
                    <th>Status</th>
                    <th>Transaction Type</th>
                    <th>Barcode</th>
                    <th>Created Date</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
            {searchResults.map((txn) => (
                <tr key={txn.txnID}>
                    <td>{txn.txnID}</td>
                    <td>{txn.siteIDTo}</td>
                    <td>{txn.status}</td>
                    <td>{txn.txnType}</td>
                    <td>{txn.barCode}</td>
                    <td>{new Date(txn.createdDate).toLocaleString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}</td>
                    <td>{txn.notes}</td>
                </tr>
            ))}
            </tbody>
        </Table> 
      ) : (
        <div>
            <span><h4>Search For a Order</h4></span>
        </div>
         )}
    </div>
  );
}

export default CustomerSearch;