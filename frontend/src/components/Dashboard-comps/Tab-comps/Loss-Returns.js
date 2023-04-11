import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import '../../Main.css';
import {txnStatus, txnTypes} from '../../../data/Constants';


const LossReturns = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([]);
  const [notes, setNotes] = useState('');
  const [lossReturn, setLossReturn] = useState('LOSS');
  const [newQuantity, setNewQuantity] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [hideSubmit, setHideSubmit] = useState(true);
  const [txnItems, setTxnItems] = useState([]);

  useEffect(() => {
    // Fetch your inventory data here and update the state
    // For example: setInventory(yourFetchedInventoryData);
   if(user){
    fetch('http://localhost:8000/inventory/'+user.siteID)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        setInventory(data);
        if(user.user_permission.find(lvl => lvl.permissionID === 'CREATELOSS')){
          setHideSubmit(false);
        }
    })
   }
  }, [user]);

  const handleSubmit= () => {
    let item = inventory.find((item) => item.itemID === selectedRow);
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(user);
    const txn ={
      siteIDTo: user.siteID,
      siteIDFrom: user.siteID,
      status:txnStatus.CLOSED,
      shipDate:currentDate,
      txnType:lossReturn,
      barCode: null,
      createdDate: currentDate,
      deliveryID: null,
      emergencyDelivery: null,
      notes:notes
    }
    console.log(txn)
    console.log(txnItems)
    if(lossReturn === 'LOSS'){
      fetch('http://localhost:8000/txn/loss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({txn:txn, txnItems:txnItems, user:user})
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        window.location.reload();
      })
    }else{
      fetch('http://localhost:8000/txn/return', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({txn:txn, txnItems:txnItems, user:user})
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          window.location.reload();
        })
    } 
  }


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

  const handleRowClick = (id) => {
    setSelectedRow(id);
  };

  const newItem = (item) => {
    if(parseInt(newQuantity) === 0){
      return;
    }
    const inputs = document.getElementsByClassName('orderInput');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = 0;
    }
    let tmpItems = [...txnItems];
    if(tmpItems.find(tmpitem => tmpitem.ItemID === item.itemID)){
      tmpItems.forEach(tmpitem => {
        if(tmpitem.ItemID === item.itemID){
          if((tmpitem.quantity + parseInt(newQuantity)) > item.quantity){
            tmpitem.quantity = item.quantity;
          }
          else{
            console.log(tmpitem.quantity +  parseInt(newQuantity))
            tmpitem.quantity +=  parseInt(newQuantity);
          }
        }
      })
      setTxnItems(tmpItems)
    }else{
      let tmpItem = {
        ItemID: item.itemID,
        quantity: parseInt(newQuantity)
      }
      setTxnItems([...txnItems, tmpItem])
    }
    setNewQuantity(0);
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
      <div className='table-container-LR'>
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>Item ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>SKU</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {filteredInventory.map((item) => (
                <tr key={item.itemID} onClick={() => handleRowClick(item.itemID)}>
                    <td>{item.itemID}</td>
                    <td>{item.item.name}</td>
                    <td><input disabled={selectedRow !== item.itemID} className='orderInput' type="number" defaultValue={0} min={0} max={item.quantity} onChange={handleChange}/></td>
                    <td>{item.item.sku}</td>
                    <td><button onClick={() => newItem(item)}>Add</button></td>
                </tr>
                ))}
            </tbody>
        </Table>
        
      </div>
      <div>
      <h6>Items:</h6>
        <ul>
          {txnItems.map((item) => (
            <li key={item.ItemID}>
              Item ID: {item.ItemID}, Quantity: {item.quantity}
            </li>
          ))}
        </ul>
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
                    <option value="LOSS">Loss</option>
                    <option value="RETURN">Return</option>
                </select>
            </div>
        </div>
        
      </div>
      <button className={hideSubmit?'hidden':''} disabled={txnItems.length>0?false:true} onClick={handleSubmit}>Submit</button>
      <button>Exit</button>
    </div>
  );
};

export default LossReturns;