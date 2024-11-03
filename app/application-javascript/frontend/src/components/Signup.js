import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';  // Import withRouter from react-router-dom
import './css/Signup.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      loading: false  // Add loading state
    };
  }

  // Handle input changes
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Handle form submission
  handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = this.state;

    this.setState({ loading: true });  // Set loading to true when form submission starts

    try {
      // Make API call to create a new user
      const response = await fetch('http://localhost:4000/users/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      });

      if (response.ok) {
        // Parse the JSON response
        const result = await response.json();
        alert('User created successfully!');
        console.log('Created user:', result);

        // Redirect to the login page after successful sign-up
        this.props.history.push('/login');
      } else {
        const error = await response.text();
        alert('Error: ' + error);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Error: ' + error.message);
    } finally {
      this.setState({ loading: false });  // Set loading to false once the API call completes
    }
  };

  render() {
    const { loading } = this.state;  // Destructure loading state

    return (
      <form onSubmit={this.handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', maxWidth: '400px', margin: '50px auto', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ textAlign: 'center', color: '#4e3e8c', fontFamily: 'Arial, sans-serif', marginBottom: '20px' }}>Sign Up</h3>

        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Enter username"
            value={this.state.username}
            onChange={this.handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            value={this.state.password}
            onChange={this.handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: '#4e3e8c', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', width: '100%' }}
            disabled={loading}  // Disable the button when loading
          >
            {loading ? 'Signing Up...' : 'Sign Up'}  {/* Show loading text */}
          </button>
        </div>

        <p className="forgot-password text-right" style={{ textAlign: 'center', marginTop: '15px' }}>
          Already registered? <a href="/login" style={{ color: '#4e3e8c', textDecoration: 'none' }}>Login</a>
        </p>
      </form>
    );
  }
}

// Wrap the SignUp component with withRouter to access history
export default withRouter(SignUp);
