import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../../Main.css';
import FulfilOnlineOrder from './FulfilOnlineOrder';

function OnlineOrders({orders,user, globalOrders}) {
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const [storeInv, setStoreInv] = useState([]);
    const [items, setItems] = useState([]);


    const handleRowClick = (id) => {
      setSelectedRow(id);
    };
    
    

    const handleView = (order) => {
        console.log(order);
        setSelectedOrder(order);
    };

    useEffect(()=>{
        //console.log(user);
    },[user])
    useEffect(()=>{
        if(orders){
            console.log(orders)
            setAllOrders(orders);
            fetch('http://localhost:8000/inventory/'+user.siteID)
            .then(response => response.json())
            .then(data => {
            setStoreInv(data);
            console.log(data);
            });
        }
    },[orders])
    useEffect(()=>{
        //console.log(selectedOrder)
    },[selectedOrder])
  

    function permissions(){
    }

    function handleRecieveOrders(order){
        console.log(order);
        setSelectedOrder(order);
    }

  return (
    <div>
    <h4>Online Orders That need to be Fulfilled </h4>
    <Table striped bordered hover>
    <thead>
      <tr>
        <th>To</th>
        <th>Type</th>
        <th>Status</th>
        <th>Transaction-ID</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {allOrders.map((order) => (
        <React.Fragment key={order.txnID}>
          <tr key={order.txnID} onClick={() => handleRowClick(order.txnID)} className={selectedRow === order.txnID ? " selected" : ""}>
            
            <td>{order.site_txn_siteIDToTosite.name}</td>
            <td>{order.txnType}</td>
            <td>{order.status}</td>
            <td>{order.txnID}</td>
            <td>
                <button  onClick={() => {handleRecieveOrders(order); console.log(order);}}>Fulfill</button>
            </td>
          </tr>
          {selectedOrder.txnID === order.txnID && (
            <tr>
              <td colSpan="6">
                <FulfilOnlineOrder globalOrders={globalOrders} user ={user} allOrders={allOrders} setAllOrders={setAllOrders} order={selectedOrder} storeInv={storeInv} setSelectedOrder={setSelectedOrder}/>
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

export default OnlineOrders