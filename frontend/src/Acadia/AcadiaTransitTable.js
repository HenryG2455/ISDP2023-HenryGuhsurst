import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import AcadiaOrderDetails from './AcadiaViewOrder';


function AcadiaTransitTable({orders , user })  {
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (id) => {
      setSelectedRow(id);
    };


    const handleView = (order) => {
        console.log(order);
        fetch('http://localhost:8000/txn/deliver/order/'+order.txnID, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
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

    function getWeight(order){
      let weight = 0;
      order.txnitems.forEach(item => {
        weight += item.quantity*item.item.weight;
      });
      return weight;
    }


  return (
    <div className='table-container'>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th>To</th>
            <th>Emergency</th>
            <th>Txn ID</th>
            <th>Pickup Day</th>
            <th>Weight</th>
            <th>delivery ID</th>
            <th>Action</th>
            
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order) => (
            <React.Fragment key={order.txnID}>
              <tr key={order.txnID} onClick={() => handleRowClick(order.txnID)} className={selectedRow === order.txnID ? " selected" : ""}>
                
                <td>{order.site_txn_siteIDToTosite.name}</td>
                <td>{order.emergencyDelivery ? "Yes" : "No"}</td>
                <td>{order.txnID}</td>
                <td>{dayOfWeek(order.shipDate)}</td>
                <td>{getWeight(order)}</td>
                <td>{order.deliveryID}</td>
                <td>
                  <button disabled={selectedRow !== order.txnID} onClick={() => handleView(order)}>Deliver</button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default AcadiaTransitTable