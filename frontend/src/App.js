import React, { useEffect , useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
 
import Login from './components/Login';
import EmployeeCRUD from './components/EmployeeCRUD';
import RecordCRUD from './components/RecordCRUD';
import NewEmployeeForm from './components/CRUD_Components/AddEmployee';
import DashBoard from './components/Dashboard';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Locations from './components/Locations';
import CreateNewSite from './components/Location-comps/CreateNewSite';
import Acadia from './Acadia/Acadia';
import CustomerPage from './customer/CustomerPage';
import CustomerSearch from './customer/CustomerSearch';
import Products from './components/Products/Products';
import NewProduct from './components/Products/NewProduct';

 
function App(){
    const [user, setUser] = useState(null);
    useEffect( ()=> {
        console.log(user);
    },[user]);

    useEffect(()=>{
    let temp = localStorage.getItem("User");
        console.log(temp);
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
        <HashRouter>
          <div>
              <Navigation user={user} setUser={setUser}/>
              <div>
                <Routes>
                  <Route path="/" element={<DashBoard user={user} setUser={setUser}/>} />
                  <Route path="/acadia" element={<Acadia user={user} setUser={setUser}/>} />
                  <Route path="/products" element={<Products user={user} setUser={setUser}/>} />
                  <Route path="/products/new" element={<NewProduct user={user} setUser={setUser}/>} />
                  <Route path="/login" element={<Login setUser={setUser}/>}/>
                  <Route path="/crud" element={<EmployeeCRUD  user={user}/>} />
                  <Route path="/crudreports" element={<RecordCRUD  user={user}/>} />
                  <Route path="/addemployee" element={<NewEmployeeForm user={user}/>} />
                  <Route path="/home" element={<HomePage user={user} setUser={setUser}/>} />
                  <Route path="/locations" element={<Locations user={user} setUser={setUser}/>} />
                  <Route path="/addsite" element={<CreateNewSite user={user} setUser={setUser}/>} />
                  <Route path="/customer" element={<CustomerPage/>} />
                  <Route path="/onlinesearch" element={<CustomerSearch/>} />
              </Routes>
              </div>
          </div> 
          </HashRouter>
      );
}
export default App;