import React, { useEffect , useState} from 'react';
import './Main.css';
 
import { NavLink, useNavigate} from 'react-router-dom';
 
export default function Navigation({ user, setUser }) {
    const navigate = useNavigate();
    const [tempUser, setTempUser] = useState(null);
    const [crudName, setCrudName] = useState('');
    const [className2, setClassName2] = useState('');
    const [loggedOut, setLoggedOut] = useState(true);
    const [hideLogout, setHideLogout] = useState('');
    const [hideLogin, setHideLogin] = useState('');

    useEffect(() => {
        // Check For User
        //console.log(user);
        if(window.location.href ==="http://localhost:3000/login"){
            setHideLogout(' hidden');
        }else{
            setHideLogout('');
        }

        if(hideLogout === ''){
            setHideLogin(' hidden');
        }else{
            setHideLogin('');
        }
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
        setLoggedOut(true);
        setCrudName(' hidden');
        navigate("/login");
    }
    return (
       <div className= 'navbar'>
          <NavLink className= {loggedOut? ' hidden ':""+' navlink'} to="/">Dashboard</NavLink>
          <NavLink className= {loggedOut? ' hidden ':""+' navlink'} to="/home">HomePage</NavLink>
          <NavLink className= {loggedOut? ' hidden ':""+' navlink'} to="/locations">Site Locations</NavLink>
          <NavLink id='crud' className={crudName+' navlink'} to="/crud">Employee CRUD</NavLink>
          <a id='login' className={hideLogin} onClick={Logout}>Login</a>
          <a id='logout' className={hideLogout} onClick={Logout}>Logout</a>
          
       </div>
    );
}
 
