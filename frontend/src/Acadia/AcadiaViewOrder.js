import React,{useEffect,useState} from "react";

export default function AcadiaOrderDetails({ order, setSelectedOrder }) {
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/vehicle/getall")
      .then((res) => res.json())
      .then((data) => {
        setVehicleTypes(data);
      });
  }, []);
  //For Vehicle Table
  function getWeight(order){
    let weight = 0;
    order.txnitems.forEach(item => {
      weight += item.quantity*item.item.weight;
    });
    return weight;
  }
  function recommendedVehicle(order,weight){
    console.log(vehicleTypes);
    let recommendedVehicle = "";
    vehicleTypes.forEach(vehicle => {
      if(vehicle.maxWeight >= weight){
        recommendedVehicle = vehicle.vehicleType;
      }
    });
    return recommendedVehicle;
  }
  //For Other Tables
  //<p className="orderInfo">Delivery ID: {order.deliveryID}</p>
  return (
    <div id="viewContainer">
      <button id="closeButton" onClick={() => setSelectedOrder({})}>X</button>
      <h4>Details</h4>
      <p className="orderInfo"><b>Txn ID</b>: {order.txnID}</p>
      <p className="orderInfo"><b>From Site</b>: {order.site_txn_siteIDFromTosite.name}</p>
      <p className="orderInfo"><b>To Site</b>: {order.site_txn_siteIDToTosite.name}</p>
      <p className="orderInfo"><b>Status</b>: {order.status}</p>
      <p className="orderInfo"><b>Ship Date</b>: {new Date(order.shipDate).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
      <p className="orderInfo"><b>Txn Type</b>: {order.txnType}</p>
      <p className="orderInfo"><b>Created Date</b>: {new Date(order.createdDate).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
      <p className="orderInfo"><b>Emergency Delivery</b>: {order.emergencyDelivery ? "Yes" : "No"}</p>
      <p className="orderInfo"><b>Weight</b>: {getWeight(order)}</p>
      <p className="orderInfo"><b>Vehicle Size Needed</b>: {recommendedVehicle(order,getWeight(order))}</p>
      <p className="orderInfo"><b>Items</b>:</p>
      <ul className="orderInfo">
      
        {order.txnitems.map((item) => (
          <li key={item.ItemID}>
          <b>Item ID</b>: {item.ItemID}, <b>Quantity</b>: {item.quantity}
          </li>
        ))}
      </ul>
      
    </div>
  );
}