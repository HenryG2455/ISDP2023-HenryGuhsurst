import React from "react";

export default function OrderDetails({ order, setSelectedOrder }) {
  return (
    <div id="viewContainer">
      <button id="closeButton" onClick={() => setSelectedOrder({})}>X</button>
      <h4>Order Details</h4>
      
      <p className="orderInfo"><b>Txn ID</b>: {order.txnID}</p>
      <p className="orderInfo"><b>From Site</b>: {order.site_txn_siteIDFromTosite.name}</p>
      <p className="orderInfo"><b>To Site</b>: {order.site_txn_siteIDToTosite.name}</p>
      <p className="orderInfo"><b>Status</b>: {order.status}</p>
      <p className="orderInfo"><b>Ship Date</b>: {new Date(order.shipDate).toLocaleString()}</p>
      <p className="orderInfo"><b>Txn Type</b>: {order.txnType}</p>
      <p className="orderInfo"><b>Bar Code</b>: {order.barCode}</p>
      <p className="orderInfo"><b>Created Date</b>: {new Date(order.createdDate).toLocaleString()}</p>
      <p className="orderInfo"><b>Delivery ID</b>: {order.deliveryID}</p>
      <p className="orderInfo"><b>Emergency Delivery</b>: {order.emergencyDelivery ? "Yes" : "No"}</p>
      <p className="orderInfo"><b>Distance Cost</b>: {order.delivery === null? "":order.delivery.distanceCost}</p>
      <p className="orderInfo"><b>Vehicle Type</b>: {order.delivery === null? "":order.delivery.vehicleType}</p>
      <p className="orderInfo"><b>Items</b>:</p>
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