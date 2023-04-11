import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { constants,txnStatus,txnTypes } from '../../../../../data/Constants';

const NewSupplierOrder = ({ user }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [supItems, setSupItems] = useState([]);
  const [autoAdded, setAutoAdded] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/supplier')
      .then((response) => response.json())
      .then((data) => setSuppliers(data));

    fetch('http://localhost:8000/item')
      .then((response) => response.json())
      .then((data) => setItems(data));

    fetch('http://localhost:8000/inventory/1')
      .then((response) => response.json())
      .then((data) => {
        setInventory(data);
        console.log(data)
        let tempAuto=[];
        data.forEach(e => {
          if(e.quantity < e.reorderThreshold){
            tempAuto.push(e);
          }
        });
        tempAuto.forEach(e => {
          e.quantity = (e.reorderThreshold-e.quantity);
        })
        setAutoAdded(tempAuto);
        setSupItems(tempAuto);
      });
  }, []);

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const handleAddItem = (item, orderQty) => {
    console.log(item)
    const itemIndex = supItems.findIndex((titem) => titem.ItemID === item.itemID);
    if (itemIndex !== -1) {
      const newSupItems = [...supItems];
      newSupItems[itemIndex].quantity += orderQty;
      setSupItems(newSupItems);
    } else {
      setSupItems([...supItems, { ItemID:item.itemID ,item: item, quantity: orderQty }]);
    }
    console.log(supItems)
  };

  const handleSubmit = () => {
    // Handle the submit action here
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const currentDateObj = new Date();
    currentDateObj.setDate(currentDateObj.getDate() + 7);
    const dateAfter7Days = currentDateObj.toISOString().slice(0, 19).replace('T', ' ');
    const barcode = Math.random().toString(36).substring(2, 12);
    console.log(user);
    const txn ={
      siteIDTo: user.siteID,
      siteIDFrom: user.siteID,
      status:txnStatus.NEW,
      shipDate:dateAfter7Days,
      txnType:txnTypes.SUPPLIER_ORDER,
      barCode: barcode,
      createdDate: currentDate,
      deliveryID: null,
      emergencyDelivery: null,
      notes:''
    }
    
    let txnItems =[];
    supItems.forEach(e => {
      txnItems.push({
        ItemID:e.item.itemID,
        quantity:e.quantity,
    })});
    console.log(txn);
    console.log(txnItems);
    let txnAudit = {
      txnID:txn.txnID,
      txnType: "txnUpdate",
      status: "Success",
      SiteID: user.siteID,
      deliveryID: txn.deliveryID,
      employeeID: user.employeeID,
      notes: user.username+' updated txn',
    };
    fetch('http://localhost:8000/txnaudit/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(txnAudit)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    fetch('http://localhost:8000/txn/supplierOrder/new', {
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
  };

  const handleRemoveItem = (item) => {
    setSupItems(supItems.filter(selectedItem =>
      selectedItem.itemID !== item.itemID
    ));
  }

  return (
    <div className='border'>
      <h2>New Supplier Order</h2>
      <select value={selectedSupplier} onChange={handleSupplierChange}>
        <option value="">Select a supplier</option>
        {suppliers.map((supplier) => (
          <option key={supplier.supplierID} value={supplier.supplierID}>
            {supplier.name}
          </option>
        ))}
      </select>
      <div className='table-container-LR'>
      <Table striped bordered>
        <thead>
          <tr>
            <th>ItemID</th>
            <th>Name</th>
            <th>Inv-Qty</th>
            <th>Order-Qty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items
            .filter((item) => item.supplierID === parseInt(selectedSupplier))
            .map((item) => {
              const invItem = inventory.find((i) => i.itemID === item.itemID);
              const invQty = invItem ? invItem.quantity : 0;

              return (
                <tr key={item.itemID}>
                  <td>{item.itemID}</td>
                  <td>{item.name}</td>
                  <td>{invQty}</td>
                  <td>
                    <input type="number" min="0" max="100" id={`orderQty-${item.itemID}`}/>
                  </td>
                  <td>
                    <button onClick={() => handleAddItem(
                          item,
                          parseInt(document.getElementById(`orderQty-${item.itemID}`).value)
                        )}>Add
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      </div>
      
      <h4>Selected Items</h4>
      <div className='table-container'>
          <Table className=' table-container' striped bordered hover>
          <thead>
            <tr>
              <th>ItemID</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
              {supItems.map(i =>
              <tr key={i.item.itemID}>
                  <td>{i.item.itemID}</td>
                  <td>{i.item.name}</td>
                  <td>{i.quantity}</td>
                  <td>${i.quantity*parseInt(i.item.costPrice)}</td>
                  <td><button onClick={() => handleRemoveItem(i)}>Remove</button></td>
              </tr>
              )}
          </tbody>
          </Table>
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
export default NewSupplierOrder;
