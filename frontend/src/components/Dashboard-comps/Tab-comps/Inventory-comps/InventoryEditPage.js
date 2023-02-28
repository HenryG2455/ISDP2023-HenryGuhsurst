import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';


function InventoryEditPage({ user, invForEdit }) {
    let res;
  const [inventory, setInventory] = useState(invForEdit);
  const [curUser, setCurUser] = useState(null);

  const handleThresholdChange = (itemId, event) => {
    const updatedInventory = inventory.map(item => {
      if (item.itemID === itemId) {
        return {
          ...item,
          reorderThreshold: parseInt(event.target.value)
        };
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  useEffect(() => {
    if(user){
        setCurUser(user);
    }
  }, [user])
  

  const handleSubmit = event => {
    event.preventDefault();
    // Send updated inventory data to server or update database
    console.log(inventory);
    fetch('http://localhost:8000/inventory/update/'+curUser.siteID, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({updateInventoryDto: inventory})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        window.location.reload();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
  };

  return (
    <div>
      <h2>Inventory Edit Page</h2>
      <p>Hello - {curUser != null ? curUser.username || res() : ''}</p>
      <form onSubmit={handleSubmit}>
        <Table>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Reorder Threshold</th>
              <th>Site ID</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.itemID}>
                <td>{item.itemID}</td>
                <td>{item.itemLocation}</td>
                <td>{item.quantity}</td>
                <td>
                  <input
                    type="number"
                    value={item.reorderThreshold}
                    onChange={event => handleThresholdChange(item.itemID, event)}
                  />
                </td>
                <td>{item.siteID}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default InventoryEditPage;