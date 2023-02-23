import React, { useState, useEffect, Component} from 'react';
import Table from 'react-bootstrap/Table';


function OrdersTable({orders , user })  {
    const [allOrders, setAllOrders] = useState([])
    const [hiddenName, setHiddenName] = useState('');
    const [errorText, setErrorText] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});


    const handleView = (order) => {
        console.log(order);
        setSelectedOrder(order);
    };

    useEffect(()=>{
        console.log(user);
    },[user])
    useEffect(()=>{
        console.log(orders);
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
        <th>Transaction-ID</th>
        <th>To</th>
        <th>From</th>
        <th>Status</th>
        <th>Emergency</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {allOrders.map((order) => (
        <React.Fragment key={order.txnID}>
          <tr >
            <td>{order.txnID}</td>
            <td>{order.siteIDTo}</td>
            <td>{order.siteIDFrom}</td>
            <td>{order.status}</td>
            <td>{order.emergencyDelivery ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => handleView(order)}>View</button>
            </td>
          </tr>
          {selectedOrder.txnID === order.txnID && (
            <tr>
              <td colSpan="5">
                
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