import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../../Main.css';
import {constants, txnStatus, txnTypes} from '../../../../../data/Constants';
import { useNavigate } from 'react-router-dom';

export default function ViewFulfillOrder({ user,order, wharehouseInv, globalOrders }) {
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
        if(wharehouseInv){
            console.log(wharehouseInv)
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
                        const matchingItem = wharehouseInv.find(invItem => invItem.itemID === item.ItemID);
                        if (!matchingItem || matchingItem.quantity < item.quantity) {
                        return true;
                        }
                        return false;
                    });
                    const notInInvItems = tempNotInInvItems.map(obj => {
                        const { ItemID, ...rest } = obj; // Destructure object to get old field and rest of object
                        return { ItemID: ItemID, ...rest }; // Create new object with updated field name
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
    },[wharehouseInv,theOrder])

    function getNextDateByDayOfWeek(currentDate, dayOfWeek) {
        const date = new Date(currentDate);
        const targetDayOfWeek = dayOfWeek % 7;
        const daysToAdd = targetDayOfWeek - date.getDay() + (targetDayOfWeek <= date.getDay() ? 7 : 0);
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
    const Days = {SUNDAY:0, MONDAY:1, TUESDAY:2,WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6};

    const handleProcessOrder = () => {
        let backOrder;
        let updatedInventory;
        let updatedOrder;
        //console.log(pallet);
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const siteDeliveryDay = Days[user.site.dayOfWeek];
        const deliveryDate = getNextDateByDayOfWeek(currentDate, siteDeliveryDay);
        //console.log(deliveryDate);
        const barcode = Math.random().toString(36).substring(2, 12);

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
        //Check if Backorder already exists
        let backOrderExists = false;
        let tempBackOrder;
        globalOrders.forEach(gorder => {
            if(gorder.txnType === txnTypes.BACK_ORDER && gorder.siteIDTo === reformedOrder.siteIDFrom){
                if(gorder.txnStatus !== txnStatus.CLOSED){
                    backOrderExists = true;
                    tempBackOrder = gorder;
                }
            }
        });
        console.log(backOrderExists);
        let txnBackOrder={};
        if(backOrderExists){
            //Add to pre-exisiting back order
            const tempupdatetxnBackOrder = {
                siteIDTo: parseInt(tempBackOrder.siteIDFrom),
                siteIDFrom: parseInt(tempBackOrder.siteIDTo),
                status:txnStatus.READY,
                shipDate:tempBackOrder.shipDate,
                txnType:tempBackOrder.txnType,
                barCode:tempBackOrder.barCode,
                createdDate: tempBackOrder.createdDate,
                deliveryID: tempBackOrder.deliveryID,
                emergencyDelivery: tempBackOrder.emergencyDelivery,
                txnitems: tempBackOrder.txnitems
            }
            txnBackOrder = tempupdatetxnBackOrder;
        }else{
            //Create the back order
            const tempCreatetxnBackOrder = {
                siteIDTo: parseInt(reformedOrder.siteIDFrom),
                siteIDFrom: parseInt(reformedOrder.siteIDTo),
                status:txnStatus.BACKORDER,
                shipDate:deliveryDate,
                txnType:txnTypes.BACK_ORDER,
                barCode:barcode,
                createdDate: currentDate,
                deliveryID: 1,
                emergencyDelivery: reformedOrder.emergencyDelivery,
                txnitems: itemForBackOrder
            }
            txnBackOrder = tempCreatetxnBackOrder;
        }
        let tempInv = wharehouseInv;
        console.log(wharehouseInv)
        tempInv.forEach(invItem => {
            const matchingItem = reformedOrder.txnitems.find(item => item.ItemID === invItem.itemID);
            if (matchingItem) {
                invItem.quantity -= matchingItem.quantity;
            }
        })

        let invUpdateitems=[]
        tempInv.forEach(inv2Item => {
            const matchingItem = wharehouseInv.find(item => item.ItemID === inv2Item.ItemID);
            if (matchingItem) {
                if(inv2Item.quantity === matchingItem.quantity){
                    console.log(inv2Item)
                    invUpdateitems.push(inv2Item);
                }
            }
        });

        //This is to update the inventory
        console.log(invUpdateitems)
        console.log(tempInv)
        console.log(txnBackOrder)
        console.log(txnUpdateOrder)
        console.log(allItemsFromOriginalOrder)
        console.log(itemForBackOrder.length);

        //This is to update the store order with the items and set to ready
                //
                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
            
                //This is to update the inventory
                //
                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                fetch('http://localhost:8000/inventory/update/'+2, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({updateInventoryDto: invUpdateitems})
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    console.log(itemForBackOrder.length);
                    //Creates back Order
                    if(itemForBackOrder.length>0){
                        let URL = 'http://localhost:8000/txn/';
                        if(backOrderExists){
                            URL += 'backOrder/update/'+reformedOrder.txnID;
                        }else{
                            URL += 'backOrder/new';
                        }
                        console.log(URL)
                        //This is to update the back order
                        
                        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        fetch(URL, {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({txn: txnBackOrder, txnItems: itemForBackOrder})
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
                    }else{
                        window.location.reload();
                    }
                    
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
                
                

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });


        //this 
        

        




    };

    const itemTableColumns = ['ItemID', 'Description', 'Qty', 'Avail','Added?'];

    //this function is used to check if the item is in the inventory
    function inInventory(item,i) {
        let res = 0;
        wharehouseInv.forEach((invItem) => {
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
