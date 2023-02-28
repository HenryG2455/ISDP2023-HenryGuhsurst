import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../Main.css';
import ViewRecieveOrder from './ViewRecieveOrder';

function RecieveOrders({user,orders}) {
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const [wharehouseInv, setWharehouseInv] = useState([]);
    const [items, setItems] = useState([]);


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
        if(orders){
            setAllOrders(orders);
            fetch('http://localhost:8000/inventory/'+user.siteID)
            .then(response => response.json())
            .then(data => {
            setWharehouseInv(data);
            console.log(data);
            });
        }
    },[orders])

  

    function permissions(){
    }

    function handleRecieveOrders(order){
        setSelectedOrder(order);
    }

  return (
    <div>
    <h4>Orders That need to be Recieved </h4>
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
                <button  onClick={() => handleRecieveOrders(order)}>Recieve</button>
            </td>
          </tr>
          {selectedOrder.txnID === order.txnID && (
            <tr>
              <td colSpan="6">
                <ViewRecieveOrder allOrders={allOrders} setAllOrders={setAllOrders} order={selectedOrder} wharehouseInv={wharehouseInv} setSelectedOrder={setSelectedOrder}/>
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

export default RecieveOrders