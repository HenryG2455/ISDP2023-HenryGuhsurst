import React, { useState, useEffect} from 'react';
import OrdersTable from './Order-comps/OrdersTable';
import NewStoreOrder from './Order-comps/NewStoreOrder';
import { constants,txnStatus} from '../../../data/Constants'
import '../../Main.css';
import RecieveOrders from './Order-comps/RecieveOrders';

function Orders({user})  {
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
    const [ordersNeedingToBeRecieved, setOrdersNeedingToBeRecieved] = useState([]);

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
          setErrorText("Something went Wrong");
        } else {
          return res.json();
        }
      })
      .then(tempOrders => {
        canMakeOrder(tempOrders);
        console.log(tempOrders);
      })
      .catch(error => {
        console.log('There was an error', error);
      });
    }

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

    function canMakeOrder(orders){
      if(user.user_permission.find(permission => permission.permissionID === constants.CREATESTOREORDER)){
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
        }else{
          setOrders(orders);
        }
      }else if(user.posn.permissionLevel === constants.WAREHOUSE_MANAGER){
        isWarhouseManager(orders);
      }else{
        setOrders(orders);
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
      
      {ordersNeedingToBeRecieved.length > 0 && (
        <RecieveOrders orders={ordersNeedingToBeRecieved}  user={curUser} />
      )}
      

    </div>
  )
}

export default Orders