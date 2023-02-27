import React,{useEffect, useState} from 'react'
import Table from 'react-bootstrap/Table';
import '../../../Main.css';


export default function ViewRecieveOrder({ order, wharehouseInv, setSelectedOrder }) {
    const [items, setItems] = useState([]);
    const [lessThan, setLessThan] = useState([]);
    let temp = [];

    useEffect(()=>{
        if(wharehouseInv){
            let itemIDs = [];
            order.txnitems.forEach((item) => {
                itemIDs.push(item.ItemID);
            });
            console.log()
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
            });
        }
    },[wharehouseInv])

    const itemTableColumns = ['ItemID', 'Description', 'Qty', 'Avail'];

    const turnBlue = (id) => {
        const myTable = document.getElementById('mainTable');
        const myRow = findRowByKey(myTable, id);
        myRow.style.backgroundColor = 'blue';
    }

    const findRowByKey = (table, key) => {
        // Get all the rows in the table
        const rows = table.getElementsByTagName('tr');
        
        // Iterate through the rows and look for the one with the specified key
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row.getAttribute('key') === key) {
            console.log("TRIGGERED");
            return row;
          }
        }
        // If the row isn't found, return null
        return null;
    };

    function inInventory(item,i) {
        let res = 0;
        let temp = lessThan;
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

  return (
    <div id="viewContainer">
        <div className='table-container'>
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
                <tr key={item.ItemID}>
                    <td>{item.ItemID}</td>
                    <td>{items.length < 1?  "":items[i].name}</td>
                    <td>{item.quantity}</td>
                    <td>{inInventory(item,i)}</td>
                </tr>
                )}
            </tbody>
        </Table>
        </div>
    </div>
  );
}
//wharehouseInv.find(({itemID})=>itemID === item.ItemID)
// {order.txnitems.map((item) => (
//     <li key={item.ItemID}>
//       Item ID: {item.ItemID}, Quantity: {item.quantity}
//     </li>
//   ))}