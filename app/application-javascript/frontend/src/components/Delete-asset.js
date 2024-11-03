import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; // Import Modal from react-bootstrap
import axios from 'axios';
import './css/centerIcon.css';
import './css/DeleteAsset.css';

export default class DeleteAsset extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    // State
    this.state = {
      ID: '',
      Owner: '',
      DocumentFormat: '',
      DocumentType: '',
      DocumentURL: '',
      error: null,
      loading: true,
      showModal: false // State for controlling modal visibility
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

  onDelete() {
    axios.delete(`http://localhost:4000/Assets/delete-asset/${this.props.match.params.id}`)
      .then((res) => {
        console.log('Asset successfully deleted');
        this.props.history.push('/asset-list');
      })
      .catch((error) => {
        console.error('Error deleting asset:', error.response ? error.response.data : error.message);
        this.setState({ error: 'Error deleting asset' });
      });
    this.handleClose(); // Close the modal after delete
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  render() {
    const { ID, Owner, DocumentFormat, DocumentType, DocumentURL, loading, error, showModal } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="form-wrapper">
        <h2 className="pageHead">Delete Asset</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form className="pageAction">
          <Form.Group controlId="ID">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={ID} disabled />
          </Form.Group>

          <Form.Group controlId="Owner">
            <Form.Label>Owner</Form.Label>
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

          <Button variant="danger" size="lg" block onClick={this.handleShow} className="mt-4 centerIcon">
            <lord-icon
              src="https://cdn.lordicon.com/skkahier.json"
              trigger="hover"
              colors="primary:#ffffff"
              style={{ width: "25px", height: "25px", marginTop: "1px" }}>
            </lord-icon> &nbsp; &nbsp;
            Delete Asset
          </Button>

          {/* Modal for confirmation */}
          <Modal show={showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this asset? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={this.onDelete}>
                Confirm Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </div>
    );
  }
}
