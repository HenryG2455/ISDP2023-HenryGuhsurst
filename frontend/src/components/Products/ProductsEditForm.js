import React, { useState } from 'react';

function ProductsEditForm({ item, user }) {
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleChange = (event, field) => {
    setEditedItem({ ...editedItem, [field]: event.target.value });
  };

  const handleSave = async () => {
    let txnAudit = {
      txnID:0,
      txnType: "updateItem",
      status: "Success",
      SiteID: user.siteID,
      deliveryID: 0,
      employeeID: user.employeeID,
      notes: user.username+' updated an item',
    };
    fetch('http://localhost:8000/txnaudit/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(txnAudit)
    })
    let res = await fetch('http://localhost:8000/item/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: editedItem, user: user}),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Error');
    }
    // Handle the response, e.g., show a success message or update the parent component
  };

  const handleRemove = async () => {
    console.log(editedItem)
    let res = await fetch('http://localhost:8000/item/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemID: editedItem.itemID, user: user}),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Error');
    }
    // Handle the response, e.g., show a success message or update the parent component
  };

  return (
    <div>
      <form>
        <div>
          <label>Name:</label>
          <input
            value={editedItem.name}
            onChange={(e) => handleChange(e, 'name')}
          /><br/>

          <label>Description:</label>
          <input
            value={editedItem.description}
            onChange={(e) => handleChange(e, 'description')}
          /><br/>

          <label>Case Size:</label>
          <input
            value={editedItem.caseSize}
            onChange={(e) => handleChange(e, 'caseSize')}
          /><br/>

          <label>Category:</label>
          <input
            value={editedItem.category}
            onChange={(e) => handleChange(e, 'category')}
          /><br/>

          <label>Cost Price:</label>
          <input
            value={editedItem.costPrice}
            onChange={(e) => handleChange(e, 'costPrice')}
          /><br/>

          <label>Notes:</label>
          <input
            value={editedItem.notes || ''}
            onChange={(e) => handleChange(e, 'notes')}
          /><br/>

          <label>Retail Price:</label>
          <input
            value={editedItem.retailPrice}
            onChange={(e) => handleChange(e, 'retailPrice')}
          /><br/>

          <label>SKU:</label>
          <input
            value={editedItem.sku}
            onChange={(e) => handleChange(e, 'sku')}
          /><br/>


          <label>Weight:</label>
          <input
            value={editedItem.weight}
            onChange={(e) => handleChange(e, 'weight')}
          /><br/>
        </div>

      </form>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}

export default ProductsEditForm;
