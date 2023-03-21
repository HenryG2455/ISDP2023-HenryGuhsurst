import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import '../components/Main.css'
import {constants, txnStatus, txnTypes} from '../data/Constants';
import { useNavigate} from 'react-router-dom';
import Inventory from '../components/Dashboard-comps/Tab-comps/Inventory';
  


function CustomerPage() {
    const navigate = useNavigate();
    const [selectedSite, setSelectedSite] = useState('');
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
    const [storeInventory, setStoreInventory] = useState(null);
    const [sites,setSites]=useState([]);
    const [orderSites,setOrderSites]=useState([]);
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
      });

    const Days = {SUNDAY:0, MONDAY:1, TUESDAY:2,WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6};
    //const [allSites, setSites] = useState([]);
     
    
    useEffect(()=>{  
        fetch('http://localhost:8000/inventory/getall')
            .then(response => response.json())
            .then(data => {
                setInventory(data);
                setStoreInventory(data.filter(item => item.siteID === 4));
                setFilteredItems(data.filter(item => item.siteID === 4));
                console.log(data);
            })
            fetch('http://localhost:8000/site')
            .then(response => response.json())
            .then(data => {
                setSites(data);
                let tempSite = data.filter(site => (site.siteID === 4 || site.siteID === 5 || site.siteID === 6 || site.siteID === 7 || site.siteID === 8 || site.siteID === 9 || site.siteID === 10))
                siteLocations(tempSite)
                setOrderSites(tempSite)
                console.log(data);
            });
            setSelectedSite(4)
    },[])

    useEffect(()=>{
      console.log(selectedLocation)
    },[selectedLocation])
    //TABLE ROWS ADD Button Disabler
    const handleRowClick = (id) => {
      setSelectedRow(id);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCustomer({ ...customer, [name]: value });
    };

    const siteLocations = (sites) => {
        setLocations(sites.map(site => (
            <option key={site.siteID} value={site.siteID}>
                {site.name}
            </option>
        )))
    };

    const handleSiteChange = (event) => {
        setSelectedItems([]);
        setSelectedRow(null);
        if(event.target.value !== 'all'){
            setSelectedSite(parseInt(event.target.value));
            console.log(event.target.value)
            let newStoreInv= inventory.filter(item => item.siteID === parseInt(event.target.value))
            console.log(newStoreInv)
            setStoreInventory(newStoreInv);
            setFilteredItems(newStoreInv);
        }
    };


    //SEARCH BAR
    const handleSearch = (event) => {
        const text = event.target.value.toLowerCase();
        const num = parseInt(event.target.value);
        let filtered;
        if (!isNaN(num)) { // check if the value is a number
          filtered = storeInventory.filter(item => item.itemID === num);
        } else {
          filtered = storeInventory.filter(item =>
            item.item.name.toLowerCase().includes(text) ||
            item.item.description.toLowerCase().includes(text) ||
            item.item.category.toLowerCase().includes(text)
          );
        }
        if (!isNaN(num)) { // sort by itemID if the value is a number
          filtered.sort((a, b) => (a.itemID > b.itemID) ? 1 : -1);
        }
        setSearchText(text);
        setFilteredItems(filtered);
    }

    //CASES CHANGE FUNCTION
    function handleChange(event) {
      setCases(parseInt(event.target.value));
    }
  
    //ADD ITEMS TO THE CART OF ITEMS FOR SUBMISSION

    const handleAddItem = (item) => {
        const newItem = { ...item, quantity: cases };
        const selectedItemIndex = selectedItems.findIndex(
          (sitem) => sitem.itemID === newItem.itemID
        );
        if (selectedItemIndex !== -1) {
          const selectedItem = selectedItems[selectedItemIndex];
          const tempSIItem = storeInventory.find(
            (siItem) => siItem.itemID === item.itemID && siItem.siteID === item.siteID
          );
          if (selectedItem.quantity === tempSIItem.quantity) {
            alert('You have reached the maximum amount of this item in stock');
          } else if(newItem.quantity + selectedItem.quantity > tempSIItem.quantity){
            alert('the amount you have sleected will go over the stock limit of the store');

          }else {
            const updatedSelectedItems = [...selectedItems];
            updatedSelectedItems[selectedItemIndex] = {
              ...selectedItem,
              quantity: selectedItem.quantity + newItem.quantity,
            };
            setSelectedItems(updatedSelectedItems);
          }
        } else {
          setSelectedItems([...selectedItems, newItem]);
        }
        const inputs = document.querySelectorAll('.orderInput');
        inputs.forEach((input) => (input.value = 0));
        setCases(0);
      };

    //HANDLE SUBMISSION OF THE CART TO THE DB
    const handleSubmit = async(event) => {
      event.preventDefault();
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const barcode = Math.random().toString(36).substring(2, 12);
      console.log(selectedSite);
      let customerInfo = customer.name.toLocaleLowerCase() + "," + customer.phone + "," + customer.email.toLocaleLowerCase();
      const txn ={
        siteIDTo: selectedSite,
        siteIDFrom:selectedSite,
        status:txnStatus.PROCESSING,
        shipDate:currentDate,
        txnType:txnTypes.CURBSIDE,
        barCode:barcode,
        createdDate: currentDate,
        deliveryID: null,
        emergencyDelivery: null,
        notes:customerInfo
      }
      const tmpItems = selectedItems.map(({ itemID, quantity }) => ({
        ItemID:itemID,
        quantity
      }));
      console.log(tmpItems);
      console.log(txn);
      fetch('http://localhost:8000/txn/onlineOrder/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({txn: txn, txnItems: tmpItems})
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        window.location.reload();
      })
      .catch(error => {
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
    const itemTableColumns = ['Item ID', 'Name', 'Qty', 'Price', 'Amount', 'Add to Cart'];
    const cartTableColumns = ['Item ID', 'Name', 'Order Qty', 'CaseSize', 'Price']
    


    const findQuantity = (itemId) => {
      const inventoryItem = storeInventory.find(item => item.itemID === itemId);
      //console.log(inventoryItem.quantity)
      return inventoryItem ? inventoryItem.quantity : 0;
    };
    function nav(){
        navigate('/onlinesearch')
    }


    return (
      <div>
        <div className='topper'>
            <h3>Already have an Order?</h3>
            <span>Click This <Button onClick={nav}>link</Button> To search for you Order</span>
        </div>
        <div id="mainPageContainer">

        <form onSubmit={handleSubmit}>
            <div id='headerContainer'>
            <h2>Shop Below</h2>
            <input type="text" placeholder="Search items" value={searchText} onChange={handleSearch} />
            <label htmlFor="locationSelector">Order From Store: </label>
            <select id="site-select" value={selectedSite} onChange={handleSiteChange} >
                {locations} 
            </select>
            </div>
            <div className='table-container'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        {itemTableColumns.map(column =>
                            <th key={column}>{column}</th>
                        )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item =>
                        <tr key={item.itemID} onClick={() => handleRowClick(item.itemID)} className={selectedRow === item.itemID ? " selected" : ""}>
                            <td>{item.itemID}</td>
                            <td>{item.item.name}</td>
                            <td>{inventory === null? 0: findQuantity(item.itemID)}</td>
                            <td>${item.item.retailPrice}</td>
                            <td><input className='orderInput' type="number" defaultValue={tempCases} min={0} max={findQuantity(item.itemID)} onChange={handleChange}/></td>
                            <td><Button disabled={selectedRow !== item.itemID} onClick={() => {handleAddItem(item)}}>Add</Button></td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <Button onClick={() => setFilteredItems(storeInventory)}>Refresh</Button>
            <h3>Your Cart</h3>
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
                        <td>{item.item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.item.sku}</td>
                        <td>${item.quantity*parseInt(item.item.retailPrice)}</td>
                        <td><Button onClick={() => handleRemoveItem(item)}>Remove</Button></td>
                    </tr>
                    )}
                </tbody>
                </Table>
            </div>
            <div>
            <h6>Enter You information below</h6>
            <div className='inputs'>
                <label>Name:</label>
                <input type="text" name="name" value={customer.name} onChange={handleInputChange} required/>
            </div>
            <div className='inputs'>
                <label>Email:</label>
                <input type="email" name="email" value={customer.email} onChange={handleInputChange} required/>
            </div>
            <div className='inputs'>
                <label>Phone:</label>
                <input type="tel" name="phone" pattern='\d{3}\d{3}\d{4}' value={customer.phone} onChange={handleInputChange} required/>
            </div>    
            </div>
            <Button type='submit' disabled={selectedItems.length > 0? false : true}>Submit</Button>
        </form>
        </div>
      </div>
    );
}

export default CustomerPage;