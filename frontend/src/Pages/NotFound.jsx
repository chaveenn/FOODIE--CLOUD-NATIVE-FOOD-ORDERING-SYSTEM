import { Link } from 'react-router-dom'
//import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className="action-buttons">
        <Link to="/" className="home-button">Go to Home</Link>
        <Link to="/dashboard" className="dashboard-button">Go to Dashboard</Link>
      </div>
    </div>
  )
}

export default NotFound