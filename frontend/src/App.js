import React, { useEffect , useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
 
import Login from './components/Login';
import EmployeeCRUD from './components/EmployeeCRUD';
import NewEmployeeForm from './components/CRUD_Components/AddEmployee';
import DashBoard from './components/Dashboard';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Locations from './components/Locations';
import CreateNewSite from './components/Location-comps/CreateNewSite';
import Acadia from './Acadia/Acadia';
import CustomerPage from './customer/CustomerPage';
import CustomerSearch from './customer/CustomerSearch';
 
function App(){
    const [user, setUser] = useState(null);
    useEffect( ()=> {
        console.log(user);
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

      return (      
          <BrowserRouter>
          <div>
              <Navigation user={user} setUser={setUser}/>
              <Routes>
                  <Route index element={<DashBoard user={user} setUser={setUser}/>} />
                  <Route path="/acadia" element={<Acadia user={user} setUser={setUser}/>} />
                  <Route path="/login" element={<Login setUser={setUser}/>}  exact/>
                  <Route path="/crud" element={<EmployeeCRUD  user={user}/>} exact/>
                  <Route path="/addemployee" element={<NewEmployeeForm/>} exact/>
                  <Route path="/home" element={<HomePage user={user} setUser={setUser}/>} exact/>
                  <Route path="/locations" element={<Locations user={user} setUser={setUser}/>} exact/>
                  <Route path="/addsite" element={<CreateNewSite user={user} setUser={setUser}/>} exact/>
                  <Route path="/customer" element={<CustomerPage/>} />
                  <Route path="/onlinesearch" element={<CustomerSearch/>} />
              </Routes>
          </div> 
          </BrowserRouter>
      );
}
export default App;