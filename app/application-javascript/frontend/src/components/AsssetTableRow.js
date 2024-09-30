import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class AssetTableRow extends Component {
  constructor(props) {
    super(props);
    this.TransferAsset = this.TransferAsset.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  async TransferAsset() {
    try {
      const response = await axios.post('/api/transfer-asset', {
        assetId: this.props.obj.ID,
      });
      alert('Asset transferred successfully!');
    } catch (error) {
      console.error('Error transferring asset:', error);
      alert('Failed to transfer asset.');
    }
  }

handleImageClick(documentURL) {
  console.log('Document URL:', documentURL); // Debugging: Log the URL
  if (documentURL) {
    // Construct the Pinata gateway URL
    const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${documentURL}`;
    // Open the document URL in a new tab
    window.open(pinataGatewayUrl, '_blank');
  } else {
    console.error('Invalid Document URL');
  }
}

  render() {
    const { obj } = this.props;

    return (
      <tr>
        <td>{obj.ID}</td>
        <td>{obj.Owner}</td>
        <td>{obj.Color}</td>
        <td>{obj.Size}</td>
        <td>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
              this.handleImageClick(obj.DocumentURL);
            }}
          >
            View Document
          </a>
        </td>
        <td>
          <Link
            className="edit-link"
            to={`/edit-asset/${obj.ID}`}
          >
            Edit
          </Link>
          <Button onClick={this.TransferAsset} size="sm" variant="danger">
            Transfer
          </Button>
          <Link
            className="edit-link"
            to={`/delete-asset/${obj.ID}`}
          >
            Delete
          </Link>
        </td>
      </tr>
    );
  }
}

