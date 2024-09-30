import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import CreateAsset from "./components/Create-asset";
import EditAsset from "./components/Edit-asset";
import AssetList from "./components/Asset-list";
import DeleteAsset from "./components/Delete-asset";
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>
                <Link to="/asset-list" className="nav-link">
                  DocLock
                </Link>
              </Navbar.Brand>

              <Nav className="ml-auto">
                <Nav.Item>
                  <Link to="/create-asset" className="nav-link">
                    Create Asset
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/asset-list" className="nav-link">
                    All Assets
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to="/signup" className="nav-link">
                    Signup
                  </Link>
                </Nav.Item>
              </Nav>
            </Container>
          </Navbar>
        </header>

        <Container>
          <Row>
            <Col md={12}>
              <div className="wrapper">
                <Switch>
                  <Route exact path="/" component={CreateAsset} />
                  <Route exact path="/create-asset" component={CreateAsset} />
                  <Route exact path="/edit-asset/:id" component={EditAsset} />
                  <Route exact path="/asset-list" component={AssetList} />
                  <Route exact path="/delete-asset/:id" component={DeleteAsset} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/signup" component={Signup} />
                </Switch>
              </div>
            </Col>
          </Row>
        </Container>
      </Router>
    </div>
  );
}

export default App;
