import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import ProductsEditForm from './ProductsEditForm';
import { useNavigate } from 'react-router-dom';

function Products({user}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedItem, setEditedItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearch = (event) => {
    const text = event.target.value.toLowerCase();
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text)
    );
    setSearchText(text);
    setFilteredItems(filtered);
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:8000/item');
      const data = await response.json();
      console.log(data)
      setItems(data);
      setFilteredItems(data)
    }
    fetchData();
  }, [user]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedItem({ ...items[index] });
  };

  const handleChange = (event, field) => {
    setEditedItem({ ...editedItem, [field]: event.target.value });
  };

  const handleSave = () => {
    // Implement the logic to save the edited item to the database
    // For example: make an API call to update the item
    setItems(
      items.map((item, index) => (index === editIndex ? editedItem : item))
    );
    setEditIndex(-1);
    setEditedItem(null);
  };

  const handleRemove = () => {
    // Implement the logic to remove the item from the database
    // For example: make an API call to delete the item
    setItems(items.filter((_, index) => index !== editIndex));
    setEditIndex(-1);
    setEditedItem(null);
  };
  const newProduct = () => {
    navigate('/products/new')
  }

  const closeEdit = () => {
    setEditIndex(-1);
  };

  return (
    <div>
      <h2>Edit/Add Items</h2>
      <button onClick={newProduct}>Add New product</button>
      <div className='table-container-record'>
      <label htmlFor="search">Search:</label>
      <input name='search' type="text" placeholder="Search items" value={searchText} onChange={handleSearch} />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Case-Size</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {filteredItems.map((item, index) => (
                <React.Fragment key={item.itemID}>
                  <tr>
                    <td>{item.itemID}</td>
                    <td>{item.name}</td>
                    <td>{item.caseSize}</td>
                    <td>{item.active?"Yes":"No"}</td>
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                    </td>
                  </tr>
                  {editIndex === index && (
                    <tr>
                      <td id='viewContainer' colSpan={5}>
                        <button id='closeButton' onClick={closeEdit}>X</button>
                        <ProductsEditForm user={user} item={editedItem} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </Table>
      </div>
      <div>
      
      </div>
    </div>
  );
}

export default Products;
