import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import './css/Createasset.css';  // Create and import a CSS file for styling
import './css/centerIcon.css';  // Create and import a CSS file for styling

class CreateAsset extends Component {
  constructor(props) {
    super(props);

    this.onChangeDocumentFormat = this.onChangeDocumentFormat.bind(this);
    this.onChangeDocumentType = this.onChangeDocumentType.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      ID: '',
      Owner: '',
      DocumentFormat: '',
      DocumentType: '',
      file: null,
      ipfsHash: '',
      DocumentURL: '',
      loading: false,  // Add a new state for loading
      submitting: false,  // Add a new state for submitting
    };
  }

  generateRandomID() {
    return Math.random().toString(36).substring(2, 7);
  }

  componentDidMount() {
    const randomID = this.generateRandomID();
    this.setState({ ID: randomID });

    const storedOwnerName = localStorage.getItem('ownerName');
    if (storedOwnerName) {
      this.setState({ Owner: storedOwnerName });
    }
  }

  onChangeDocumentFormat(e) {
    this.setState({ DocumentFormat: e.target.value });
  }

  onChangeDocumentType(e) {
    this.setState({ DocumentType: e.target.value });
  }

  // Automatically set DocumentFormat based on the file extension
  onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toUpperCase(); // Extract file extension and convert to uppercase
      this.setState({
        file: file,
        DocumentFormat: fileExtension,  // Automatically set DocumentFormat
      });
    }
  }

  async uploadToIPFS(file) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const apiKey = 'edd76b1ea420b33ab3eb';
    const apiSecret = '03c3aed9888241af560199ff6ec7991e3a9cdde30637bbf5fc4ea8e4cdc90636';

    const formData = new FormData();
    formData.append('file', file);

    try {
      this.setState({ loading: true });  // Start loading
      const response = await axios.post(url, formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      this.setState({ ipfsHash, DocumentURL: ipfsHash, loading: false });  // Stop loading
      return ipfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS via Pinata:', error);
      this.setState({ loading: false });  // Stop loading on error
      alert('Error uploading to IPFS: ' + error.message);
      throw error;
    }
  }

  async onSubmit(e) {
    e.preventDefault();

    const { ID, Owner, DocumentFormat, DocumentType, file, ipfsHash } = this.state;

    if (!ipfsHash && file) {
      try {
        const uploadedHash = await this.uploadToIPFS(file);
        this.setState({ DocumentURL: uploadedHash });
      } catch (error) {
        return;
      }
    }

    if (!ID || !Owner || !DocumentFormat || !DocumentType || !this.state.DocumentURL) {
      alert('Please fill all fields, including file upload.');
      return;
    }

    const AssetObject = {
      ID,
      Owner,
      DocumentFormat,
      DocumentType,
      DocumentURL: this.state.DocumentURL,
    };

    this.setState({ submitting: true });  // Set submitting to true

    try {
      await axios.post('http://localhost:4000/Assets/create-asset', AssetObject);
      this.props.history.push('/asset-list');
    } catch (error) {
      console.error('Error creating asset:', error);
    } finally {
      this.setState({ submitting: false });  // Set submitting back to false
    }
  }

  render() {
    const { loading, submitting } = this.state;  // Extract loading and submitting states
    return (
      <div className="form-container">
        <h2 className="form-title">CREATE ASSET</h2>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="ID">
            <Form.Label>ID (Auto-generated)</Form.Label>
            <Form.Control type="text" value={this.state.ID} readOnly />
          </Form.Group>

          <Form.Group controlId="Owner">
            <Form.Label>Owner</Form.Label>
            <Form.Control type="text" value={this.state.Owner} readOnly />
          </Form.Group>

          <Form.Group controlId="DocumentType">
            <Form.Label>Document Type</Form.Label>
            <Form.Control as="select" value={this.state.DocumentType} onChange={this.onChangeDocumentType}>
              <option value="">Select a Document Type</option>
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="Pan Card">Pan Card</option>
              <option value="Voting Card">Voting Card</option>
              <option value="Driving License">Driving License</option>
            </Form.Control>
          </Form.Group>


          <Form.Group controlId="file">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control type="file" onChange={this.onFileChange} />

            <Form.Group controlId="DocumentFormat">
              <Form.Label>Format</Form.Label>
              <Form.Control type="text" value={this.state.DocumentFormat} onChange={this.onChangeDocumentFormat} readOnly />
            </Form.Group>

            <Button
              variant="primary"
              className="generate-hash-button centerIcon"
              onClick={() => {
                if (this.state.file) {
                  this.uploadToIPFS(this.state.file);
                } else {
                  alert('Please select a file to upload.');
                }
              }}
              disabled={loading}  // Disable button while loading
            > <lord-icon
              src="https://cdn.lordicon.com/fowixcuo.json"
              trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "25px", height: "25px", marginTop: "1px" }}>
              </lord-icon> &nbsp; &nbsp;
              {loading ? (  // Show loading spinner if loading is true
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Uploading...
                </>
              ) : (
                "Generate IPFS Hash"
              )}
            </Button>
            {this.state.ipfsHash && (
              <div className="hash-display">
                <strong>Generated IPFS Hash: </strong>
                <span>{this.state.ipfsHash}</span>
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="DocumentURL">
            <Form.Label>Document URL (IPFS Hash) </Form.Label>
            <Form.Control
              type="text"
              value={this.state.DocumentURL}
              onChange={(e) => this.setState({ DocumentURL: e.target.value })}
              placeholder="Enter the generated IPFS hash here"
            />
          </Form.Group>

          <Button
            variant="danger"
            size="lg"
            block="block"
            type="submit"
            className="create-asset-button centerIcon"
            disabled={submitting}  // Disable button while submitting
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "25px", height: "25px", marginTop: "1px" }}>
            </lord-icon> &nbsp; &nbsp;
            {submitting ? (  // Show loading spinner if submitting is true
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Creating Asset...
              </>
            ) : (
              "Create Asset"
            )}
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(CreateAsset);

