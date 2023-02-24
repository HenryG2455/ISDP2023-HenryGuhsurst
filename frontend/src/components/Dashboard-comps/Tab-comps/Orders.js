import React, { useState, useEffect} from 'react';
import OrdersTable from './Order-comps/OrdersTable';
import NewStoreOrder from './Order-comps/NewStoreOrder';
import { constants,txnStatus,txnTypes } from '../../../data/Constants'
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
    const [sites, setSites] = useState([]);

    let res;
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
    function canMakeOrder(orders){
      if(user.user_permission.find(permission => permission.permissionID === constants.CREATESTOREORDER)){
        if(user.posn.permissionLevel === constants.WAREHOUSE_MANAGER){
          setHiddenNameSO(hidden);
          setHiddenNameB(hidden);
          setOrders(orders);
        }else if(user.posn.permissionLevel === constants.STORE_MANAGER){
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
      }else{
        setOrders(orders);
      }
    }
    //<p>Orders {curUser != null? curUser.firstName || res:String}</p>

  return (
    <div>
      {showComponent ? <OrdersTable user={curUser}  orders={orders} setShowComponent={setShowComponent}/> : <NewStoreOrder setShowComponent={setShowComponent} sites={sites} user={curUser} className={hiddenName} />}
      <button className={hiddenNameSO} onClick={() => {setShowComponent(!showComponent); setHiddenNameB(''); setHiddenNameSO(hidden);}}>New Store Order</button>
      <button className={hiddenNameB} onClick={() => {setShowComponent(!showComponent);  setHiddenNameB(hidden); setHiddenNameSO('');}}>Back</button>
    </div>
  )
}

export default Orders