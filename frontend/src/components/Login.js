import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useNavigate} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

const salt = bcrypt.genSaltSync(11);
let res;

export default function Login({user, setUser}) {
  //console.log(setUser);
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function getEmp(){
    try {
      res = await fetch('http://localhost:8000/employee/'+username);
    } catch (error) {
      // TypeError: Failed to fetch
      console.log('There was an error', error);
    }
    if (!res.ok) {
      setErrorText("Username or Password is Wrong");
    }else{
      const emp = await res.json();
      console.log(emp)
      authenticateUser(emp);
    }
    
  }

  const authenticateUser = (emp) =>{
    const hashedPassword = bcrypt.hashSync(emp.password, salt);
    console.log();
    //console.log(temphashedPassword);
    if(bcrypt.compareSync(password, hashedPassword)){
      delete emp.password;
      localStorage.setItem("User",JSON.stringify(emp));
      setUser(emp);
      console.log(emp)
      if(emp.siteID === 9999){
        navigate('/acadia');
      }else{
        navigate('/');
      }
    }else{
      setErrorText("Password is Wrong");
    }
    //console.log(user);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getEmp();
  }
  
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <Card.Title>Login Page</Card.Title>
          <Card.Text>
          <label>
          Username:
          <input 
            type="text" 
            onChange={(event) => setUsername(event.target.value)}
            required 
          />
          
          </label>
          <br />
          <label>
            Password:
            <input 
              type="password" 
              onChange={(event) => setPassword(event.target.value)} 
              required
            />
          </label>
          <br />
          <span>{errorText}</span><br/>
          </Card.Text>
          <Button type="submit" variant='primary'>Login</Button>
        </form>
      </Card.Body>
    </Card>
  );
}
