import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';


function CurbsideOrders({orders , user })  {
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const [deliverBtn, setDeliverBtn] = useState(true);

    const handleRowClick = (id) => {
      setSelectedRow(id);
    };


    const handleView = (order) => {
        console.log(order);
        let txnAudit = {
          txnID:order.txnID,
          txnType: "orderUpdate",
          status: "Success",
          SiteID: user.siteID,
          deliveryID: order.deliveryID,
          employeeID: user.employeeID,
          notes: user.username+' updated Order',
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
        fetch('http://localhost:8000/txn/close/order/'+order.txnID, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let inventoryDto = order.txnitems
            console.log(inventoryDto)
            inventoryDto.forEach((item) => {
                delete item.txnID;
                delete item.item;
            });
            console.log(inventoryDto)
            let txnAudit2 = {
              txnID:order.txnID,
              txnType: "removeInv",
              status: "Success",
              SiteID: 11,
              deliveryID: order.deliveryID,
              employeeID: user.employeeID,
              notes: user.username+' updated inventory',
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
            fetch('http://localhost:8000/inventory/removeInv/'+11, {
                method: 'Delete',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({inventoryDto})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
        })
    };

    useEffect(()=>{
        console.log(user);
    },[user])
    useEffect(()=>{
      const jsonString = JSON.stringify(orders);
      //console.log(jsonString);
        
    },[orders])

    useEffect(() => {
        if(orders){
          console.log(orders)
          const sortedArray = orders.slice().sort((obj1, obj2) => {
            if (obj1.status === 'READY') {
              return -1;
            }
            if (obj2.status === 'READY') {
              return 1;
            }
            return 0;
          });
            console.log(sortedArray)
            setAllOrders(sortedArray);

        }
    },[orders]);

    function dayOfWeek(date){
      const temp = new Date(date);
      const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
      const formattedDate = temp.toLocaleDateString('en-US', options);
      return formattedDate;
    }


    function signChange(){
        setDeliverBtn(false);
    }


  return (
    <div className='table-container'>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>From</th>
            <th>Txn ID</th>
            <th>Pickup Day</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order) => (
            <React.Fragment key={order.txnID}>
              <tr key={order.txnID} onClick={() => handleRowClick(order.txnID)} className={selectedRow === order.txnID ? " selected" : ""}>
                
                <td>{order.site_txn_siteIDToTosite.name}</td>
                <td>{order.txnID}</td>
                <td>{dayOfWeek(new Date())}</td>
                <td>{order.notes}</td>
              </tr>
              <tr>
                <td colSpan="5">
                    <label>
                        Customer Signature:
                        <input type="text" name="signature" onChange={signChange} required/>
                    </label>
                    <button disabled={deliverBtn} onClick={() => handleView(order)}>Deliver</button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
     
    </div>
  )
}

export default CurbsideOrders;