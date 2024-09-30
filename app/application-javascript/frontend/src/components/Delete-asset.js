import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class DeleteAsset extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);

    // State
    this.state = {
      ID: '',
      Owner: '',
      Color: '',
      Size: '',
      DocumentURL: '',
      error: null,
      loading: true
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:4000/Assets/edit-asset/${this.props.match.params.id}`)
      .then(res => {
        const data = JSON.parse(res.data.data);
        this.setState({
          ID: data.ID,
          Owner: data.Owner,
          Color: data.Color,
          Size: data.Size,
          DocumentURL: data.DocumentURL,
          loading: false
        });
      })
      .catch((error) => {
        console.log('Error fetching asset data:', error);
        this.setState({ error: 'Error fetching asset data', loading: false });
      });
  }

  onDelete(e) {
    e.preventDefault();

    axios.delete(`http://localhost:4000/Assets/delete-asset/${this.props.match.params.id}`)
      .then((res) => {
        console.log('Response:', res.data);
        console.log('Asset successfully deleted');
        this.props.history.push('/asset-list');
      })
      .catch((error) => {
        console.error('Error deleting asset:', error.response ? error.response.data : error.message);
        this.setState({ error: 'Error deleting asset' });
      });
  }

  render() {
    const { ID, Owner, Color, Size, DocumentURL, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="form-wrapper">
        <h2>Confirm Deletion</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Form.Group controlId="ID">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={ID} disabled />
          </Form.Group>

          <Form.Group controlId="Owner">
            <Form.Label>Owner</Form.Label>
            <Form.Control type="text" value={Owner} disabled />
          </Form.Group>

          <Form.Group controlId="Color">
            <Form.Label>Color</Form.Label>
            <Form.Control type="text" value={Color} disabled />
          </Form.Group>

          <Form.Group controlId="Size">
            <Form.Label>Size</Form.Label>
            <Form.Control type="text" value={Size} disabled />
          </Form.Group>
          
          <Form.Group controlId="DocumentURL">
            <Form.Label>Document URL</Form.Label>
            <Form.Control type="text" value={DocumentURL} disabled />
          </Form.Group>

          <Button variant="danger" size="lg" block onClick={this.onDelete} className="mt-4">
            Delete Asset
          </Button>
        </Form>
      </div>
    );
  }
}

