import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../../Main.css';
import {constants, txnStatus, txnTypes} from '../../../../../data/Constants';
import { useNavigate } from 'react-router-dom';

export default function AcceptDelivery({ user,order, wharehouseInv, globalOrders }) {
    const navigate= useNavigate();
    const [theOrder, setTheOrder] = useState(null);
    const [reformedOrder, setReformedOrder] = useState([]);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [pallet, setPallet] = useState([]);
    const [itemForBackOrder, setItemForBackOrder] = useState([]);

    

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
    
    const addTxnAudit = (audit) => {
        //This is to update the store order with the items and set to ready
        
          fetch('http://localhost:8000/txnaudit/new', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(audit)
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
    }
    const handleProcessOrder = () => {
        //This is to update the store order with the items and set to ready
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        let txnAudit = {
            txnID:order.txnID,
            txnType: "TxnUpdate",
            status: "Success",
            SiteID: user.siteID,
            deliveryID: order.deliveryID,
            employeeID: user.employeeID,
            notes: user.username+' updated txn',
          };
          addTxnAudit(txnAudit);
        fetch('http://localhost:8000/txn/storeOrder/close/'+order.txnID, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
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
                These Fetches are a series of updates to the database mostly around updateing the inventory count for
                As the inventory is being update we crete a new inventory for    
                */
                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                console.log(order.txnitems)
                txnAudit = {
                    txnID:order.txnID,
                    txnType: "invUpdate",
                    status: "Success",
                    SiteID: user.siteID,
                    deliveryID: order.deliveryID,
                    employeeID: user.employeeID,
                    notes: user.username+' updated inventory',
                  };
                  addTxnAudit(txnAudit);
                fetch('http://localhost:8000/inventory/deliver/'+user.siteID, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( order.txnitems )
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


        //this 
    };

    const itemTableColumns = ['ItemID', 'Name', 'Qty', 'Sku',''];


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
        setIsButtonDisabled(checkedItems.size !== order.txnitems.length -1);
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
                {order.length<1? <tr><td colSpan={5}>Loading!</td></tr>: 
                    order.txnitems.map((item,i) =>
                        <tr  key={item.ItemID}>
                            <td>{item.ItemID}</td>
                            <td>{item.item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.item.sku}</td>
                            <td><input type='checkbox' id={item.ItemID} value ={item.ItemID} onChange={handleCheckboxChange} ></input></td>
                        </tr>
                        )
                }
            </tbody>
        </Table>
        <button disabled={isButtonDisabled} onClick={handleProcessOrder}>Add to Inventory</button>
        </div>
    </div>
  );
};
