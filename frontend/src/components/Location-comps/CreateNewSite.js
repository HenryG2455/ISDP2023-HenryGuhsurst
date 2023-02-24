import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import {constants, txnStatus, txnTypes} from '../../data/Constants';
import { Button } from 'react-bootstrap';


function AddSitePage({user, setUser}) {
  const navigate = useNavigate();
  const [site, setSite] = useState({
    active: true,
    address: '',
    address2: '',
    city: '',
    country: '',
    dayOfWeek: '',
    distanceFromWH: 0,
    name: '',
    notes: null,
    phone: '',
    postalCode: '',
    provinceID: '',
    siteID: 0,
    siteType: '',
  });
  const [provinces, setProvinces] = useState([]);
  const [siteTypes, setSiteTypes] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/province')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setProvinces(data);
    });
    fetch('http://localhost:8000/sitetype')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setSiteTypes(data);
    });
  },[]);

  useEffect(() => {
    if(user){
        if(user.user_permission.find(permission => permission.permissionID === constants.ADDSITE))
        {}else{
            navigate('/locations');
        }
    }
  },[user])
  function handleInputChange(event) {
    const { name, value } = event.target;
    setSite(prevSite => ({
      ...prevSite,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:8000/site/add/site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(site),
    })
      .then(response => response.json())
      .then(data => {console.log(data); navigate('/locations') })
      .catch(error => console.error(error));
  }

  return (
    <div>
      <h1>Add Site</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" value={site.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input type="text" name="address" id="address" value={site.address} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="address2">Address2:</label>
          <input type="text" name="address2" id="address2" value={site.address2} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input type="text" name="city" id="city" value={site.city} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="provinceID">Province ID:</label>
          <select name="provinceID" value={site.provinceID} onChange={handleInputChange} required>
            <option value="">--Select--</option>
            {provinces.map((province) => (
              <option key={province.provinceID} value={province.provinceID}>
                {province.provinceName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code:</label>
          <input type="text" name="postalCode" id="postalCode" value={site.postalCode} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input type="text" name="country" id="country" value={site.country} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input type="text" name="phone" id="phone" value={site.phone} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="dayOfWeek">Day of Week:</label>
            <select name="dayOfWeek" value={site.dayOfWeek} onChange={handleInputChange} required>
                <option value="">--Select--</option>
                <option value="SUNDAY">Sunday</option>
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
            </select>
        </div>
        <div>
          <label htmlFor="siteType">Site Type:</label>
          <select name="siteType" value={site.siteType} onChange={handleInputChange} required>
            <option value="">--Select--</option>
            {siteTypes.map((siteType) => (
              <option key={siteType.siteType} value={siteType.siteType}>
                {siteType.siteType}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="distanceFromWH">Distance From Warehouse:</label>
          <input type="number" name="distanceFromWH" id="distanceFromWH" value={site.distanceFromWH} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <input type="text" name="notes" id="notes" value={site.notes} onChange={handleInputChange} />
        </div>
        <button type="submit">Add Site</button>
      </form>
    </div>
    );}

    export default AddSitePage;
