import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // For React Router v5
import './css/Signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const history = useHistory();
  let isMounted = true;

  // Validate form inputs
  const validateInputs = () => {
    const { username, email, password } = formData;
    const newErrors = {};

    if (!username.trim()) newErrors.username = 'Username is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Please enter a valid email.';
    if (!password || password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Function to send OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/users/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setIsOtpSent(true);
        alert('OTP sent to your email!');
      } else {
        const errorMsg = await response.text();
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError('OTP is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/users/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (response.ok) {
        alert('OTP verified successfully!');
        handleSubmit();
      } else {
        const errorMsg = await response.text();
        setOtpError(errorMsg);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Something went wrong. Please try again later.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/users/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('User created successfully! Please verify your email.');
        history.push('/login');
      } else {
        const errorMsg = await response.text();
        alert(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h3 className="signup-title">Sign Up</h3>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
        {errors.username && <small className="error">{errors.username}</small>}
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {errors.email && <small className="error">{errors.email}</small>}
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        {errors.password && <small className="error">{errors.password}</small>}
      </div>
      {isOtpSent && (
        <div className="form-group">
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          {otpError && <small className="error">{otpError}</small>}
          <button type="button" onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </div>
      )}
      {!isOtpSent && (
        <button type="button" onClick={sendOtp} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      )}
      {isOtpSent && (
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      )}
      <p>
        Already registered? <a href="/login">Login</a>
      </p>
    </form>
  );
};

export default SignUp;