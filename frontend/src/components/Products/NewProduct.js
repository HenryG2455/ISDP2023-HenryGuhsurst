import React, { useState, useEffect } from 'react';

function NewProduct({user}) {
  // State for form fields
  

  // State for suppliers and categories
  const [suppliers, setSuppliers] = useState([]);
  const [count, setCount] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    sku: 0,
    description: '',
    category: '',
    weight: 0.1,
    costPrice: 0.1,
    retailPrice: 0.1,
    supplierID: 0,
    active: true,
    notes: '',
    caseSize: 1,
  });
  const categories = [
    "Apparel",
    "Camping",
    "Fitness",
    "Footwear",
    "Sports Equipment",
  ];
  

  useEffect(() => {
    // Fetch suppliers and categories from API
    fetchSuppliers();
    fetchCount();
  }, []);

  const fetchSuppliers = async () => {
    // Replace with the actual API endpoint to fetch suppliers
    const response = await fetch('http://localhost:8000/supplier');
    const data = await response.json();
    console.log(data)
    setSuppliers(data);
  };

  const fetchCount = async () => {
    // Replace with the actual API endpoint to fetch suppliers
    const response = await fetch('http://localhost:8000/item/count');
    const data = await response.json();
    console.log(data)
    setFormValues({ ...formValues, sku: 60001+data });
    setCount(data);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let tempItem = {
        name: formValues.name,
        sku: formValues.sku.toString(),
        description: formValues.description,
        category: formValues.category,
        weight: parseInt(formValues.weight),
        costPrice: parseInt(formValues.costPrice),
        retailPrice: parseInt(formValues.retailPrice),
        supplierID: parseInt(formValues.supplierID),
        active: true,
        notes: formValues.notes,
        caseSize: parseInt(formValues.caseSize),
    }
    console.log(tempItem)

    // Replace with the actual API endpoint to create a new item
    let txnAudit = {
      txnID:0,
      txnType: "ItemCreated",
      status: "Success",
      SiteID: user.siteID,
      deliveryID: 0,
      employeeID: user.employeeID,
      notes: user.username+' added a new item',
    };
    fetch('http://localhost:8000/txnaudit/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(txnAudit)
    })
    const response = await fetch('http://localhost:8000/item/create/newitem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({tempItem:tempItem, user:user}),
    });

    if (response.ok) {
      alert('Item successfully added!');
      setFormValues({
        name: '',
        sku: 0,
        description: '',
        category: '',
        weight: 0.1,
        costPrice: 0.1,
        retailPrice: 0.1,
        supplierID: 0,
        active: true,
        notes: '',
        caseSize: 1,
      });
    } else {
      //alert('Error adding item. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input type="text" id="name" name="name" value={formValues.name} onChange={handleChange} />
        </div>
  
        <div>
          <label htmlFor="supplierID">Supplier: </label>
          <select id="supplierID" name="supplierID" value={formValues.supplierID} onChange={handleChange} required>
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierID} value={parseInt(supplier.supplierID)}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label htmlFor="category">Category: </label>
          <select id="category" name="category" value={formValues.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
            <label htmlFor="description">Description: </label>
            <input type="text" id="description" name="description" value={formValues.description} onChange={handleChange} required/>
        </div>

        {/* Category and supplierID inputs should be select dropdowns with fetched data */}

        <div>
            <label htmlFor="weight">Weight: </label>
            <input type="number" min={0.1} step="0.1" id="weight" name="weight" value={formValues.weight} onChange={handleChange} required/>
        </div>

        <div>
            <label htmlFor="costPrice">Cost Price: </label>
            <input type="number" min={0.1}  step="0.1" id="costPrice" name="costPrice" value={formValues.costPrice} onChange={handleChange} required />
        </div>

        <div>
            <label htmlFor="retailPrice">Retail Price: </label>
            <input type="number" min={0.1}  step="0.1" id="retailPrice" name="retailPrice" value={formValues.retailPrice} onChange={handleChange} required/>
        </div>

        {/* SupplierID input should be a select dropdown with fetched data */}


        <div>
            <label htmlFor="notes">Notes: </label>
            <input type="text" id="notes" name="notes" value={formValues.notes} onChange={handleChange} />
        </div>

        <div>
            <label htmlFor="caseSize">Case Size: </label>
            <input type="number" min={1}  id="caseSize" name="caseSize" value={formValues.caseSize} onChange={handleChange}  required/>
        </div>
  
        {/* ... Add other input fields for description, weight, costPrice, etc., each wrapped in a separate div */}
  
        <div>
          <button type="submit">Add Item</button>
        </div>
      </form>
    </div>
  );
  
}

export default NewProduct;

