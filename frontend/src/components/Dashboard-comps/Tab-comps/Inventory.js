import React, { useState, useEffect} from 'react';
import { constants,txnStatus} from '../../../data/Constants'
import '../../Main.css';
import Table from 'react-bootstrap/Table';
import InventoryEditPage from './Inventory-comps/InventoryEditPage';
import InvItemDetails from './Inventory-comps/InvItemDetails';




function Inventory({user}) {
    const [inventory, setInventory] = useState([]);
    const [selectedSite, setSelectedSite] = useState('all');
    const [sites, setSites] = useState([]);
    const [curUser, setCurUser] = useState(null);
    const [locations, setLocations] = useState([]);
    const [itemsThatNeedInfo, setItemsThatNeedInfo] = useState([]);
    const [items, setItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [editButtonHidden, setEditButtonHidden] = useState(' hidden');
    const [showEditForm, setShowEditForm] = useState(false);
    const [invForEdit, setInvForEdit] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedItem, setSelectedItem] = useState({});



    const handleView = (item) => {
        console.log(item);
        setSelectedItem(item);
    };

    const handleRowClick = (id) => {
        setSelectedRow(id);
      };
    let tempItemsThatNeedInfo = [];
    useEffect(() => {
        if(user){
            setSelectedSite(user.siteID)
            console.log(user)
            userPermissions(user,user.siteID)
            
        }
    },[user])

  useEffect(() => {
    fetch('http://localhost:8000/inventory')
    .then(response => response.json())
    .then(data => {
    console.log(data);
    let tempData = data
    tempData.forEach(item => {
        tempItemsThatNeedInfo.push(item.itemID)
    });
    console.log(tempItemsThatNeedInfo);
        fetch('http://localhost:8000/item/get/orderitems', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempItemsThatNeedInfo)
        })
        .then(response => response.json())
        .then(data => {
            setItems(data);
        })
        
    
    setInventory(tempData);
    });
  }, []);

  useEffect(() => {
    if(user){
        setCurUser(user);
        fetch('http://localhost:8000/site')
        .then(response => response.json())
        .then(data => {
          setSites(data);
          siteLocations(data);
          console.log(data);
        });
    }
  },[user]);

  const userPermissions = (user,siteID) => {
    user.user_permission.forEach(permission => {
        if(permission.permissionID === constants.EDITINVENTORY){
            setEditButtonHidden('');
            onRightSite(user,siteID)
        }
    })
  }

    const onRightSite = (user,siteID) => {
        console.log(user)
        let tempSite =parseInt(siteID)
        console.log(tempSite)
        if(user === null){
            console.log('curUser is null')
            setEditButtonHidden(' hidden');
        }else if(user.siteID === tempSite){
            console.log('curUser matches selected site')
            setEditButtonHidden('');
        }else if(user.siteID !== tempSite){
            console.log('curUser DOES NOT match selected site')
            setEditButtonHidden(' hidden');

        }
    }

    const handleSiteChange = (event) => {
        setShowEditForm(false)
        setSelectedRow(null);
        setSelectedItem({});
        if(event.target.value !== 'all'){
            setSelectedSite(parseInt(event.target.value));
        }else{
            setSelectedSite(event.target.value);   
        }
        onRightSite(curUser,event.target.value);
    };

  const filteredInventory = selectedSite === 'all'
    ? inventory
    : inventory.filter(item => item.siteID === selectedSite);

    const siteLocations = (sites) => {
        setLocations(sites.map(site => (
            <option key={site.siteID} value={site.siteID}>
                {site.name}
            </option>
        )))
    };

    const findName = (item) => {
        //console.log(item);
        let temp = items.find(i =>item.itemID  === i.itemID)
        return temp.name;
    }

    const findSku = (item) => {
        //console.log(item);
        let temp = items.find(i =>item.itemID  === i.itemID)
        return temp.sku;
    }

    const handleSearch = (event) => {
        const text = event.target.value.toLowerCase();
        const filtered = items.filter(item =>
          item.name.toLowerCase().includes(text) ||
          item.description.toLowerCase().includes(text) ||
          item.category.toLowerCase().includes(text)
        );
        setSearchText(text);
        setInventory(filtered);
    }

    function editInventoryForSite() {
        console.log(selectedSite)
        setShowEditForm(true);
        let siteInvEdit = inventory.filter(item => item.siteID === selectedSite);
        setInvForEdit(siteInvEdit);
        console.log(siteInvEdit);
    }


  return (
    <div>
      <h2>Inventory List</h2>
      <input type="text" placeholder="Search items" value={searchText} onChange={handleSearch} />
      <label htmlFor="site-select">Select Site:</label>
      <select id="site-select" value={selectedSite} onChange={handleSiteChange} >
        <option value="all">All Sites</option>
        {locations} 
      </select>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>
        {items.length<1? <tr><td colSpan={5}>Loading!</td></tr>:       
          filteredInventory.map(item => (
            <React.Fragment key={item.itemID}>
                <tr key={item.itemID} onClick={() => handleRowClick(item.itemID)} className={selectedRow === item.itemID ? " selected" : ""}>
                    <td>{item.itemID}</td>
                    <td>{findName(item)}</td>
                    <td>{item.quantity}</td>
                    <td>{findSku(item)}</td>
                    <td>
                        <button disabled={selectedRow !== item.itemID} onClick={() => handleView(item)}>Move</button>
                    </td>
                </tr>
                {selectedItem.itemID === item.itemID && (
                    <tr>
                        <td colSpan="6">
                            <InvItemDetails setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
                        </td>
                    </tr>
                )}
            </React.Fragment>
          ))
        }
        </tbody>
      </Table>
      <button onClick={editInventoryForSite} className={editButtonHidden}>Edit Inventory</button>
      {showEditForm? <InventoryEditPage user={curUser}  invForEdit={invForEdit}/>: <div></div>}      
    </div>
  );
}

export default Inventory