import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function VerifyEmail() {
    const location = useLocation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (token && email) {
            axios.get(`http://localhost:5000/verify-email?token=${token}&email=${email}`)
                .then(response => {
                    setMessage(response.data);
                })
                .catch(error => {
                    setMessage('Failed to verify email: ' + error.message);
                });
        } else {
            setMessage('Invalid verification link.');
        }
    }, [location]);

    return (
        <div>
            <h2>Email Verification</h2>
            <p>{message}</p>
        </div>
    );
}

export default VerifyEmail;

