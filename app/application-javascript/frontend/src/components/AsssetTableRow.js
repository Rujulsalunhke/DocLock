import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { AiFillEye } from 'react-icons/ai';
import './css/AssetTable.css';

export default class AssetTableRow extends Component {
  constructor(props) {
    super(props);
    this.TransferAsset = this.TransferAsset.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);

    this.state = {
      showShareModal: false,
    };
  }

  async TransferAsset() {
    try {
      const { obj } = this.props; // Assuming obj contains asset data
      const newOwner = prompt('Enter the new owner\'s address:'); // Prompt the user for the new owner

      if (!newOwner) {
        alert('Please provide a new owner.');
        return;
      }

      const response = await axios.post('/api/transfer-asset', {
        id: obj.ID,          // assetId
        newOwner,            // newOwner
      });

      alert('Asset transferred successfully!');
    } catch (error) {
      console.error('Error transferring asset:', error);
      alert('Failed to transfer asset: ' + (error.response ? error.response.data : error.message));
    }
  }

  handleImageClick(documentURL) {
    if (documentURL) {
      const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${documentURL}`;
      window.open(pinataGatewayUrl, '_blank');
    } else {
      console.error('Invalid Document URL');
    }
  }

  handleDownloadClick(documentURL) {
    if (documentURL) {
      const pinataGatewayUrl = `https://gateway.pinata.cloud/ipfs/${documentURL}`;

      axios({
        url: pinataGatewayUrl,
        method: 'GET',
        responseType: 'blob',
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `document_${this.props.obj.ID}.${this.props.obj.DocumentFormat.toLowerCase()}`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((error) => {
          console.error('Error downloading document:', error);
          alert('Failed to download document.');
        });
    } else {
      console.error('Invalid Document URL');
    }
  }

  handleShareClick() {
    this.setState({ showShareModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showShareModal: false });
  }

  copyToClipboard() {
    const shareableLink = `https://gateway.pinata.cloud/ipfs/${this.props.obj.DocumentURL}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Link copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  }

  render() {
    const { obj } = this.props;
    const { showShareModal } = this.state;

    return (
      <>
        <tr>
          <td>{obj.ID}</td>
          <td>{obj.Owner}</td>
          <td>{obj.DocumentFormat}</td>
          <td>{obj.DocumentType}</td>
          <td>
            <a
              className='cursor-pointer'
              href="#"
              onClick={(e) => {
                e.preventDefault();
                this.handleImageClick(obj.DocumentURL);
              }}
            >
              View Document &nbsp; <AiFillEye size={25} color="#512DA8" />
            </a>
          </td>
          <td>
            <div className="button-group-2">
              <Link className="edit-link text-white bg-green-300 flex justify-center items-center" to={`/edit-asset/${obj.ID}`}>
                Edit&nbsp;
                <lord-icon
                  src="https://cdn.lordicon.com/gwlusjdu.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: "20px", height: "20px", marginTop: "1px" }}
                />
              </Link>

              <Link className="edit-link text-white bg-red-400" to={`/delete-asset/${obj.ID}`}>
                Delete &nbsp;
                <lord-icon
                  src="https://cdn.lordicon.com/skkahier.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: "20px", height: "20px" }}
                />
              </Link>

              {/* Add Transfer Button */}
              <Link
                className="edit-link bg-blue-400 flex items-center gap-1 hover:opacity-90"
                to={`/transfer-asset/${obj.ID}`}
                style={{ display: "inline-flex", alignItems: "center", color: "white" }}
              >
                Transfer &nbsp;
                <lord-icon
                  src="https://cdn.lordicon.com/olfvnikl.json"
                  trigger="hover"
                  stroke="bold"
                  colors="primary:#ffffff,secondary:#ffffff"
                  style={{ width: "20px", height: "20px" }}
                />
              </Link>

            </div>
            <div className="button-group">
              {/* Download Button */}
              <Button
                variant="primary"
                className="edit-link download-button"
                onClick={() => this.handleDownloadClick(obj.DocumentURL)}
              >
                Download &nbsp; <FontAwesomeIcon icon={faDownload} />
              </Button>

              {/* Share Button */}
              <Button
                variant="info"
                className="edit-link share-button"
                onClick={this.handleShareClick}
              >
                Share &nbsp; <FontAwesomeIcon icon={faShareAlt} />
              </Button>
            </div>
          </td>
        </tr>

        {/* Share Modal */}
        <Modal show={showShareModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Share Asset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Share this link:</p>
            <input
              type="text"
              value={`https://gateway.pinata.cloud/ipfs/${obj.DocumentURL}`}
              readOnly
              className="form-control"
            />
            <button className="btn btn-link" onClick={this.copyToClipboard}>
              Copy Link
            </button>
            <div>
              <p>Share via:</p>
              <a
                href={`https://wa.me/?text=Check%20out%20this%20asset%3A%20${encodeURIComponent(`https://gateway.pinata.cloud/ipfs/${obj.DocumentURL}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success"
              >
                WhatsApp &nbsp; <FontAwesomeIcon icon={faShareAlt} />
              </a>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
