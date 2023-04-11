import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';


function Reports({user}) {
  const [report, setReport] = useState('Delivery Report');
  const [createdReport, setCreatedReport] = useState(null);
  const [location, setLocation] = useState('');
  const [startDateT, setStartDate] = useState('');
  const [endDateT, setEndDate] = useState('');
  const [sites, setSites] = useState([]);
  const [reportInfo, setReportInfo] = useState([]);
  
  //semi Fixed variables
  let removedSites = [2,3,11,9999];
  const reportTypes = [
    "Delivery Report",
    "Store Order",
    "Shipping Receipt",
    "Inventory",
    "Orders",
    "Emergency Orders",
    "Users",
    "Backorders",
    "Supplier Order",
    "Loss/Damage/Return",
  ];

  useEffect(() => {
    
    if(user){
      // Implement the logic to fetch the Site Locations from the database
      fetch('http://localhost:8000/site')
      .then(response => response.json())
      .then(data => {
          const filteredArray = data.filter(
            (object) => !removedSites.includes(object.siteID)
          );
          console.log(filteredArray)
          setSites(filteredArray);
          let defaultSite = filteredArray.find((object) => object.siteID === user.siteID);
          if(defaultSite===undefined){
            defaultSite = filteredArray[0];
          }else{
            setLocation(defaultSite.siteID);
          }
          setLocation(defaultSite.siteID);
          console.log(filteredArray)
      });
    }

  }, [user]);

  
  const getReportURL = (report) => {
    switch (report) {
      case "Delivery Report":
        if(startDateT === ''){
          alert("Please select a start date");
          return null;
        }
        return "txn/delivery/report";
      case "Store Order":
        if(startDateT === ''){
          alert("Please select a start date");
          return null;
        }
        return "txn/storeorder/report";
      case "Shipping Receipt":
        return "txn/shipping/report";
      case "Inventory":
        return "inventory/report";
      case "Orders":
        if(startDateT === '' || endDateT === ''){
          alert("Please select a start date and end date");
          return null;
        }
        return "txn/orders/report";
      case "Emergency Orders":
        if(startDateT === '' || endDateT === ''){
          alert("Please select a start date and end date");
          return null;
        }
        return "txn/emergency/report";
      case "Users":
        return "employee/report";
      case "Backorders":
        if(startDateT === '' || endDateT === ''){
          alert("Please select a start date and end date");
          return null;
        }
        return "txn/backorder/report";
      case "Supplier Order":
        if(startDateT === '' || endDateT === ''){
          alert("Please select a start date and end date");
          return null;
        }
        return "txn/supplier/report";
      case "Loss/Damage/Return":
        if(startDateT === '' || endDateT === ''){
          alert("Please select a start date and end date");
          return null;
        }
        return "txn/lossreturn/report";
    }
  };


  const handlePrint = async () => {
    let reportTypeURL = getReportURL(report);
    if(reportTypeURL === null){
      return;
    }
    console.log(report)
    console.log(reportTypeURL)
    let startDate;
    let endDate;
    if(endDateT === '')
      endDate = null;
    else
      endDate = new Date(endDateT);
    if(startDateT === '')
      startDate = null;
    else
      startDate = new Date(startDateT);
    let body = JSON.stringify({
      report,
      location,
      startDate,
      endDate,
    })
    console.log(body)
    const response = await fetch('http://localhost:8000/'+reportTypeURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.json();
    console.log(data)
    setCreatedReport(data)
    setReportInfo(data);
    // Implement the logic to convert the data to CSV and initiate download
  };

  const objectArrayToCSV = (data) => {
    const csvRows = [];

    // Extract the header row
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Extract data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const handleDownloadCSV = () => {
    const csvData = objectArrayToCSV(reportInfo);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetPage = () => {
    setCreatedReport(null);
    setReport('Delivery Report');
    setStartDate('');
    setEndDate('');
    setLocation('all');
    setReportInfo([]);
  }

  return (
    <div>
      <button onClick={resetPage}>Reset</button>
      <div className="App">
        <h2>Find A Report</h2>
        <div>
          <label>Report:</label>
          <select value={report} onChange={(e) => setReport(e.target.value)}>
            {reportTypes.map((reportType) => (
              <option key={reportType} value={reportType}>{reportType}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Location:</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value='all'>All</option>
            {sites.map((site) => (
              <option key={site.siteID} value={site.siteID}>{site.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDateT}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDateT}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <button disabled={createdReport===null?true:false} onClick={handleDownloadCSV}>Download</button>
          <button onClick={handlePrint}>Print</button>
        </div>
      </div>
      {reportInfo.length>0? (
        <div className='App'>
          <h5>Report Info:</h5>
          <div className='table-container-record'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {reportInfo.length > 0 &&
                    Object.keys(reportInfo[0]).map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {reportInfo.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, valueIndex) => (
                      <td key={valueIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ):(
        <div className='App'>
          <h2>No Report Info</h2>
        </div>
      )}
    </div>
  );
}

export default Reports;
