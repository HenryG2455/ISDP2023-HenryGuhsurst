import React, { useState, useEffect} from 'react';
import { constants,txnStatus,txnTypes } from'../data/Constants';
import Table from 'react-bootstrap/Table';
import './Main.css';
import SiteDetails from './Location-comps/SiteDetails';
import { useNavigate} from 'react-router-dom';

function Locations({user, setUser}) {
  const navigate = useNavigate();
  const hidden =  ' hidden';
  const [curUser, setCurUser] = useState(null)
  const [showClass, setShowClass] = useState(hidden);
  const [sites, setSites] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState({});
  
  const handleView = (order) => {
    console.log(order);
    setSelectedOrder(order);
  };
  const newSite = () => {
    navigate('/addsite');
  };
  const handleRowClick = (id) => {
    setSelectedRow(id);
  };
  useEffect(()=>{
    console.log(curUser);
  },[curUser])
  useEffect(() => {
    if(user){
      setCurUser(user);
      fetch('http://localhost:8000/site')
      .then(response => response.json())
      .then(data => {
        setSites(data);
        if(user.user_permission.find(permission => permission.permissionID === constants.ADDSITE)){
          setShowClass('');
        }
      });
    }
  },[user]);
  return (
    <div>
      <h2>Site Locations</h2>
      <div id='tableContainer'>
        <Table striped bordered hover>
          <thead>
            <tr>  
              <th>Name</th>
              <th>Address</th>
              <th>Site Type</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <React.Fragment key={site.siteID}>
              <tr key={site.siteID} onClick={() => handleRowClick(site.siteID)} className={selectedRow === site.siteID ? " selected" : ""}>
                <td>{site.name}</td>
                <td>{site.address+", "+site.city+", "+site.provinceID+" "+site.postalCode}</td>
                <td>{site.siteType}</td>
                <td>{site.active ? 'Yes' : 'No'}</td>
                <td>
                  <button disabled={selectedRow !==site.siteID} onClick={() => handleView(site)}>View</button>
                </td>
              </tr>
              {selectedOrder.siteID === site.siteID && (
                <tr>
                  <td colSpan="5">
                    <SiteDetails user={user} setSelectedOrder={setSelectedOrder} site={selectedOrder} />
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        </div>
        <div>
        <button className={showClass} onClick={newSite}>Add New Site</button>
        </div>
    </div>
  );
}
// disabled={user.user_permission.find(permission => permission.permissionID === constants.ADDSITE)? false : true}
export default Locations