import React, { useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
 
import Login from './components/Login';
import EmployeeCRUD from './components/EmployeeCRUD';
import NewEmployeeForm from './components/subComponents/AddEmployee';
import DashBoard from './components/Dashboard';
import Navigation from './components/Navigation';
 
function App(){
    //const navigate = useNavigate();
    useEffect(() => {
        // Update the document title using the browser API
        checkUser();
      });
    function checkUser(){
        let temp = localStorage.getItem("User");
        //console.log(temp);
        if(temp == null){
            //navigate("/login");
        }
    }

        return (      
            <BrowserRouter>
            <div>
                <Navigation />
                <Routes>
                    <Route index element={<DashBoard/>} />
                    <Route path="/login" element={<Login/>} exact/>
                    <Route path="/crud" element={<EmployeeCRUD/>} exact/>
                    <Route path="/addemployee" element={<NewEmployeeForm/>} exact/>
                </Routes>
            </div> 
            </BrowserRouter>
        );

}
export default App;