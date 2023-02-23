import React, { useState, useEffect, Component} from 'react';
import Table from 'react-bootstrap/Table';
import OrdersTable from './Order-comps/OrdersTable';
import NewStoreOrder from './Order-comps/NewStoreOrder';
import { permissionLevels } from '../../../data/Constants'
import '../../Main.css';

function Orders({user})  {
    const hidden =  ' hidden';
    const [curUser, setCurUser] = useState(null)
    const [hiddenName, setHiddenName] = useState('');
    const [hiddenNameSO, setHiddenNameSO] = useState(hidden);
    const [hiddenNameB, setHiddenNameB] = useState(hidden);
    const [errorText, setErrorText] = useState('');
    const [orders, setOrders] = useState(null);
    const [showComponent, setShowComponent] = useState(true);


    let res;
    useEffect(()=>{
        console.log(curUser);
    },[curUser])

    useEffect(() => {
        if(user){
            setCurUser(user);
            permissions();
            getOrders();
        }
    },[user]);

    async function getOrders(){
        try {
            res = await fetch('http://localhost:8000/txn/orders/getall');
          } catch (error) {
            // TypeError: Failed to fetch
            console.log('There was an error', error);
          }
          if (!res.ok) {
            setErrorText("Something went Wrong");
          }else{
            const tempOrders = await res.json();
            setOrders(tempOrders)
            console.log(orders);
          }
    }
    function permissions(){
        if(user.user_permission.find(permission => permission.permissionID === permissionLevels.CREATESTOREORDER)){
            setHiddenNameSO('');
        }
    }
    //<p>Orders {curUser != null? curUser.firstName || res:String}</p>

  return (
    <div>
        {showComponent ? <OrdersTable user={curUser}  orders={orders}/> : <NewStoreOrder user={curUser} className={hiddenName} />}
        <button className={hiddenNameSO} onClick={() => {setShowComponent(!showComponent); setHiddenNameB(''); setHiddenNameSO(hidden);}}>New Store Order</button>
        <button className={hiddenNameB} onClick={() => {setShowComponent(!showComponent);  setHiddenNameB(hidden); setHiddenNameSO('');}}>Back</button>
    </div>
  )
}

export default Orders