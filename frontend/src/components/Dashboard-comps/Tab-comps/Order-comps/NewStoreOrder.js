import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import '../../../Main.css'
import {constants, txnStatus, txnTypes} from '../../../../data/Constants';
import { useNavigate} from 'react-router-dom';
  


function NewStoreOrder({user, sites , setShowComponent}) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [cases, setCases] = useState(0);
    const [tempCases, setTempCases] = useState(0);
    const [locations, setLocations] = useState([]);
    const [selectedButton, setSelectedButton] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [inventory, setInventory] = useState(null);

    const Days = {SUNDAY:0, MONDAY:1, TUESDAY:2,WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6};
    //const [allSites, setSites] = useState([]);
     
    useEffect(() => {
      fetch('http://localhost:8000/item')
        .then(response => response.json())
        .then(data => {
          //console.log(data);
          setItems(data);
          setFilteredItems(data);
        });
    }, []);
    useEffect(()=>{
      if(sites && user){
        sitePermission(sites)
        fetch('http://localhost:8000/inventory/'+user.siteID)
            .then(response => response.json())
            .then(data => {
              setInventory(data);
              //console.log(data);
            });
      }
    },[sites, user])

    useEffect(()=>{
      console.log(selectedLocation)
    },[selectedLocation])
    //TABLE ROWS ADD Button Disabler
    const handleRowClick = (id) => {
      setSelectedRow(id);
    };

    function getNextDateByDayOfWeek(currentDate, dayOfWeek) {
      const date = new Date(currentDate);
      const targetDayOfWeek = dayOfWeek % 7;
      const daysToAdd = targetDayOfWeek - date.getDay() + (targetDayOfWeek <= date.getDay() ? 7 : 0);
      date.setDate(date.getDate() + daysToAdd);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }


    //SEARCH BAR
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

    //CASES CHANGE FUNCTION
    function handleChange(event) {
      setCases(event.target.value);
    }
  
    //ADD ITEMS TO THE CART OF ITEMS FOR SUBMISSION
    const handleAddItem = (item) => {
      let newItem ={...item, quantity:cases}
      if(selectedButton && selectedItems.length > 4){
        alert("You can only order 5 items for emergency delivery");
      }else{
        setSelectedItems([...selectedItems, newItem]);
        const inputs = document.querySelectorAll(".orderInput");
        inputs.forEach((input) => (input.value = 0));
        setCases(0);
      }
      
    }

    //HANDLE SUBMISSION OF THE CART TO THE DB
    const handleSubmit = async(event) => {
      event.preventDefault();
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const siteDeliveryDay = Days[user.site.dayOfWeek];
      
      const deliveryDate = getNextDateByDayOfWeek(currentDate, siteDeliveryDay);
      console.log(deliveryDate);
      const barcode = Math.random().toString(36).substring(2, 12);
      console.log(selectedItems);
      const txn ={
        siteIDTo: parseInt(selectedLocation),
        siteIDFrom: user.siteID,
        status:txnStatus.SUBMITTED,
        shipDate:deliveryDate,
        txnType:txnTypes.STORE_ORDER,
        barCode:barcode,
        createdDate: currentDate,
        deliveryID: null,
        emergencyDelivery: selectedButton,
        notes:""
      }
      const tmpItems = selectedItems.map(({ itemID, quantity }) => ({
        itemID,
        quantity
      }));

      const notInInvItems = tmpItems.map(obj => {
        const { itemID, ...rest } = obj; // Destructure object to get old field and rest of object
        return { ItemID: itemID, ...rest }; // Create new object with updated field name
    });
      console.log(notInInvItems);
      const txnItems = notInInvItems.map(item => ({...item, quantity: +item.quantity}));
      console.log(txn);
      console.log(txnItems);
      fetch('http://localhost:8000/txn/storeOrder/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({txn: txn, txnItems: txnItems})
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFilteredItems(items)
        setSelectedItems([]);
        setSelectedLocation('');
        console.log(data);
        window.location.reload();
      })
      .catch(error => {
        setFilteredItems(items)
        setSelectedItems([]);
        setSelectedLocation('');
        console.error('There has been a problem with your fetch operation:', error);
      });
      
    }
    //emergency selector
    const handleRadioClick = () => {
      setSelectedButton(!selectedButton);
    }
    //location selector function
    const handleLocationChange = (event) => {
      setSelectedLocation(event.target.value);
    }

    //Remove Items from Cart Function
    const handleRemoveItem = (item) => {
      setSelectedItems(selectedItems.filter(selectedItem =>
        selectedItem.itemID !== item.itemID
      ));
    }
    
    
    // CONST Variables for iteriation
    const itemTableColumns = ['ItemID', 'Description', 'Qty', 'Threshold', 'Cases'];
    const cartTableColumns = ['ItemID', 'Description', 'Order Qty', 'CaseSize', 'Price']
    
    const sitePermission = (sites) => {
      if(user.posn.permissionLevel === constants.WAREHOUSE_MANAGER){
        setLocations(sites.map(site => (
          <option key={site.id} value={site.id}>
            {site.name + ': '+site.address}
          </option>
        )))
      }else{
        setLocations([
        <option key={sites[0].siteID} value={sites[0].siteID}>
          {sites[0].name + ': '+sites[0].address}
        </option>])
      }
    };

    const findQuantity = (itemId) => {
      const inventoryItem = inventory.find(item => item.itemID === itemId);
      return inventoryItem ? inventoryItem.quantity : 0;
    };


    return (
      <div id="mainPageContainer">
        <form onSubmit={handleSubmit}>
          <div id='headerContainer'>
            <h2>Items to add to Order</h2>
            <input type="text" placeholder="Search items" value={searchText} onChange={handleSearch} />
            <div id="radioBtn">
              
                <input type="radio" name="mode"  checked={selectedButton === false} onChange={handleRadioClick} />
                <label>   Regular</label><br/>  
             
                <input type="radio" name="mode"  checked={selectedButton === true} onChange={handleRadioClick} />
                <label>   Emergency</label>
              
            </div>
          </div>
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
                      <tr key={item.itemID} onClick={() => handleRowClick(item.itemID)} className={selectedRow === item.itemID ? " selected" : ""}>
                          <td>{item.itemID}</td>
                          <td>{item.name}</td>
                          <td>{inventory === null? 0: findQuantity(item.itemID)}</td>
                          <td>{item.caseSize}</td>
                          <td><input className='orderInput' type="number" defaultValue={tempCases} min={0} max={99} onChange={handleChange}/></td>
                          <td><Button disabled={selectedRow !== item.itemID} onClick={() => {handleAddItem(item); }}>Add</Button></td>
                      </tr>
                      )}
                  </tbody>
              </Table>
          </div>
          <Button onClick={() => setFilteredItems(items)}>Refresh</Button>
          <h3>Selected Items for Order</h3>
          <div className='table-container'>
              <Table className=' table-container' striped bordered hover>
              <thead>
                  <tr>
                  {cartTableColumns.map(column =>
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
                      <td>{item.quantity}</td>
                      <td>{item.caseSize}</td>
                      <td>{item.quantity*parseInt(item.costPrice)}</td>
                      <td><Button onClick={() => handleRemoveItem(item)}>Remove</Button></td>
                  </tr>
                  )}
              </tbody>
              </Table>
          </div>
          <div>
            <label htmlFor="locationSelector">Ship To: </label>
            <select id="locationSelector" value={selectedLocation} onChange={handleLocationChange} required>
              <option value="">--Select Location--</option>
              {locations}
            </select>
          </div>
          <Button type='submit' disabled={selectedItems.length > 0? false : true}>Submit</Button>
        </form>
      </div>
    );
}

export default NewStoreOrder