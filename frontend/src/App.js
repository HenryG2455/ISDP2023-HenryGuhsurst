import './App.css';
import{ useState } from 'react';



export default function App() {
  const [count, setCount] = useState(0);

  async function getEmps(){
    const res = await fetch('http://localhost:8000/employee');
    if (!res.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      console.log(res.json());
      return res;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      <button onClick={getEmps}> Button</button>
        <p>
          Wowzer
        </p>
        
      </header>
    </div>
  );
}
