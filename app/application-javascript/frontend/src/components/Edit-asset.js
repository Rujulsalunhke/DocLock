import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import './css/centerIcon.css';
import './css/DeleteAsset.css';

export default class EditAsset extends Component {
  constructor(props) {
    super(props);

    this.onChangeOwner = this.onChangeOwner.bind(this);
    this.onChangeDocumentFormat = this.onChangeDocumentFormat.bind(this);
    this.onChangeDocumentType = this.onChangeDocumentType.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onUploadFile = this.onUploadFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      ID: '',
      Owner: '',
      DocumentFormat: '',
      DocumentType: '',
      file: null,
      DocumentURL: '',
      loading: false,
      submitting: false,
      error: null,
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/Assets/edit-asset/' + this.props.match.params.id)
      .then(res => {
        const asset = JSON.parse(res.data.data);
        this.setState({
          ID: asset.ID,
          DocumentFormat: asset.DocumentFormat,
          DocumentType: asset.DocumentType,
          Owner: asset.Owner,
          DocumentURL: asset.DocumentURL,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChangeOwner(e) {
    this.setState({ Owner: e.target.value });
  }

  onChangeDocumentFormat(e) {
    this.setState({ DocumentFormat: e.target.value });
  }

  onChangeDocumentType(e) {
    this.setState({ DocumentType: e.target.value });
  }

  onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toUpperCase();
      this.setState({
        file: file,
        DocumentFormat: fileExtension,
      });
    }
  }

  //  Fill Your API Key and Secret

  async uploadToIPFS(file) {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const apiKey = 'Add Your API KEY';
    const apiSecret = 'Add Your API Secret';

    const formData = new FormData();
    formData.append('file', file);

    try {
      this.setState({ loading: true });
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      this.setState({ DocumentURL: ipfsHash, loading: false });
      return ipfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS via Pinata:', error);
      this.setState({ loading: false });
      alert('Error uploading to IPFS: ' + error.message);
      throw error;
    }
  }

  async onUploadFile() {
    const { file } = this.state;
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      const newHash = await this.uploadToIPFS(file);
      this.setState({ DocumentURL: newHash });
      alert("File uploaded successfully! New IPFS Hash: " + newHash);
    } catch (error) {
      console.error(error);
    }
  }

  async onSubmit(e) {
    e.preventDefault();

    const { ID, Owner, DocumentFormat, DocumentType, DocumentURL } = this.state;

    const AssetObject = {
      ID,
      Owner,
      DocumentFormat,
      DocumentType,
      DocumentURL,
    };

    this.setState({ submitting: true });

    axios.put('http://localhost:4000/Assets/update-Asset/' + ID, AssetObject)
      .then((res) => {
        console.log('Asset successfully updated');
        this.props.history.push('/asset-list');
      })
      .catch((error) => {
        console.error('Error updating asset:', error.response ? error.response.data : error);
        this.setState({ error: 'Error updating asset', submitting: false });
      });
  }

  render() {
    const { loading, submitting } = this.state;

    return (
      <div className="form-wrapper">
        <h2 className="pageHead">Edit Asset</h2>
        <Form className="pageAction" onSubmit={this.onSubmit}>
          <Form.Group controlId="ID">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={this.state.ID} disabled />
          </Form.Group>

          <Form.Group controlId="Owner">
            <Form.Label>Owner</Form.Label>
            <Form.Control type="text" value={this.state.Owner} onChange={this.onChangeOwner} />
          </Form.Group>

          <Form.Group controlId="DocumentType">
            <Form.Label>Type</Form.Label>
            <Form.Control as="select" value={this.state.DocumentType} onChange={this.onChangeDocumentType}>
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="Pan Card">Pan Card</option>
              <option value="Voting Card">Voting Card</option>
              <option value="Driving License">Driving License</option>
            </Form.Control>
          </Form.Group>


          <Form.Group controlId="file">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control type="file" onChange={this.onFileChange} />
          </Form.Group>

          <Form.Group controlId="DocumentFormat">
            <Form.Label>Format</Form.Label>
            <Form.Control type="text" value={this.state.DocumentFormat} onChange={this.onChangeDocumentFormat} readOnly />
          </Form.Group>
          <Button
            variant="primary"
            onClick={this.onUploadFile}
            className="mt-2 centerIcon"
            style={{ backgroundColor: '#4e3e8c', borderColor: '#4e3e8c' }}
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "25px", height: "25px", marginTop: "1px" }}>
            </lord-icon> &nbsp; &nbsp;
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              "Upload to IPFS"
            )}
          </Button>

          <Form.Group controlId="DocumentURL">
            <Form.Label>Document URL (IPFS Hash)</Form.Label>
            <Form.Control type="text" value={this.state.DocumentURL} readOnly />
          </Form.Group>


          <Button variant="danger" size="lg" block="block" type="submit" className="mt-4 centerIcon" disabled={submitting}>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "25px", height: "25px", marginTop: "1px" }}>
            </lord-icon> &nbsp; &nbsp;
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                Updating Asset...
              </>
            ) : (
              "Update Asset"
            )}
          </Button>

          {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
        </Form>
      </div>
    );
  }
}
