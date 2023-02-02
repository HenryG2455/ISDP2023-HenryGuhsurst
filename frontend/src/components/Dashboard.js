import React, { useEffect, useState } from 'react';
import './Main.css';
import { useNavigate} from 'react-router-dom';

let res;

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    useEffect(() => {
        // Update the document title using the browser API
        checkUser();
      },[]);
    function checkUser(){
        let temp = localStorage.getItem("User");
        //console.log(temp);
        if(temp == null){
          navigate("/login");
        }else{
          setUser(JSON.parse(temp));
          
        }
    }
    
  return (
    <div>
      Dashboard - Hello {user.firstName}
    </div>
  )
}
