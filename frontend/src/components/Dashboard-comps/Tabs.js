import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Orders from './Tab-comps/Orders';
import Inventory from './Tab-comps/Inventory';


function NavTabs({tempUser}) {
    const [key, setKey] = useState('orders');
    const [curUser, setCurUser] = useState(null);
    useEffect(()=>{
        //console.log(tempUser);
    },[curUser])

    useEffect(() => {
        checkUser();
    });
  
    function checkUser(){
        //console.log(user)
        let temp = localStorage.getItem("User");
        //console.log(temp);
        if(temp == null){

        }else{
            setCurUser(tempUser);
        }
    }
    
    return (
        <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        >
        <Tab eventKey="orders" title="Orders">
            <Orders user ={curUser}/>
        </Tab>
        <Tab eventKey="inventory" title="Inventory">
            <Inventory user ={curUser}/>
        </Tab>
        <Tab eventKey="loss/returns" title="Loss/Returns">

        </Tab>
        <Tab eventKey="reports" title="Reports">

        </Tab>
        </Tabs>
    );
}

export default NavTabs;