import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './css/Footer.css'; // Ensure the path is correct for your project structure
import Login from './Login.js';
import Signup from './Signup.js';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <div class="content">
            </div>
            <footer className="footer text-white">
                <Container fluid>
                    <Row className="justify-content-center">
                        <Col md={15} className="text-center flex-logo">
                            <img
                                src='/Footer-logo.png' // Ensure logo.jpeg is in the public folder
                                alt="DocLock Logo"
                                className="footer-logo"
                                style={{ width: '90px', height: 'auto' }}
                            />
                            <h1>DocLock</h1>
                        </Col>

                    </Row>
                    <Row className='flex-content'>
                        <Col md={4} className="text-center">
                            <p>
                                DocLock is a blockchain-based platform providing secure,
                                tamper-proof document storage. We prioritize privacy, transparency,
                                and user control for seamless, trustworthy document management.
                            </p>
                        </Col>
                        <Col md={2} className="text-center">
                            <ul className="footer-links">
                                <li><Link to="/" className="nav-link Black">Home</Link></li>
                                <li> <Link to="/login" className="nav-link">Login</Link></li>
                                <li><Link to="/signup" className="nav-link">Signup</Link></li>
                            </ul>
                        </Col>
                        <Col md={3} className="text-center">
                            <ul className="footer-contact">
                                <li>Email: doclock.rujul@gmail.com</li>
                                <li>Phone: +91 8828493222</li>
                                <li>VESIT, HAMC, Collector's Colony, Chembur, Mumbai - 400607</li>
                            </ul>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col md={12} className="text-center">
                            <p>&copy; 2024 DocLock. All rights reserved.</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </>
    );
}

export default Footer;
