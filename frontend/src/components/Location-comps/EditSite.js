import React,{ useState, useEffect } from 'react'


function EditSite({ site, setShowInitial, setSelectedOrde }) {
  const [editedSite, setEditedSite] = useState(site);
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

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedSite((prevSite) => ({
      ...prevSite,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault() ;
    let temp = parseInt(editedSite.distanceFromWH);
    setEditedSite(prevSite => ({
      ...prevSite,
      ["distanceFromWH"]: temp,
    }));
    fetch('http://localhost:8000/site/edit/site/'+site.siteID, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedSite),
    })
      .then(response => response.json())
      .then(data => {console.log(data); setShowInitial(true);  window.location.reload();})
      .catch(error => console.error(error));
  }

  function handleCancel() {
    setShowInitial(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" value={editedSite.name}  onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input type="text" name="address" id="address" value={editedSite.address} onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="city">City:</label>
        <input type="text" name="city" id="city" value={editedSite.city} onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="provinceID">Province ID:</label>
        <select name="provinceID" value={editedSite.provinceID} onChange={handleInputChange} required>
        {provinces.map((province) => (
            <option key={province.provinceID} value={province.provinceID}>
            {province.provinceName}
            </option>
        ))}
        </select>
        </div>
      <div>
        <label htmlFor="postalCode">Postal Code:</label>
        <input type="text" name="postalCode" id="postalCode" value={editedSite.postalCode} onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="country">Country:</label>
        <input type="text" name="country" id="country" value={editedSite.country} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input type="text" name="phone" id="phone" value={editedSite.phone} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="dayOfWeek">Day of Week:</label>
        <select name="dayOfWeek" value={editedSite.dayOfWeek} onChange={handleInputChange} required>
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
          <select name="siteType" value={editedSite.siteType} onChange={handleInputChange} required>
            {siteTypes.map((siteType) => (
              <option key={siteType.siteType} value={siteType.siteType}>
                {siteType.siteType}
              </option>
            ))}
          </select>
        </div>
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EditSite