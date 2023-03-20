import React,{useEffect,useState} from "react";
import { Button } from "react-bootstrap";
import "../../../Main.css";
import { useNavigate} from 'react-router-dom';

export default function MoveOrder({ order, setSelectedOrder, setKey }) {
  const navigate = useNavigate();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [recVehicle, setRecVehicle] = useState([]);
  let BadVehicleTypes = [];

  useEffect(() => {
    fetch("http://localhost:8000/vehicle/getall")
      .then((res) => res.json())
      .then((data) => {
        let vehicleData = data;
        fetch("http://localhost:8000/delivery/getall")
        .then((res) => res.json())
        .then((data) => {
          setDeliveries(data);
          setVehicleTypes(vehicleData);
          let weight = getWeight(order);
          recommendedVehicle(data,vehicleData,weight)
          //filterDeliveries(BadVehicleTypes);
        });
        
      });
    
  }, [order]);

  //For Vehicle Table
  function getWeight(order){
    let weight = 0;
    order.txnitems.forEach(item => {
      weight += item.quantity*item.item.weight;
    });
    return weight;
  }

  const filterDeliveries = (data,badVehicleTypes) => {
    let tempDeliveries = [];
    console.log(data);
    if(data.length>0){
      data.forEach(delivery => {
        if(!badVehicleTypes.includes(delivery.vehicleType)){
          tempDeliveries.push(delivery);
        }
      });
      setDeliveries(tempDeliveries);
      console.log(tempDeliveries)
    }
  }


  const options = deliveries.map((delivery) => (
    <option key={delivery.deliveryID} value={delivery.deliveryID}>
      {delivery.deliveryID}
    </option>
  ));

  //this function is used to get the recommended vehicle for the order
  const recommendedVehicle = ( data,vehicles,weight) =>{
    //console.log(vehicles);
    let recVehicle = "";
    let tempTypes = [];
    vehicles.forEach(vehicle => {
      if(vehicle.maxWeight >= weight){
        recVehicle = vehicle.vehicleType;
      }else{
        tempTypes.push(vehicle.vehicleType); 
      }
    });
    BadVehicleTypes = tempTypes;
    //console.log(BadVehicleTypes)
    //console.log(data)
    filterDeliveries(data,BadVehicleTypes);
    setRecVehicle(recVehicle);
  }



  const  handleSubmit = (e) => {
    e.preventDefault();
    const deliveryID = e.target.elements[0].value;
    console.log(e.target.elements[0].value);


    const data = {
      "deliveryID": deliveryID,
    }
    fetch("http://localhost:8000/txn/transit/order/"+order.txnID, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)      
    })
    .then(res => {
      if (!res.ok) {
        throw Error('Could not fetch the data for that resource');
      } else {
        console.log(res.json());
        fetch('http://localhost:8000/inventory/update/transit/'+9999, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({items: order.txnitems })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                })
                .then(data => {
                    console.log(data);  
                    //window.location.reload();
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        window.location.reload();
        setKey("inventory");
        
      }
    }
    )
  };
  //For Other Tables
  //<p className="orderInfo">Delivery ID: {order.deliveryID}</p>
  return (
    <div className="load-Order">
      <form onSubmit={handleSubmit}>
        <div className="truckInfo">
          <h4>Add Truck Info</h4>
          <label htmlFor="delivery-select">Select a Truck ID: </label>
          <select id="delivery-select">{options}</select>
        </div>
        <div className="loadInfo" id="viewContainer">
          <button id="closeButton" onClick={() => setSelectedOrder({})}>X</button>
          <h4>Order Details</h4>
          <p className="orderInfo"><b>Txn ID</b>: {order.txnID}</p>
          <p className="orderInfo"><b>From Site</b>: {order.site_txn_siteIDFromTosite.name}</p>
          <p className="orderInfo"><b>To Site</b>: {order.site_txn_siteIDToTosite.name}</p>
          <p className="orderInfo"><b>Status</b>: {order.status}</p>
          <p className="orderInfo"><b>Ship Date</b>: {new Date(order.shipDate).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
          <p className="orderInfo"><b>Txn Type</b>: {order.txnType}</p>
          <p className="orderInfo"><b>Created Date</b>: {new Date(order.createdDate).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
          <p className="orderInfo"><b>Emergency Delivery</b>: {order.emergencyDelivery ? "Yes" : "No"}</p>
          <p className="orderInfo"><b>Weight</b>: {getWeight(order)}</p>
          <p className="orderInfo"><b>Vehicle Size Needed</b>: {recVehicle}</p>
          <p className="orderInfo"><b>Items</b>:</p>
          <ul className="orderInfo">
          
            {order.txnitems.map((item) => (
              <li key={item.ItemID}>
              <b>Item ID</b>: {item.ItemID}, <b>Quantity</b>: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit">Transfer Order</Button>
      </form>
    </div>
  );
}