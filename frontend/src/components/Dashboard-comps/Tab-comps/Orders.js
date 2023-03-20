import React, { useState, useEffect} from 'react';
import OrdersTable from './Order-comps/OrdersTable';
import NewStoreOrder from './Order-comps/NewStoreOrder';
import { constants,txnStatus, } from '../../../data/Constants'
import '../../Main.css';
import RecieveOrders from './Order-comps/RecieveOrders';
import OrdersToFulfill from './Order-comps/Fulfil-comps/OrdersToFulfill';
import DeliveredOrders from './Order-comps/Deliver-comps/DeliveredOrders';
import ReadyOrders from './Order-comps/ReadyOrders';

function Orders({user, setKey})  {
    const hidden =  ' hidden';
    const [curUser, setCurUser] = useState(null)
    const [hiddenNameNewStoreOrder, setHiddenNameSO] = useState(hidden);
    const [hiddenNameRecieveStoreOrder, setHiddenNameRSO] = useState(hidden);
    const [hiddenNameRSOPage, setHiddenNameRSOPage] = useState(true);
    const [hiddenNameBack, setHiddenNameB] = useState(hidden);
    const [errorText, setErrorText] = useState('');
    const [orders, setOrders] = useState(null);
    const [showComponent, setShowComponent] = useState(true);
    const [sites, setSites] = useState([]);
    const [readyOrders, setReadyOrders] = useState([]);
    const [ordersNeedingToBeRecieved, setOrdersNeedingToBeRecieved] = useState([]);
    const [ordersNeedingToBeFulfilled, setOrdersNeedingToBeFulfilled] = useState([]);
    const [showFulfill, setShowFulfill] = useState(false);
    const [globalOrders, setGlobalOrders] = useState([]);
    const [deliverdOrders, setDeliveredOrders] = useState([]);

    useEffect(()=>{
      console.log(curUser);
    },[curUser])

    useEffect(() => {
      if(user){
          setCurUser(user);
          getOrders();
          fetch('http://localhost:8000/site')
          .then(response => response.json())
          .then(data => {
            const newArr = data.filter(site => site.siteID !== user.siteID);
            setSites(newArr);
            console.log(newArr);
          });
      }
    },[user]);

    async function getOrders(){
      fetch('http://localhost:8000/txn/orders/getall')
      .then(res => {
        if (!res.ok) {
          throw Error('Could not fetch the data for that resource');
        } else {
          return res.json();
        }
      })
      .then(tempOrders => {
        setGlobalOrders(tempOrders);
        canMakeOrder(tempOrders);
        checkForProcessing(tempOrders);
        checkForReady(tempOrders);
        checkForDelivered(tempOrders);
        console.log(tempOrders);
      })
      .catch(error => {
        console.log('There was an error', error);
      });
    }

    const checkForDelivered = (orders) => { 
      let temp = [];
      orders.filter(order => order.status === txnStatus.DELIVERED).forEach(order => { temp.push(order)});
      console.log(temp)
      setDeliveredOrders(temp);
    }

    const checkForReady = (orders) => {
      let temp = [];
      orders.filter(order => order.status === txnStatus.READY).forEach(order => { temp.push(order)});
      console.log(temp)
      setReadyOrders(temp);
    }


    const  checkForProcessing = (orders) => {
      let temp = [];
      orders.filter(order => order.status === txnStatus.PROCESSING).forEach(order => { temp.push(order)});
      //console.log(temp)
      setOrdersNeedingToBeFulfilled(temp);
    }

    //this function checks if the user is a warehouse manager and if they are it will check if they have the permission to recieve orders
    function canMakeOrder(orders){
      console.log(orders);
      //first the user has to have the permission to create a store order
      if(user.user_permission.find(permission => permission.permissionID === constants.CREATESTOREORDER)){
        setHiddenNameSO(" ");
        console.log(typeof orders);
        if(user.posn.permissionLevel === constants.STORE_MANAGER){
          setHiddenNameSO(" ");
          const userOrders = [];
          orders.forEach(order => {
            if (order.siteIDFrom === user.siteID || order.siteIDTo === user.siteID) {
              userOrders.push(order);
            }
          });
          userOrders.forEach(order => {
            if (order.status === txnStatus.SUBMITTED || order.status === txnStatus.NEW) {
              setHiddenNameSO(hidden);
            }else{
              setHiddenNameSO(" ");
            }
          });
          setOrders(userOrders);
          //this is to check if the user is a warehouse manager and if they are it will check if they have the permission to recieve orders
        }else if(user.posn.permissionLevel === constants.WAREHOUSE_MANAGER){
          if(user.user_permission.find(permission => permission.permissionID === constants.FULFILSTOREORDER)){
            setShowFulfill(true);
          }
          isWarhouseManager(orders);
        }else{
          setOrders(orders);
        }
        //if the user does not have the permission to create a store order then it will check if they 
        //are a warehouse employee and if they are it will check if they have the permission to recieve orders
      }else if(user.posn.permissionLevel === constants.WAREHOUSE_EMPLOYEE  && user.user_permission.find(permission => permission.permissionID === constants.FULFILSTOREORDER)){
        setShowFulfill(true);
        setOrders(orders);
      }
      else{
        setOrders(orders);
      }
    }

    //this function checks if the user is a warehouse manager and if they are it will check if they have the permission to recieve orders
    function isWarhouseManager(orders){
      if(user.posn.permissionLevel === constants.WAREHOUSE_MANAGER){
        setHiddenNameSO(hidden);
        setHiddenNameB(hidden);
        setOrders(orders);
        
        if(orders.find(order => order.siteIDTo === user.siteID && order.status === txnStatus.SUBMITTED)){
          let temps = orders.filter(order => order.siteIDTo === user.siteID && order.status === txnStatus.SUBMITTED);
          temps.sort((a, b) => {
            if (a.emergencyDelivery === b.emergencyDelivery) {
              return 0;
            } else if (a.emergencyDelivery) {
              return -1;
            } else {
              return 1;
            }
          });
          //console.log(temps)
          setOrdersNeedingToBeRecieved(temps)
          setHiddenNameRSO('');
        }
      }
    }

    

    function handleRecieveOrders(){
      setHiddenNameSO(hidden);
      setHiddenNameB('');
      setHiddenNameRSOPage('');
      console.log("here");

    }
    

    //<p>Orders {curUser != null? curUser.firstName || res:String}</p>

  return (
    <div>
      {showComponent ? <OrdersTable user={curUser}  orders={orders} setShowComponent={setShowComponent}/> : <NewStoreOrder setShowComponent={setShowComponent} sites={sites} user={curUser}  />}
      <button className={hiddenNameNewStoreOrder} onClick={() => {setShowComponent(!showComponent); setHiddenNameB(''); setHiddenNameSO(hidden);}}>New Store Order</button>
      <button className={hiddenNameBack} onClick={() => {setShowComponent(!showComponent);  setHiddenNameB(hidden); setHiddenNameSO('');}}>Back</button>
      
      {(ordersNeedingToBeRecieved.length > 0 && user.posn.permissionLevel === constants.WAREHOUSE_MANAGER ) && (
        <RecieveOrders orders={ordersNeedingToBeRecieved}  user={curUser} />
      )}

      {(showFulfill && ordersNeedingToBeFulfilled.length>0) && (
        <OrdersToFulfill globalOrders={globalOrders} orders={ordersNeedingToBeFulfilled} user={curUser} />
      )}

      {(readyOrders.length > 0 && (user.posn.positionID === 6 || user.posn.positionID === 4  || user.posn.permissionLevel === constants.ADMINISTRATOR)&& user.user_permission.find(permission => permission.permissionID === constants.MOVEINVENTORY) ) && (
        <ReadyOrders setKey={setKey} globalOrders={globalOrders} orders={readyOrders} user={curUser} />
      )}
      
      {(deliverdOrders.length>0 &&  user.posn.permissionLevel === constants.STORE_MANAGER) && (
        <DeliveredOrders globalOrders={globalOrders} orders={deliverdOrders} user={curUser} />
      )}
      
      
      

    </div>
  )
}

export default Orders