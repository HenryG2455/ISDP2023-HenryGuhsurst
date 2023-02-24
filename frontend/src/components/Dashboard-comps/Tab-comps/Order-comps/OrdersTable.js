import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import OrderDetails from './ViewOrder';


function OrdersTable({orders , user })  {
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (id) => {
      setSelectedRow(id);
    };


    const handleView = (order) => {
        console.log(order);
        setSelectedOrder(order);
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
            setAllOrders(orders);
            permissions();
        }
    },[orders]);

    function permissions(){
    }


  return (
    <div>
    <Table striped bordered hover>
    <thead>
      <tr>
        <th>To</th>
        <th>From</th>
        <th>Status</th>
        <th>Emergency</th>
        <th>Transaction-ID</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {allOrders.map((order) => (
        <React.Fragment key={order.txnID}>
          <tr key={order.txnID} onClick={() => handleRowClick(order.txnID)} className={selectedRow === order.txnID ? " selected" : ""}>
            
            <td>{order.site_txn_siteIDToTosite.name}</td>
            <td>{order.site_txn_siteIDFromTosite.name}</td>
            <td>{order.status}</td>
            <td>{order.emergencyDelivery ? "Yes" : "No"}</td>
            <td>{order.txnID}</td>
            <td>
              <button disabled={selectedRow !== order.txnID} onClick={() => handleView(order)}>View</button>
            </td>
          </tr>
          {selectedOrder.txnID === order.txnID && (
            <tr>
              <td colSpan="6">
                <OrderDetails setSelectedOrder={setSelectedOrder} order={selectedOrder} />
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  </Table>
    </div>
  )
}

export default OrdersTable