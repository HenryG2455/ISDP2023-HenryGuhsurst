import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import MoveOrder from './MoveOrder';
import '../../../Main.css';


function ReadyOrders({orders , user, setKey })  {
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const [displayLoadButton, setDisplayLoadButton] = useState(true);

    const handleRowClick = (id) => {
      setSelectedRow(id);
    };


    const handleView = (order) => {
        console.log(order);
        setSelectedOrder(order);
        setDisplayLoadButton(false);
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
            if (obj1.status === 'SUBMITTED') {
              return -1;
            }
            if (obj2.status === 'SUBMITTED') {
              return 1;
            }
            return 0;
          });
            console.log(sortedArray)
            setAllOrders(sortedArray);
        }
    },[orders]);



  return (
    <div className='table-container-record'>
        <h4>Orders Ready for Pickup</h4>
        <Table striped bordered hover >
            <thead>
            <tr>
                <th>To</th>
                <th>From</th>
                <th>Status</th>
                <th>Emergency</th>
                <th>Transaction-ID</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {allOrders.map((order, i) => (
                <React.Fragment key={order.txnID}>
                <tr key={order.txnID} onClick={() => handleRowClick(order.txnID)} className={selectedRow === order.txnID ? " selected" : ""}>
                    
                    <td>{order.site_txn_siteIDToTosite.name}</td>
                    <td>{order.site_txn_siteIDFromTosite.name}</td>
                    <td>{order.status}</td>
                    <td>{order.emergencyDelivery ? "Yes" : "No"}</td>
                    <td>{order.txnID}</td>
                    <td>
                      {displayLoadButton && i === 0 && (
                        <button disabled={selectedRow !== order.txnID} onClick={() => handleView(order)}>Load</button>
                      )}
                    </td>
                </tr>
                {selectedOrder.txnID === order.txnID && (
                    <tr>
                        <td colSpan="6">
                            <MoveOrder setKey={setKey} setSelectedOrder={setSelectedOrder} order={selectedOrder} />
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

export default ReadyOrders