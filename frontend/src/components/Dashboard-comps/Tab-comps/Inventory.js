import React, { useState, useEffect} from 'react';
import { constants,txnStatus} from '../../../data/Constants'
import '../../Main.css';
import Table from 'react-bootstrap/Table';




function Inventory({user}) {
    const [inventory, setInventory] = useState([]);
    const [selectedSite, setSelectedSite] = useState('all');
    const [sites, setSites] = useState([]);
    const [curUser, setCurUser] = useState(null);
    const [locations, setLocations] = useState([]);
    const [itemsThatNeedInfo, setItemsThatNeedInfo] = useState([]);
    const [items, setItems] = useState([]);
    let tempItemsThatNeedInfo = [];

  useEffect(() => {
    const fetchData = async () => {
      fetch('http://localhost:8000/inventory')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let tempData = data
        tempData.forEach(item => {
            tempItemsThatNeedInfo.push(item.itemID)
        });
        console.log(tempItemsThatNeedInfo);
            fetch('http://localhost:8000/item/get/orderitems', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempItemsThatNeedInfo)
            })
            .then(response => response.json())
            .then(data => {
                setItems(data); 
                console.log(data);
            })
            
        
        setInventory(tempData);
      });
      
      
    };
    fetchData();
  }, []);

  useEffect(() => {
    if(user){
        setCurUser(user);
        fetch('http://localhost:8000/site')
        .then(response => response.json())
        .then(data => {
          setSites(data);
          sitePermission(data);
          console.log(data);
        });
    }
  },[user]);

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value);
  };

  const filteredInventory = selectedSite === 'all'
    ? inventory
    : inventory.filter(item => item.siteID === selectedSite);

    const sitePermission = (sites) => {
        setLocations(sites.map(site => (
            <option key={site.siteID} value={site.siteID}>
                {site.name}
            </option>
        )))
    };

  return (
    <div>
      <h1>Inventory List</h1>
      <label htmlFor="site-select">Select Site:</label>
      <select id="site-select" value={selectedSite} onChange={handleSiteChange} >
        <option value="">--Select Location--</option>
        {locations} 
      </select>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.itemID}>
              <td>{item.itemID}</td>
              <td>{items.find(iItems => iItems.itemID === item.itemID).forEach(tmpItem => tmpItem.name)}</td>
              <td>{item.quantity}</td>
              <td>{item.sku}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Inventory