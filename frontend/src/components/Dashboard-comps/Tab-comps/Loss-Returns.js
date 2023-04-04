import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import '../../Main.css';


const LossReturns = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([]);
  const [notes, setNotes] = useState('');
  const [lossReturn, setLossReturn] = useState('Loss');
  const [newQuantity, setNewQuantity] = useState(0);

  useEffect(() => {
    // Fetch your inventory data here and update the state
    // For example: setInventory(yourFetchedInventoryData);
   if(user){
    fetch('http://localhost:8000/inventory/'+user.siteID)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        setInventory(data);
    })
   }
  }, [user]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChange = (event) => {
    setNewQuantity(event.target.value);
  };

  const handleNotes = (event) => {
    setNotes(event.target.value);
  };

  const handleLossReturn = (event) => {
    setLossReturn(event.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label htmlFor="notes">Search:</label>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className='table-container-record'>
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>Item ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>SKU</th>
                </tr>
            </thead>
            <tbody>
                {filteredInventory.map((item) => (
                <tr key={item.itemID}>
                    <td>{item.itemID}</td>
                    <td>{item.item.name}</td>
                    <td><input className='orderInput' type="number" defaultValue={item.quantity} min={0} max={item.quantity} onChange={handleChange}/></td>
                    <td>{item.item.sku}</td>
                </tr>
                ))}
            </tbody>
        </Table>
      </div>
      <div className='flexBottom'>
        <div className='flexChild'>
            <label id='notesLabel' htmlFor="notes">Notes:</label>
            <textarea rows="7" cols="50" id="notes" value={notes} onChange={handleNotes} />
        </div>
        <div className='flexChild'>
            <div>
                <label htmlFor="lossReturn">Loss/Return:</label>
                <select id="lossReturn" value={lossReturn} onChange={handleLossReturn}>
                    <option value="Loss">Loss</option>
                    <option value="Return">Return</option>
                </select>
            </div>
            <label htmlFor="notes">Return to Inventory</label>
            <input type='checkbox' id='lossReturn' name='lossReturn' value='Loss' />
        </div>
        
      </div>
      <button>Exit</button>
    </div>
  );
};

export default LossReturns;