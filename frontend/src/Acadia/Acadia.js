import './Acadia.css';
import React, { useState, useEffect} from 'react';
import AcadiaOrdersTable from './AcadiaOrdersTable';
import AcadiaTransitTable from './AcadiaTransitTable';
import { constants,txnStatus} from '../data/Constants'

function Acadia({user, setUser}) {
    const [curUser, setCurUser] = useState(null)
    const [readyOrders, setReadyOrders] = useState([]);
    const [transitOrders, setTransitOrders] = useState([]);
    const [showComponent, setShowComponent] = useState(true);
    const [sites, setSites] = useState([]);


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
      fetch('http://localhost:8000/txn/orders/getall/acadia')
      .then(res => {
        if (!res.ok) {
          throw Error('Could not fetch the data for that resource');
        } else {
          return res.json();
        }
      })
      .then(tempOrders => {
        let tempReady = tempOrders.filter(order => order.status === txnStatus.READY)
        let tempTransit = tempOrders.filter(order => order.status === txnStatus.IN_TRANSIT)
        setReadyOrders(tempReady);
        setTransitOrders(tempTransit);
        console.log(tempTransit);
      })
      .catch(error => {
        console.log('There was an error', error);
      });
    }


  
  return (
    <div>
      <h4>Orders Ready For Pickup</h4>
      <AcadiaOrdersTable user={curUser}  orders={readyOrders} setShowComponent={setShowComponent}/>
      <h4>Orders In Transit</h4>
      <AcadiaTransitTable user={curUser}  orders={transitOrders} setShowComponent={setShowComponent}/>
    </div>
  )
}

export default Acadia