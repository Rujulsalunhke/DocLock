import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
// import './css/centerIcon.css';
import './css/TransferAsset.css';


export default class TransferAsset extends Component {
  constructor(props) {
    super(props);
    this.onTransfer = this.onTransfer.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    // State
    this.state = {
      ID: '',
      Owner: '',
      DocumentFormat: '',
      DocumentType: '',
      DocumentURL: '',
      newOwner: '',
      error: null,
      loading: true,
      showModal: false
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:4000/Assets/edit-asset/${this.props.match.params.id}`)
      .then(res => {
        const data = JSON.parse(res.data.data);
        this.setState({
          ID: data.ID,
          Owner: data.Owner,
          DocumentFormat: data.DocumentFormat,
          DocumentType: data.DocumentType,
          DocumentURL: data.DocumentURL,
          loading: false
        });
      })
      .catch((error) => {
        console.log('Error fetching asset data:', error);
        this.setState({ error: 'Error fetching asset data', loading: false });
      });
  }

  onTransfer() {
    const { newOwner } = this.state;

    if (!newOwner) {
      this.setState({ error: 'New owner is required' });
      return;
    }

    axios.put(`http://localhost:4000/assets/transfer-asset/${this.props.match.params.id}`, { newOwner })
      .then((res) => {
        console.log('Asset successfully transferred');
        this.props.history.push('/asset-list');
      })
      .catch((error) => {
        console.error('Error transferring asset:', error.response ? error.response.data : error.message);
        this.setState({ error: 'Error transferring asset' });
      });
    this.handleClose(); // Close the modal after transfer
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  render() {
    const { ID, Owner, DocumentFormat, DocumentType, DocumentURL, newOwner, loading, error, showModal } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="form-wrapper">
        <h2 className="pageHead">Transfer Asset</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form className="pageAction">
          <Form.Group controlId="ID">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={ID} disabled />
          </Form.Group>

          <Form.Group controlId="Owner">
            <Form.Label>Current Owner</Form.Label>
            <Form.Control type="text" value={Owner} disabled />
          </Form.Group>

          <Form.Group controlId="Color">
            <Form.Label>Format</Form.Label>
            <Form.Control type="text" value={DocumentFormat} disabled />
          </Form.Group>

          <Form.Group controlId="Size">
            <Form.Label>Type</Form.Label>
            <Form.Control type="text" value={DocumentType} disabled />
          </Form.Group>

          <Form.Group controlId="DocumentURL">
            <Form.Label>Document URL</Form.Label>
            <Form.Control type="text" value={DocumentURL} disabled />
          </Form.Group>

          <Form.Group controlId="NewOwner">
            <Form.Label>New Owner</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new owner"
              value={newOwner}
              onChange={(e) => this.setState({ newOwner: e.target.value })}
            />
          </Form.Group>

          <Button variant="primary" size="lg" block onClick={this.handleShow} className="centerIcon transferBtn font-bold">
            <lord-icon
              src="https://cdn.lordicon.com/vpbspaec.json"
              trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "39px", height: "39px", marginTop: "1px" }}>
            </lord-icon> &nbsp; &nbsp;
            Transfer Asset
          </Button>

          {/* Modal for confirmation */}
          <Modal show={showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Transfer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to transfer this asset to {newOwner}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={this.onTransfer}>
                Confirm Transfer
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </div>
    );
  }
}

