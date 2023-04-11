import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { constants,txnStatus,txnTypes } from '../../../../../data/Constants';

const OpenSupplierOrder = ({ user, order }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [supItems, setSupItems] = useState([]);
  const [removedItems, setRemovedItems] = useState([]);

  useEffect(() => {
    console.log(order)
    setSupItems(order.txnitems);
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
      });
  }, [order]);

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


    const handleSave = () => {
        // Handle the submit action here
        console.log(user);
        let txnItems =[];
        supItems.forEach(e => {
            txnItems.push({
                ItemID:e.item.itemID,
                quantity:e.quantity,
                txnID:order.txnID,
            })
        });
        console.log(order);
        console.log(txnItems);
        let txnAudit = {
          txnID:order.txnID,
          txnType: "txnUpdate",
          status: "Success",
          SiteID: user.siteID,
          deliveryID: order.deliveryID,
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
        fetch('http://localhost:8000/txn/supplierOrder/update', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({txn:order, txnItems:txnItems,removedItems:removedItems, user:user})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
    };

  const handleSubmit = () => {
    // Handle the submit action here
    console.log(user);
    console.log(order);
    //Cancel new Order so I can make mutiple orders one for each supplier
    let txnAudit2 = {
      txnID:order.txnID,
      txnType: "txnCancel",
      status: "Success",
      SiteID: user.siteID,
      deliveryID: order.deliveryID,
      employeeID: user.employeeID,
      notes: user.username+' cancelled txn',
    };
    fetch('http://localhost:8000/txnaudit/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(txnAudit2)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    fetch('http://localhost:8000/txn/supplierOrder/cancel/'+order.txnID,{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({txn:order, user:user})

    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })  
    const groupedTxnItems = order.txnitems.reduce((acc, curr) => {
      const supplierId = curr.item.supplierID;
      if (!acc[supplierId]) {
        acc[supplierId] = [];
      }
      acc[supplierId].push(curr);
      return acc;
    }, {});
  
    const newTxns = Object.keys(groupedTxnItems).map((supplierId) => {
      return {
        ...order,
        txnitems: groupedTxnItems[supplierId],
      };
    });
    // newTxns now contains an array of transactions with txnitems grouped by supplierID
    console.log(newTxns);
    const updatedTxns = newTxns.map(txn => {
      const { txnID, ...rest } = txn;
      return {
        ...rest,
        status: 'SUBMITTED',
        notes:'For Supplier: ' + txn.txnitems[0].item.supplier.name,
      };
    });
    console.log(updatedTxns);
    updatedTxns.forEach(txn => {
      let txnItems =[];
      txn.txnitems.forEach(e => {
          txnItems.push({
              ItemID:e.item.itemID,
              quantity:e.quantity,
          })
      })
      console.log(txn);
      console.log(txnItems);
      let txnAudit3 = {
        txnID:0,
        txnType: "CreateTxn",
        status: "Success",
        SiteID: user.siteID,
        deliveryID: 0,
        employeeID: user.employeeID,
        notes: user.username+' created txn',
      };
      fetch('http://localhost:8000/txnaudit/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(txnAudit3)
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
          //window.location.reload();
        })
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    // const txn ={
    //   txnID: order.txnID,
    //   siteIDTo: order.siteIDTo,
    //   siteIDFrom: order.siteIDFrom,
    //   status:txnStatus.SUBMITTED,
    //   shipDate: order.shipDate,
    //   txnType: order.txnType,
    //   barCode:  order.barcode,
    //   createdDate:  order.createdDate,
    //   deliveryID:  order.deliveryID,
    //   emergencyDelivery: order.emergencyDelivery,
    //   notes: order.notes
    // }
  };

  const handleRemoveItem = (item) => {
    console.log(item)
    setSupItems(supItems.filter(selectedItem =>
      selectedItem.ItemID !== item.ItemID
    ));
    setRemovedItems([...removedItems, item]);
  }

  return (
    <div className='border'>
      <h2>Open Supplier Order</h2>
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
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
export default OpenSupplierOrder;
