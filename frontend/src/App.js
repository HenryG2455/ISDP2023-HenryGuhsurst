import React, { useEffect , useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
 
import Login from './components/Login';
import EmployeeCRUD from './components/EmployeeCRUD';
import NewEmployeeForm from './components/CRUD_Components/AddEmployee';
import DashBoard from './components/Dashboard';
import Navigation from './components/Navigation';
 
function App(){
    const [user, setUser] = useState(null);
    //const navigate = useNavigate();
    useEffect( ()=> {
        console.log(user);
        // let temp = localStorage.getItem("User");
        // setUser(JSON.parse(temp));
        // //console.log(temp);
        // if(temp == null){
        //     //navigate("/login");
        // }else if(user == null){
        //     console.log(JSON.parse(temp))
            
        // }
      },[user]);

      useEffect(()=>{
        let temp = localStorage.getItem("User");

        //console.log(temp);
        if(temp == null){
            //navigate("/login");
        }else if(user == null){
            console.log(JSON.parse(temp));
            setUser(JSON.parse(temp));
        }
      },[])
      const setEmployee = (emp) =>{
        setUser(emp);
      }
    // function checkUser(){
    //     let temp = localStorage.getItem("User");
    //     //console.log(temp);
    //     if(temp == null){
    //         //navigate("/login");
    //     }else{
    //         console.log(JSON.parse(temp))
    //         setUser(JSON.parse(temp));
    //     }
    // }

        return (      
            <BrowserRouter>
            <div>
                <Navigation user={user} setUser={setUser}/>
                <Routes>
                    <Route index element={<DashBoard user={user} setUser={setUser}/>} />
                    <Route path="/login" element={<Login setUser={setUser}/>}  exact/>
                    <Route path="/crud" element={<EmployeeCRUD/>} exact/>
                    <Route path="/addemployee" element={<NewEmployeeForm/>} exact/>
                </Routes>
            </div> 
            </BrowserRouter>
        );

}
export default App;