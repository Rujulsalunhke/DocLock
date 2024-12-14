import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import './index.css'; // Make sure this is the correct path to your CSS file


import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import CreateAsset from "./components/Create-asset";
import EditAsset from "./components/Edit-asset";
import AssetList from "./components/Asset-list";
import DeleteAsset from "./components/Delete-asset";
import TransferAsset from "./components/Transfer-asset";
import Login from './components/Login';
import Signup from './components/Signup';
import OwnerAssetList from './components/OwnerAssetList';
import Home from './components/Home';
import Footer from './components/Footer'; // Import Footer
import VerifyEmail from './components/VerifyEmail'; // Import VerifyEmail Component

function App() {
  const [loggedInOwner, setLoggedInOwner] = useState('');

  useEffect(() => {
    const storedOwner = localStorage.getItem('ownerName');
    if (storedOwner) {
      setLoggedInOwner(storedOwner);
    }
  }, []);

  const handleLogin = (ownerName) => {
    setLoggedInOwner(ownerName);
    localStorage.setItem('ownerName', ownerName);
  };

  const handleLogout = () => {
    setLoggedInOwner('');
    localStorage.removeItem('ownerName');
  };

  return (
    <div className="App">

      <div className="container-bg">
        <div className="circle-bg"></div>
      </div>

      <Router>
        <header className="App-header">
          <Navbar>
            <Container>
              <Navbar.Brand className="logo">
                <Link to="/asset-list" className="nav-link logo text-black">
                  <span className="logo">
                    <img className="doclock-logo" src="/logo-removebg-preview.png" alt="" />
                  </span>
                  <span className="text-black">DocLock</span>
                </Link>
              </Navbar.Brand>

              {/* <div className="VesLogo">
                <img src="/VESIT LOGO ICON.png" alt="" />
                <div className="CollegeName">
                  <h1>VES Institute of Technology</h1>
                  <p>Department of Electronics and Computer Science</p>
                </div>
              </div> */}

              <Nav className="ml-auto">
                {loggedInOwner ? (
                  <>
                    <Nav.Item>
                      <Link to="/create-asset" className="nav-link Black">Create Asset</Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link to="/asset-list" className="nav-link Black">All Assets</Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link to="/" className="nav-link Black">Home</Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link to="/" className="nav-link" onClick={handleLogout}>Logout</Link>
                    </Nav.Item>
                  </>
                ) : (
                  <>
                    <Nav.Item>
                      <Link to="/" className="nav-link Black">Home</Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link to="/login" className="nav-link">Login</Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Link to="/signup" className="nav-link">Signup</Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>

        <hr />

        <Container>
          <Row>
            <Col md={12}>
              <div className="wrapper">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/create-asset" component={CreateAsset} />
                  <Route exact path="/edit-asset/:id" component={EditAsset} />
                  <Route exact path="/asset-list" component={AssetList} />
                  <Route exact path="/delete-asset/:id" component={DeleteAsset} />
                  <Route exact path="/transfer-asset/:id" component={TransferAsset} />
                  <Route
                    exact
                    path="/login"
                    render={(props) => <Login {...props} onLogin={handleLogin} />}
                  />
                  <Route exact path="/signup" component={Signup} />
                  <Route
                    exact
                    path="/owner-asset-list"
                    render={(props) => loggedInOwner ? <OwnerAssetList ownerName={loggedInOwner} {...props} /> : <Redirect to="/login" />}
                  />
                  <Route exact path="/verify-email" component={VerifyEmail} /> {/* Add VerifyEmail Route */}
                </Switch>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Render Footer */}
        <Footer />
      </Router>

    </div>
  );
}

export default App;