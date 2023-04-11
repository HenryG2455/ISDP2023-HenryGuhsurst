import React, { useState, useEffect} from 'react';
import OrdersTable from './Order-comps/OrdersTable';
import NewStoreOrder from './Order-comps/NewStoreOrder';
import { constants,txnStatus, txnTypes, } from '../../../data/Constants'
import '../../Main.css';
import RecieveOrders from './Order-comps/RecieveOrders';
import OrdersToFulfill from './Order-comps/Fulfil-comps/OrdersToFulfill';
import DeliveredOrders from './Order-comps/Deliver-comps/DeliveredOrders';
import ReadyOrders from './Order-comps/ReadyOrders';
import OnlineOrders from './Order-comps/Online-comps/OnlineOrders';
import CurbsideOrders from './Order-comps/Online-comps/CurbsideOrders';
import SupplierOrders from './Order-comps/Supplier-comps/SupplierOrders';
import NewSupplierOrder from './Order-comps/Supplier-comps/NewSupplierOrder';
import OpenSupplierOrder from './Order-comps/Supplier-comps/OpenSupplierOrder';


function Orders({user, setKey})  {
    const hidden =  ' hidden';
    const [curUser, setCurUser] = useState(null)
    const [hiddenNameNewStoreOrder, setHiddenNameSO] = useState(hidden);
    const [hiddenNameBack, setHiddenNameB] = useState(hidden);
    const [orders, setOrders] = useState(null);
    const [showComponent, setShowComponent] = useState(true);
    const [sites, setSites] = useState([]);
    const [readyOrders, setReadyOrders] = useState([]);
    const [ordersNeedingToBeRecieved, setOrdersNeedingToBeRecieved] = useState([]);
    const [ordersNeedingToBeFulfilled, setOrdersNeedingToBeFulfilled] = useState([]);
    const [showFulfill, setShowFulfill] = useState(false);
    const [globalOrders, setGlobalOrders] = useState([]);
    const [deliverdOrders, setDeliveredOrders] = useState([]);
    const [onlineOrders, setOnlineOrdres] = useState([]);
    const [showOnlineOrders, setShowOnlineOrders] = useState(false);
    const [ordersBtn, setOrdersBtn] = useState(false);
    const [curbsideBtn, setCurbsideBtn] = useState(false);
    const [curbsideOrders, setCurbsideOrders] = useState([]);
    const [showCurbsideOrders, setShowCurbsideOrders] = useState(false);
    const [showDeliveredOrders, setShowDeliveredOrders] = useState(false);
    const [supplierOrder, setSupplierOrders] = useState([]);
    const [showSupplier, setShowSupplier] = useState(false);
    const [showNewSupplier, setShowNewSupplier] = useState(false);
    const [showOpenSupplier, setShowOpenSupplier] = useState(false);
    const [showNewSupplierBtn, setShowNewSupplierBtn] = useState(true);
    const [openSuppOrder,setOpenSuppOrder]=useState(null);


    useEffect(()=>{
      console.log(curUser);
    },[curUser])

    useEffect(() => {
      if(user){
          setCurUser(user);
          getOrders();
          getOnlineOrders();
          getReadyCurbside();
          fetch('http://localhost:8000/site')
          .then(response => response.json())
          .then(data => {
            const newArr = data.filter(site => site.siteID !== user.siteID);
            setSites(newArr);
            console.log(newArr);
          });
      }
    },[user]);

    async function getOnlineOrders(){
      fetch('http://localhost:8000/txn/onlineorders/getall/'+user.siteID)
      .then(res => {
        if (!res.ok) {
          throw Error('Could not fetch the data for that resource');
        } else {
          return res.json();
        }
      })
      .then(tempOrders => {
        setOnlineOrdres(tempOrders);
        console.log(tempOrders);
      })
      .catch(error => {
        console.log('There was an error', error);
      });
    }

    async function getReadyCurbside(){
      fetch('http://localhost:8000/txn/curbsideready/getall/'+user.siteID)
      .then(res => {
        if (!res.ok) {
          throw Error('Could not fetch the data for that resource');
        } else {
          return res.json();
        }
      })
      .then(tempOrders => {
        setCurbsideOrders(tempOrders);
        console.log(tempOrders);
      })
      .catch(error => {
        console.log('There was an error', error);
      });
    }



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
      //Can the Wharehouse manager make a new Supplier order or Add to the Current one
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
          const filteredOrders = temps.filter(order => order.txnType !== txnTypes.SUPPLIER_ORDER);
          setOrdersNeedingToBeRecieved(filteredOrders)
        }
        if(user.user_permission.find(permission => permission.permissionID === constants.CREATESUPPLIERORDER)){
          setHiddenNameB(hidden)
          const suppOrders = [];
          orders.forEach(order => {
            //console.log("triggered")
            if (order.txnType === txnTypes.SUPPLIER_ORDER) {
              //console.log("triggered")
              suppOrders.push(order);
            }
          });
          suppOrders.forEach(order => {
            if (order.status === txnStatus.NEW) {
              setShowNewSupplier(false);
              setOpenSuppOrder(order);
              setShowNewSupplierBtn(false);
            }else if(order.status === txnStatus.NEW || order.status === txnStatus.SUBMITTED || order.status === txnStatus.DELIVERED){
              setShowNewSupplierBtn(false);
            }
          });
          setSupplierOrders(suppOrders);
  
        }
      }
    }

    

    function handleRecieveOrders(){
      setHiddenNameSO(hidden);
      setHiddenNameB('');
      console.log("here");

    }
    

    //<p>Orders {curUser != null? curUser.firstName || res:String}</p>

  return (
    <div className='mainPageContainer'>
      {curUser != null && (
        <div>
          {showComponent ? <OrdersTable user={curUser}  orders={orders} setShowComponent={setShowComponent}/> : <NewStoreOrder setShowComponent={setShowComponent} sites={sites} user={curUser}  />}
          <button className={hiddenNameNewStoreOrder} onClick={() => {setShowComponent(!showComponent); setHiddenNameB(''); setHiddenNameSO(hidden);}}>New Store Order</button>
          <button className={hiddenNameBack} onClick={() => {setShowComponent(!showComponent);  setHiddenNameB(hidden); setHiddenNameSO('');}}>Back</button>
          
          {(ordersNeedingToBeRecieved.length > 0 && curUser.posn.permissionLevel === constants.WAREHOUSE_MANAGER ) && (
            <RecieveOrders orders={ordersNeedingToBeRecieved}  user={curUser} />
          )}

          {(showFulfill && ordersNeedingToBeFulfilled.length>0) && (
            <OrdersToFulfill globalOrders={globalOrders} orders={ordersNeedingToBeFulfilled} user={curUser} />
          )}

          {(readyOrders.length > 0 && (curUser.posn.positionID === 6 || curUser.posn.positionID === 4  || curUser.posn.permissionLevel === constants.ADMINISTRATOR)&& curUser.user_permission.find(permission => permission.permissionID === constants.MOVEINVENTORY) ) && (
            <ReadyOrders setKey={setKey} globalOrders={globalOrders} orders={readyOrders} user={curUser} />
          )}

          {(deliverdOrders.length>0 &&  curUser.posn.permissionLevel === constants.STORE_MANAGER) && (
            <div className='ordersBtn'>
              <button disabled={ordersBtn} onClick={() => {setShowDeliveredOrders(!showDeliveredOrders); setOrdersBtn(!ordersBtn)}}>New Delivered Order</button>
            </div>
          )}
          
          { showDeliveredOrders && (
            <DeliveredOrders globalOrders={globalOrders} orders={deliverdOrders} user={curUser} />
          )}

          {(onlineOrders.length>0 &&  curUser.posn.permissionLevel === constants.STORE_MANAGER) && (
            <div className='ordersBtn'>
              <button disabled={ordersBtn} onClick={() => {setShowOnlineOrders(!showOnlineOrders); setOrdersBtn(!ordersBtn)}}>You have Online Orders To Fulfil</button>
            </div>
          )}
          
          {showOnlineOrders && (
            <OnlineOrders globalOrders={globalOrders} orders={onlineOrders} user={curUser} />
          )}

          {(curbsideOrders.length>0 &&  curUser.posn.permissionLevel === constants.STORE_MANAGER) && (
            <div className='ordersBtn'>
              <button disabled={curbsideBtn} onClick={() => {setShowCurbsideOrders(!showCurbsideOrders); setCurbsideBtn(!ordersBtn)}}>Curbside Orders Ready For Pickup</button>
            </div>
          )}
          
          {showCurbsideOrders && (
            <CurbsideOrders globalOrders={globalOrders} orders={curbsideOrders} user={curUser} />
          )}

          {((supplierOrder.length>=0) && ((user.user_permission.find((permission) => permission.permissionID ===constants.CREATESUPPLIERORDER) !== undefined))) && (
            <div className='ordersBtn'>
              <button disabled={showSupplier} onClick={() => {setShowSupplier(!showSupplier)}}>Show Supplier Orders</button>
            </div>
          )}
          {showSupplier && (
            <button className={showSupplier?'':'hidden'} onClick={() => {setShowSupplier(!showSupplier)}}>Close</button>
          )}
          
          {showSupplier && (
            <SupplierOrders globalOrders={globalOrders} orders={supplierOrder} user={curUser} />
          )}

          { (showNewSupplierBtn && ((user.user_permission.find((permission) => permission.permissionID ===constants.CREATESUPPLIERORDER) !== undefined))) && (
            <div className='ordersBtn'>
              <button disabled={showNewSupplier} onClick={() => {setShowNewSupplier(!showNewSupplier)}}>New Supplier Order</button>
            </div>
          )}
          {showNewSupplier && (
            <button className={showNewSupplier?'':'hidden'} onClick={() => {setShowNewSupplier(!showNewSupplier)}}>Close</button>
          )}
          {showNewSupplier && (
            <NewSupplierOrder user={curUser} />
          )}

          {(openSuppOrder!==null && (user.user_permission.find((permission) => permission.permissionID ===constants.CREATESUPPLIERORDER) !== undefined)) && (
            <div className='ordersBtn'>
              <button disabled={showOpenSupplier} onClick={() => {setShowOpenSupplier(!showOpenSupplier)}}>Open Supplier Order</button>
            </div>
          )}
          {showOpenSupplier && (
            <button className={showOpenSupplier?'':'hidden'} onClick={() => {setShowOpenSupplier(!showOpenSupplier)}}>Close</button>
          )}
          
          {showOpenSupplier && (
            <OpenSupplierOrder order={openSuppOrder} user={curUser} />
          )}
        </div>
      )}
    </div>
  )
}

export default Orders
//<OnlineOrders globalOrders={globalOrders} orders={onlineOrders} user={curUser} />