import React, { useEffect , useState} from 'react';
import './Main.css';
 
import { NavLink, useNavigate} from 'react-router-dom';
 
export default function Navigation({ user, setUser }) {
    const navigate = useNavigate();
    const [tempUser, setTempUser] = useState(null);
    const [crudName, setCrudName] = useState('');
    const [className2, setClassName2] = useState('');
    const  [loggedOut, setLoggedOut] = useState(true);

    useEffect(() => {
        // Check For User
        //console.log(user);
        authUser();
    });

      
    function authUser(){
        //console.log(user);
        if(user == null){
            setCrudName(' hidden');
            
        }else{
            let tempUser = localStorage.getItem("User");
            //console.log(temp);
            if(tempUser == null){
                setLoggedOut(true);
            }else{setLoggedOut(false);}
            
            setCrudName('');
            setClassName2('');
            let crud =[];
            if(user.user_permission.length>0){
                user.user_permission.forEach(ele => {
                    //console.log(ele.permissionID);
                    if(ele.permissionID === 'ADDUSER' || ele.permissionID === 'DELETEUSER' || ele.permissionID === 'EDITUSER'){
                        crud.push(ele.permissionID);
                    }
                });
            }
            //console.log(crud);
            if(crud.length < 3){
                setCrudName(' hidden');
            }
            if(user.siteID === 9999){
                setLoggedOut(true);
            }
        }
    }
    function Logout(){
        localStorage.removeItem("User");
        setUser(null);
        setCrudName(' hidden');
        navigate("/login");
    }
    return (
       <div className= 'navbar'>
          <NavLink className= {loggedOut? ' hidden ':""+' navlink'} to="/">Dashboard</NavLink>
          <NavLink className= {loggedOut? ' hidden ':""+' navlink'} to="/home">HomePage</NavLink>
          <NavLink className= {loggedOut? ' hidden ':""+' navlink'} to="/locations">Site Locations</NavLink>
          <NavLink id='crud' className={crudName+' navlink'} to="/crud">Employee CRUD</NavLink>
          <a id='logout' className={className2} onClick={Logout}>Logout</a>
       </div>
    );
}
 
