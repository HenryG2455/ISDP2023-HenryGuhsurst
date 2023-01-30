import './App.css';
import{ useState } from 'react';



export default function Login() {
  const [user, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function getEmp(){
    const res = await fetch('http://localhost:8000/employee/'+username);
    const emp = await res.json();
    setUser(emp);
  }

  function authenticateUser(){
    console.log(user);
    
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    getEmp();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input 
          type="text" 
          value={username} 
          onChange={(event) => setUsername(event.target.value)} 
        />
      </label>
      <br />
      <label>
        Password:
        <input 
          type="password" 
          value={password} 
          onChange={(event) => setPassword(event.target.value)} 
        />
      </label>
      <br />
      <label>
        Username:
        <input 
          type="text" 
          value={username} 
          onChange={(event) => setUsername(event.target.value)} 
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
