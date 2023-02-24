import React, { useEffect, useState } from 'react';
import './Main.css';
import { useNavigate} from 'react-router-dom';
import NavTabs from './Dashboard-comps/Tabs'

let res;

export default function HomePage({user}) {
    const navigate = useNavigate();
    const [tempUser, setUser] = useState(null);

    // useEffect( ()=> {
    //   //console.log(tempUser);
    // },[tempUser]);

    // useEffect(() => {
    //   checkUser();
    // });

    // function checkUser(){
    //   //console.log(user)
    //   let temp = localStorage.getItem("User");
    //   //console.log(temp);
    //   if(temp == null){
    //     navigate("/login");
    //   }else{
    //     setUser(user);
    //   }
    // }
    
  return (
    <div id='pageContainer'>
        <div id='headingContainer'>
            <span>
            HomePage - Hello {tempUser != null ? tempUser.firstName || res() : ''}
            </span>
            <span id='location'>
            Location - {tempUser != null? tempUser.site.address || res() : ''}
            </span>
        </div>
    </div>
  )
}
