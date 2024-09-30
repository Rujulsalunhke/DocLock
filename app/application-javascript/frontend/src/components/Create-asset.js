import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class CreateAsset extends Component {
  constructor(props) {
    super(props);

    // Setting up functions
    this.onChangeID = this.onChangeID.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      ID: '',
      Owner: '',
      Color: '',
      Size: '',
      file: null,
      ipfsHash: '', 
      DocumentURL: '', 
    };
  }

  onChangeID(e) {
    this.setState({ ID: e.target.value });
  }

  onChangeOwner(e) {
    this.setState({ Owner: e.target.value });
  }

  onChangeColor(e) {
    this.setState({ Color: e.target.value });
  }

  onChangeSize(e) {
    this.setState({ Size: e.target.value });
  }

  onFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  // Function to upload file to Pinata
  async uploadToIPFS(file) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`; 
    const apiKey = 'edd76b1ea420b33ab3eb'; 
    const apiSecret = '03c3aed9888241af560199ff6ec7991e3a9cdde30637bbf5fc4ea8e4cdc90636'; 

    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file to Pinata:', file);

    try {
      const response = await axios.post(url, formData, {
        maxBodyLength: 'Infinity', // For large files
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      const ipfsHash = response.data.IpfsHash; 
      this.setState({ ipfsHash, DocumentURL: ipfsHash }); 
      console.log('IPFS Hash:', ipfsHash);
      return ipfsHash; // Return the IPFS hash
    } catch (error) {
      console.error('Error uploading to IPFS via Pinata:', error);
      alert('Error uploading to IPFS: ' + error.message); 
      throw error;
    }
  }

  async onSubmit(e) {
    e.preventDefault();

    const { ID, Owner, Color, Size, file, ipfsHash } = this.state;

    // Ensure file upload to IPFS before submission
    if (!ipfsHash && file) {
      try {
        const uploadedHash = await this.uploadToIPFS(file);
        this.setState({ DocumentURL: uploadedHash });
      } catch (error) {
        return; // Stop submission if file upload fails
      }
    }

    // Validate fields
    if (!ID || !Owner || !Color || !Size || !this.state.DocumentURL) {
      alert('Please fill all fields, including file upload.');
      return;
    }

    const AssetObject = {
      ID,
      Owner,
      Color,
      Size,
      DocumentURL: this.state.DocumentURL, 
    };

    console.log('AssetObject to be sent:', AssetObject);

    try {
      // Make sure this URL is correct for your backend
      await axios.post('http://localhost:4000/Assets/create-asset', AssetObject);
      
      console.log('Asset successfully created!');
      
      // Redirect or refresh the list after submission if needed
      this.props.history.push('/asset-list'); // Redirect to asset list page

    } catch (error) {
      console.error('Error creating asset:', error);
    }
  }

  render() {
    return (
      <div className="form-wrapper">
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="ID">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={this.state.ID} onChange={this.onChangeID} />
          </Form.Group>

          <Form.Group controlId="Owner">
            <Form.Label>Owner</Form.Label>
            <Form.Control type="text" value={this.state.Owner} onChange={this.onChangeOwner} />
          </Form.Group>

          <Form.Group controlId="Color">
            <Form.Label>Color</Form.Label>
            <Form.Control type="text" value={this.state.Color} onChange={this.onChangeColor} />
          </Form.Group>

          <Form.Group controlId="Size">
            <Form.Label>Size</Form.Label>
            <Form.Control type="text" value={this.state.Size} onChange={this.onChangeSize} />
          </Form.Group>

          <Form.Group controlId="file">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control type="file" onChange={this.onFileChange} />
            <Button 
              variant="primary" 
              onClick={() => {
                if (this.state.file) {
                  this.uploadToIPFS(this.state.file);
                } else {
                  alert('Please select a file to upload.');
                }
              }} 
              className="mt-2"
            >
              Generate IPFS Hash
            </Button>
            {this.state.ipfsHash && (
              <div className="mt-2">
                <strong>Generated IPFS Hash: </strong>
                <span>{this.state.ipfsHash}</span>
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="DocumentURL">
            <Form.Label>Document URL (IPFS Hash)</Form.Label>
            <Form.Control 
              type="text" 
              value={this.state.DocumentURL} 
              onChange={(e) => this.setState({ DocumentURL: e.target.value })} 
              placeholder="Enter the generated IPFS hash here"
            />
          </Form.Group>

          <Button variant="danger" size="lg" block="block" type="submit" className="mt-4">
            Create Asset
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(CreateAsset);

