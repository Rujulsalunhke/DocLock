import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner for loading state
import { withRouter } from 'react-router-dom';
// import axios from 'axios';
import "./css/Login.css"
import "./css/Home.css"

const Home = () => {
    return (
        <div>

            <div className="services-container home-service">

                <h1>DocLock Provides these services</h1>

                <div className="flexbox-services">
                    {/* Service 1 */}
                    <div className="service-box gradient-bg">
                        <h2>Blockchain Security</h2>
                        <p>We ensure that your documents are stored in a secure, decentralized manner using blockchain technology to prevent unauthorized access and tampering.</p>
                    </div>

                    {/* Service 2 */}
                    <div className="service-box gradient-bg">
                        <h2>Document Encryption</h2>
                        <p>All your sensitive documents are encrypted, ensuring that only authorized users can access or view them with the highest level of security.</p>
                    </div>

                    {/* Service 3 */}
                    <div className="service-box gradient-bg">
                        <h2>Decentralized Storage</h2>
                        <p>Your documents are stored across a distributed network, making sure there is no single point of failure, ensuring greater data availability and security.</p>
                    </div>
                </div>
            </div>

            <hr />
            {/* New Section: "About Us" */}
            <div className="about-container gradient-bg">

                <div className="about-content">
                    <div className="about-text">
                        <h1>About Us</h1>
                        <p>DocLock uses blockchain technology to provide secure, decentralized storage for sensitive documents. We prioritize privacy, transparency, and user control, ensuring documents remain tamper-proof, protected, and accessible only to authorized individuals. Trusted by individuals and organizations alike for reliable document security.</p>
                    </div>
                    <div className="about-image">
                        <img src="/serviceback.png" alt="About Us" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
