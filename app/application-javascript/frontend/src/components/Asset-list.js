import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import AssetTableRow from './AsssetTableRow'; // Ensure the component is correctly imported
import './css/Assetlist.css'; // Assuming you'll create a CSS file for additional styles

export default class AssetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Assets: [],
      searchQuery: localStorage.getItem('ownerName') || '', // Get owner name from local storage
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/Assets/')
      .then(res => {
        console.log('Fetched Assets:', res.data);

        // Parse the JSON string in the data field (ensure the structure matches)
        const assets = JSON.parse(res.data.data);

        this.setState({
          Assets: assets
        });
      })
      .catch((error) => {
        console.log('Error fetching assets:', error);
      });
  }

  ConsoleData() {
    console.log('Current Assets:', this.state.Assets);
  }

  DataTable() {
    this.ConsoleData(); // Log current assets
    const { searchQuery, Assets } = this.state;

    // Filter assets based on the search query (owner name from localStorage)
    const filteredAssets = Assets.filter(asset =>
      asset.Owner && asset.Owner.toLowerCase().includes(searchQuery.toLowerCase()) // Check if Owner exists
    );

    console.log('Filtered Assets:', filteredAssets); // Log filtered assets for debugging

    return filteredAssets.map((res, i) => {
      return <AssetTableRow obj={res} key={i} />;
    });
  }

  render() {
    const ownerName = this.state.searchQuery;

    return (
      <div className="table-wrapper">
        <h2 className="headhigh">Assets of {ownerName}</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Owner</th>
              <th>DocumentFormat</th>
              <th>DocumentType</th>
              <th>Document</th>
              <th className="widthCol">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.DataTable()}
          </tbody>
        </Table>
      </div>
    );
  }
}

