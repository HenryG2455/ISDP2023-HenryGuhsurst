import React, { useEffect , useState} from 'react';
import './Main.css';
 
import { NavLink, useNavigate} from 'react-router-dom';
 
export default function Navigation() {
    const navigate = useNavigate();
    const [className1, setClassName1] = useState('');
    
    useEffect(() => {
        // Check For User
        checkUser();
      });

    function checkUser(){
        let temp = localStorage.getItem("User");
        //console.log(JSON.parse(temp));
        if(temp == null){
            setClassName1(' hidden');
        }else{
            let crud =[];
            let user = JSON.parse(temp);
            if(user.user_permission.length>0){
                user.user_permission.forEach(ele => {
                    //console.log(ele.permissionID);
                    if(ele.permissionID === 'ADDUSER' || ele.permissionID === 'DELETEUSER' || ele.permissionID === 'EDITUSER'){
                        crud.push(ele.permissionID);
                    }
                });
            }
            console.log(crud);
            if(crud.length < 3){
                setClassName1(' hidden');
            }
        }
    }
    function Logout(){
        localStorage.removeItem("User");
        navigate("/login");
    }
    return (
       <div className= 'navbar'>
          <NavLink className= 'navlink' to="/">Home</NavLink>
          <NavLink id='crud' className={className1+' navlink'} to="/crud">Employee CRUD</NavLink>
          <a id='logout' className={className1} onClick={Logout}>Logout</a>
       </div>
    );
}
 
