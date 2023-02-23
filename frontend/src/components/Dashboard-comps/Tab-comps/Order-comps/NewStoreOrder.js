import React, { useState, useEffect, Component} from 'react';
import Table from 'react-bootstrap/Table';
import '../../../Main.css'

function NewStoreOrder() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:8000/item')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setItems(data);
          setFilteredItems(data);
        });
    }, []);
  
    const handleSearch = (event) => {
      const text = event.target.value.toLowerCase();
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text) ||
        item.category.toLowerCase().includes(text)
      );
      setSearchText(text);
      setFilteredItems(filtered);
    }
  
    const handleAddItem = (item) => {
      setSelectedItems([...selectedItems, item]);
    }
  
    const handleRemoveItem = (item) => {
      setSelectedItems(selectedItems.filter(selectedItem =>
        selectedItem.itemID !== item.itemID
      ));
    }
  
    const itemTableColumns = ['ID', 'Description', 'Qty', 'Threshold', 'Ordered'];
  
    return (
      <div>
        <h2>New Store Order</h2>
        <input type="text" placeholder="Search items" value={searchText} onChange={handleSearch} />
        <div className='table-container'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    {itemTableColumns.map(column =>
                        <th key={column}>{column}</th>
                    )}
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map(item =>
                    <tr key={item.itemID}>
                        <td>{item.itemID}</td>
                        <td>{item.name}</td>
                        <td>{item.weight}</td>
                        <td>{item.caseSize}</td>
                        <td><input className='orderInput' type="number" defaultValue={0} min={0} max={10} /></td>
                    </tr>
                    )}
                </tbody>
            </Table>
        </div>
        <button onClick={() => handleAddItem(items)}>Add</button>
        <h3>Selected Items</h3>
        <div className='table-container'>
            <Table className=' table-container' striped bordered hover>
            <thead>
                <tr>
                {itemTableColumns.map(column =>
                    <th key={column}>{column}</th>
                )}
                <th></th>
                </tr>
            </thead>
            <tbody>
                {selectedItems.map(item =>
                <tr key={item.itemID}>
                    <td>{item.itemID}</td>
                    <td>{item.name}</td>
                    <td>{item.weight}</td>
                    <td>{item.caseSize}</td>
                    <td><input type="number" defaultValue={0} min={0} max={item.qty} /></td>
                </tr>
                )}
            </tbody>
            </Table>
        </div>
        <button onClick={() => setFilteredItems(items)}>Refresh</button>
        <button onClick={() => handleRemoveItem(items)}>Remove</button>
        
      </div>
    );
}

export default NewStoreOrder