import React from "react";

export default function OrderDetails({ order, setSelectedOrder }) {
  return (
    <div id="viewContainer">
      <button id="closeButton" onClick={() => setSelectedOrder({})}>X</button>
      <h4>Order Details</h4>
      <p className="orderInfo">Txn ID: {order.txnID}</p>
      <p className="orderInfo">From Site: {order.site_txn_siteIDFromTosite.name}</p>
      <p className="orderInfo">To Site: {order.site_txn_siteIDToTosite.name}</p>
      <p className="orderInfo">Status: {order.status}</p>
      <p className="orderInfo">Ship Date: {new Date(order.shipDate).toLocaleString()}</p>
      <p className="orderInfo">Txn Type: {order.txnType}</p>
      <p className="orderInfo">Bar Code: {order.barCode}</p>
      <p className="orderInfo">Created Date: {new Date(order.createdDate).toLocaleString()}</p>
      <p className="orderInfo">Delivery ID: {order.deliveryID}</p>
      <p className="orderInfo">Emergency Delivery: {order.emergencyDelivery ? "Yes" : "No"}</p>
      <p className="orderInfo">Distance Cost: {order.delivery.distanceCost}</p>
      <p className="orderInfo">Vehicle Type: {order.delivery.vehicleType}</p>
      <p className="orderInfo">Items:</p>
      <ul className="orderInfo">
        {order.txnitems.map((item) => (
          <li key={item.ItemID}>
            Item ID: {item.ItemID}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      
    </div>
  );
}