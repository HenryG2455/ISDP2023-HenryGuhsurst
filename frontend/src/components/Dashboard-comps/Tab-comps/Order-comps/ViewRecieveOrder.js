import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../Main.css';


export default function ViewRecieveOrder({ order, wharehouseInv, setSelectedOrder,setAllOrders,allOrders }) {
    const [items, setItems] = useState([]);
    const [lessThan, setLessThan] = useState([]);
    let temp = [];

    useEffect(()=>{
        if(wharehouseInv){
            let itemIDs = [];
            order.txnitems.forEach((item) => {
                itemIDs.push(item.ItemID);
            });
            fetch('http://localhost:8000/item/get/orderitems', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemIDs)
            })
            .then(response => response.json())
            .then(data => {
                setItems(data); 
                console.log(data);
            })
        }
    },[wharehouseInv])

    const itemTableColumns = ['ItemID', 'Description', 'Qty', 'Avail'];

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

    const  turnBlue=(item)=>{
        let res='';
        wharehouseInv.forEach((invItem) => {
            if (invItem.itemID === item.ItemID) {
                if (invItem.quantity < item.quantity) {
                    res = ' blue ';
                } 
            }else if(wharehouseInv.find((invItem2)=>invItem2.itemID === item.ItemID) === undefined){
                res = ' blue ';
            }
        });
        return res;
    }

    const handleProcessOrder = () => {
        setSelectedOrder('');
        fetch('http://localhost:8000/txn/process/order/'+order.txnID, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
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
                {order.txnitems.map((item,i) =>
                <tr className={turnBlue(item)} key={item.ItemID}>
                    <td>{item.ItemID}</td>
                    <td>{items.length < 1?  "":items[i].name}</td>
                    <td>{item.quantity}</td>
                    <td>{inInventory(item,i)}</td>
                </tr>
                )}
            </tbody>
        </Table>
        <button onClick={handleProcessOrder}>ProcessOrder</button>
        </div>
    </div>
  );
}
