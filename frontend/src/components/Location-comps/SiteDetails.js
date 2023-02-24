import React from 'react';
import Table from 'react-bootstrap/Table';

const SiteDetails = ({ site, setSelectedOrder }) => {
  return (
    <div id="viewContainer">
    <button id="closeButton" onClick={() => setSelectedOrder({})}>X</button>
      <Table striped bordered>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{site.name}</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>{site.address}</td>
          </tr>
          <tr>
            <td>Address 2:</td>
            <td>{site.address2}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{site.city}</td>
          </tr>
          <tr>
            <td>Province:</td>
            <td>{site.provinceID}</td>
          </tr>
          <tr>
            <td>Postal Code:</td>
            <td>{site.postalCode}</td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td>{site.phone}</td>
          </tr>
          <tr>
            <td>Day of Week:</td>
            <td>{site.dayOfWeek}</td>
          </tr>
          <tr>
            <td>Distance From Warehouse:</td>
            <td>{site.distanceFromWH}</td>
          </tr>
          <tr>
            <td>Site Type:</td>
            <td>{site.siteType}</td>
          </tr>
          <tr>
            <td>Notes:</td>
            <td>{site.notes}</td>
          </tr>
          <tr>
            <td>Active:</td>
            <td>{site.active ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default SiteDetails;