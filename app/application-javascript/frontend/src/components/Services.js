// import React, { Component } from "react";
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Spinner from 'react-bootstrap/Spinner'; // Import Spinner for loading state
// import { withRouter } from 'react-router-dom';
// import crypto from 'crypto'; // To hash the password
// import './css/Login.css'; // Assuming you'll create a CSS file for additional styles

// class Login extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             ownerName: '',
//             password: '',
//             showForm: false, // State to manage form visibility
//             loading: false // State to manage loading spinner and prevent multiple clicks
//         };

//         this.handleChange = this.handleChange.bind(this);
//         this.handleLogin = this.handleLogin.bind(this);
//         this.toggleFormVisibility = this.toggleFormVisibility.bind(this);
//     }

//     handleChange(event) {
//         const { name, value } = event.target;
//         this.setState({ [name]: value });
//     }

//     // Function to hash the password
//     hashPassword(password) {
//         return crypto.createHash('sha256').update(password).digest('hex');
//     }

//     // Toggle form visibility when the login button is clicked for the first time
//     toggleFormVisibility() {
//         this.setState({ showForm: true });
//     }

//     async handleLogin() {
//         const { ownerName, password, showForm } = this.state;

//         // If form is not shown, just display it
//         if (!showForm) {
//             this.toggleFormVisibility();
//             return;
//         }

//         // Show loading and prevent multiple clicks
//         this.setState({ loading: true });

//         try {
//             // Fetch the users
//             const response = await fetch('http://localhost:4000/users');
//             const users = await response.json();  // Directly the array of users

//             // Find the matching user
//             const user = users.find(user => user.Username && user.Username.toLowerCase() === ownerName.toLowerCase());

//             if (user) {
//                 // Hash the entered password and compare with stored hash
//                 const hashedPassword = this.hashPassword(password);
//                 if (user.PasswordHash === hashedPassword) {
//                     localStorage.setItem('ownerName', ownerName);

//                     // Redirect on successful login
//                     this.props.history.push('/Asset-list');

//                     // Reload the page after successful login
//                     window.location.reload();  // Page reload after redirect
//                 } else {
//                     alert('Incorrect password');
//                 }
//             } else {
//                 alert('User not found');
//             }
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             alert('Error logging in');
//         }

//         // Hide loading spinner after the process is done
//         this.setState({ loading: false });
//     }

//     render() {
//         const { showForm, loading } = this.state;

//         return (
//             <div>
//                 {/* Navbar goes here (assuming you already have it implemented) */}

//                 {/* Main content area */}
//                 <div className="main-container">
//                     {/* Background div behind the description and image */}
//                     <div className="background-box"></div>

//                     {/* Text Section */}
//                     <div className="text-section">
//                         {/* Flex Box 1 (Title) */}
//                         <div className="title-box">
//                             Securely Access
//                             Your Documents.
//                         </div>

//                         {/* Flex Box 2 (Description) */}
//                         <div className="description-box">
//                             <p>DocLock is a secure blockchain-based e-vault for tamper-proof, decentralized storage and management of sensitive documents.</p>
//                         </div>

//                         {/* Login Form - Initially hidden */}
//                         {showForm && (
//                             <div className="login-wrapper">
//                                 <Form.Group controlId="ownerName">
//                                     <Form.Label className="text-white">Owner Name</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Enter owner's name"
//                                         name="ownerName"
//                                         value={this.state.ownerName}
//                                         onChange={this.handleChange}
//                                     />
//                                 </Form.Group>

//                                 <Form.Group controlId="password">
//                                     <Form.Label className="text-white">Password</Form.Label>
//                                     <Form.Control
//                                         type="password"
//                                         placeholder="Enter password"
//                                         name="password"
//                                         value={this.state.password}
//                                         onChange={this.handleChange}
//                                     />
//                                 </Form.Group>
//                             </div>
//                         )}

//                         {/* Login Button */}
//                         <Button
//                             onClick={this.handleLogin}
//                             variant="primary"
//                             className="login-button"
//                             disabled={loading} // Disable the button while loading
//                         >
//                             {loading ? (
//                                 <Spinner animation="border" size="sm" /> // Show spinner when loading
//                             ) : showForm ? 'Login' : 'Click to Login'}
//                         </Button>
//                     </div>

//                     {/* Flex Box 3 - Image on the right side */}
//                     <div className="image-section">
//                         <img src="/loginback-removebg-preview.png" alt="Sample" />
//                     </div>
//                 </div>

//                 {/* New Section: "DocLock Provides these services" */}
//                 <div className="services-container">

//                     <hr />

//                     <h1>DocLock Provides these services</h1>

//                     <div className="flexbox-services">
//                         {/* Service 1 */}
//                         <div className="service-box gradient-bg">
//                             <h2>Blockchain Security</h2>
//                             <p>We ensure that your documents are stored in a secure, decentralized manner using blockchain technology to prevent unauthorized access and tampering.</p>
//                         </div>

//                         {/* Service 2 */}
//                         <div className="service-box gradient-bg">
//                             <h2>Document Encryption</h2>
//                             <p>All your sensitive documents are encrypted, ensuring that only authorized users can access or view them with the highest level of security.</p>
//                         </div>

//                         {/* Service 3 */}
//                         <div className="service-box gradient-bg">
//                             <h2>Decentralized Storage</h2>
//                             <p>Your documents are stored across a distributed network, making sure there is no single point of failure, ensuring greater data availability and security.</p>
//                         </div>
//                     </div>
//                 </div>

//                 <hr />
//                 {/* New Section: "About Us" */}
//                 <div className="about-container gradient-bg">

//                     <div className="about-content">
//                         <div className="about-text">
//                             <h1>About Us</h1>
//                             <p>DocLock uses blockchain technology to provide secure, decentralized storage for sensitive documents. We prioritize privacy, transparency, and user control, ensuring documents remain tamper-proof, protected, and accessible only to authorized individuals. Trusted by individuals and organizations alike for reliable document security.</p>
//                         </div>
//                         <div className="about-image">
//                             <img src="/serviceback.png" alt="About Us" />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default withRouter(Login);
