import React,{useState,useEffect} from 'react';
import EditSite from './EditSite';
import SiteDetailsTable from './SiteDetailsTable';
import  { constants } from '../../data/Constants'

const SiteDetails = ({ user, site, setSelectedOrder }) => {
  const [showInitial, setShowInitial] = useState(true);
  const [hiddenClass, setHiddenClass] = useState(' hidden');


  useEffect(() => {
    if(user){
      if(user.user_permission.find(permission => permission.permissionID === constants.EDITSITE)){
        setHiddenClass('');
      }
    }
  },[user])

  const toggleComponent = () => {
    setShowInitial(!showInitial);
  }

  return (
    <div> 
    {showInitial ? <SiteDetailsTable site={site}  setSelectedOrder={setSelectedOrder} /> : <EditSite user={user} setShowInitial={setShowInitial} site={site} setSelectedOrder={setSelectedOrder} />}
    <button className={hiddenClass} onClick={toggleComponent}>Edit Site</button>
    </div>
  );
};

export default SiteDetails;