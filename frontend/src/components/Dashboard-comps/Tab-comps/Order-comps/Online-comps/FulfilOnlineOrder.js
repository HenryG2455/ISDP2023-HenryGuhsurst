import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../../Main.css';
import {constants, txnStatus, txnTypes} from '../../../../../data/Constants';
import { useNavigate } from 'react-router-dom';

export default function ViewFulfillOrder({ user,order, storeInv, globalOrders }) {
    const navigate= useNavigate();
    const [items, setItems] = useState([]);
    const [theOrder, setTheOrder] = useState(null);
    const [reformedOrder, setReformedOrder] = useState([]);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [pallet, setPallet] = useState([]);
    const [itemForBackOrder, setItemForBackOrder] = useState([]);
    const[allItemsFromOriginalOrder, setAllItemsFromOriginalOrder] = useState([]);
    let backOrders = [];
    let tempPallet = [];
    let temp = [];
    let tempOrder ={};
    

    useEffect(() => {
        if(user){
            console.log(user)
        }
    },[user])

    useEffect(() => {
        if(order){
            console.log(order);
            setTheOrder(order);
        }
    },[order]);
    //this useEffect is to get the items from the order and check if they are in the wharehouse inventory
    useEffect(()=>{
        if(storeInv){
            console.log(storeInv)
            if(theOrder !== null){
                let itemIDs = [];
                console.log(order);
                order.txnitems.forEach((item) => {
                    itemIDs.push(item.ItemID);
                });
                console.log(itemIDs)
                fetch('http://localhost:8000/item/get/orderitems', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemIDs)
                })
                .then(response => response.json())
                .then(data => {
                    setAllItemsFromOriginalOrder(data);
                    const tempNotInInvItems = order.txnitems.filter(item => {
                        const matchingItem = storeInv.find(invItem => invItem.itemID === item.ItemID);
                        if (!matchingItem || matchingItem.quantity < item.quantity) {
                        return true;
                        }
                        return false;
                    });
                    const notInInvItems = tempNotInInvItems.map(obj => {
                        const { ItemID, quantity, ...rest } = obj; // Destructure object to get old field and rest of object
                        const matchingItem = storeInv.find(invItem => invItem.itemID ===ItemID);
                        return { ItemID: ItemID, quantity: quantity-matchingItem.quantity , ...rest }; // Create new object with updated field name
                    });
                    console.log(notInInvItems);
                    
                    const newArray = data.filter(ditem => !notInInvItems.find(removeItem => removeItem.ItemID === ditem.itemID));
                    console.log(order)
                    
                    const newItems = theOrder.txnitems.filter(oitem => newArray.find(removeItem => removeItem.itemID === oitem.ItemID)); 
                    console.log(theOrder);
                    console.log(notInInvItems)
                    setItemForBackOrder(notInInvItems);
                    console.log(newItems)
                    tempOrder = theOrder;

                    //Weird bug if you dont update the property of an object this way
                    tempOrder = {
                        ...tempOrder,
                        txnitems: newItems
                    };
                    console.log(tempOrder);
                    setReformedOrder(tempOrder);
                    setItems(newArray);  
                })
            }
        }
    },[storeInv,theOrder])


    const Days = {SUNDAY:0, MONDAY:1, TUESDAY:2,WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6};

    const handleProcessOrder = () => {
        //console.log(pallet);
        //Update the transaction


        const txnUpdateOrder = {
            siteIDTo: parseInt(reformedOrder.siteIDFrom),
            siteIDFrom: parseInt(reformedOrder.siteIDTo),
            status:txnStatus.READY,
            shipDate:reformedOrder.shipDate,
            txnType:reformedOrder.txnType,
            barCode:reformedOrder.barCode,
            createdDate: reformedOrder.createdDate,
            deliveryID: reformedOrder.deliveryID,
            emergencyDelivery: reformedOrder.emergencyDelivery,
            txnitems: reformedOrder.txnitems
        }

        let tempInv = storeInv;
        console.log(storeInv)
        tempInv.forEach(invItem => {
            const matchingItem = reformedOrder.txnitems.find(item => item.ItemID === invItem.itemID);
            
            if (matchingItem) {
                invItem.quantity -= matchingItem.quantity;
            }
        })

        let updatedStoreOrder = txnUpdateOrder;




        for (let i = 0; i < updatedStoreOrder.txnitems.length; i++) {
            updatedStoreOrder.txnitems[i]['itemID'] = updatedStoreOrder.txnitems[i]['ItemID'];
            delete updatedStoreOrder.txnitems[i]['ItemID'];
        }
          
        //This is to update the inventory
        console.log(updatedStoreOrder)
        const newInv = updatedStoreOrder.txnitems.map((txnitem) => {
            const item = tempInv.find((i) => i.itemID === txnitem.itemID);
            console.log(item)
            if (item) {
              return {
                itemID: item.itemID,
                siteID: item.siteID,
                quantity: item.quantity,
                itemLocation: item.itemLocation,
                reorderThreshold: item.reorderThreshold,
              };
            }
        });
        const invCreate = updatedStoreOrder.txnitems;
        console.log(newInv)
        //console.log(invUpdateitems)
        console.log(tempInv)
        console.log(allItemsFromOriginalOrder)
        console.log(txnUpdateOrder)
        console.log(updatedStoreOrder);
        console.log(invCreate)

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //This is to create the Cubside Inventory in the database
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        invCreate.forEach((item) => {
            item.siteID = 11;
            item.itemLocation = "Cubside";
            item.reorderThreshold = 0;
            delete item.txnID;
            delete item.item;
        });
        console.log(invCreate)
        
        // This is to update the order with the items and set to ready
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        let txnAudit = {
            txnID:reformedOrder.txnID,
            txnType: "removeInv",
            status: "Success",
            SiteID: user.siteID,
            deliveryID: reformedOrder.deliveryID,
            employeeID: user.employeeID,
            notes: user.username+' updated txn',
          };
          fetch('http://localhost:8000/txnaudit/new', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(txnAudit)
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
        fetch('http://localhost:8000/txn/storeOrder/update/'+reformedOrder.txnID, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({txn: txnUpdateOrder, removedItems: itemForBackOrder})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
                /*
                These Fetches are a series of updates to teh database mostly around updateing the inventory count for
                warehouse after teh items have been gathered and added to the Stoer order.
                
                As the inventory is being update we crete a new inventory for 


                    
                */
                //This is to update the inventory
                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                let txnAudit2 = {
                    txnID:0,
                    txnType: "InvUpdate",
                    status: "Success",
                    SiteID: user.siteID,
                    deliveryID: 0,
                    employeeID: user.employeeID,
                    notes: user.username+' updated inventory',
                  };
                  fetch('http://localhost:8000/txnaudit/new', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(txnAudit2)
                  })
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                  })
                fetch('http://localhost:8000/inventory/update/'+11, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({updateInventoryDto: newInv, createInventoryDto: invCreate })
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
                    console.error('There has been a problem with your fetch operation:', error);
                });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    const itemTableColumns = ['ItemID', 'Description', 'Qty', 'Avail','Added?'];

    //this function is used to check if the item is in the inventory
    function inInventory(item,i) {
        let res = 0;
        storeInv.forEach((invItem) => {
            if (invItem.itemID === item.ItemID) {
                res = invItem.quantity;
                if (invItem.quantity < item.quantity) {   
                    temp.push(item.ItemID)
                } 
            }else{
                temp.push(item.ItemID)     
            }
        });
        return res;
    }

    //this fucntion is used to handle the checkbox change to make sure all 
    //are pressed before the fulfil button is enabled
    const handleCheckboxChange = (e) => {
        const itemId = parseInt(e.target.value);
        const isChecked = e.target.checked;
    
        if (isChecked) {
          setCheckedItems(new Set([...checkedItems, itemId]));
        } else {
          checkedItems.delete(itemId);
          setCheckedItems(new Set(checkedItems));
        }
        setIsButtonDisabled(checkedItems.size !== reformedOrder.txnitems.length -1);
    };

  return (
    <div id="viewContainer">
        <div className='table-itemcontainer'>
        <Table id='mainTable' className=' table-container' striped bordered hover>
            <thead>
                <tr>
                {itemTableColumns.map(column =>
                    <th key={column}>{column}</th>
                )}
                </tr>
            </thead>
            <tbody>
                {reformedOrder.length<1? <tr><td colSpan={5}>Loading!</td></tr>: 
                    reformedOrder.txnitems.map((item,i) =>
                        <tr  key={item.ItemID}>
                            <td>{item.ItemID}</td>
                            <td>{items.length < 1?  "":items[i].name}</td>
                            <td>{item.quantity}</td>
                            <td>{inInventory(item,i)}</td>
                            <td><input type='checkbox' id={item.ItemID} value ={item.ItemID} onChange={handleCheckboxChange} ></input></td>
                        </tr>
                        )
                }
            </tbody>
        </Table>
        <button disabled={isButtonDisabled} onClick={handleProcessOrder}>Fulfill Order</button>
        </div>
    </div>
  );
};
