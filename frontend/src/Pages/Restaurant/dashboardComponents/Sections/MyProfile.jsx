import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope,  FaKey, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import axios from 'axios'
import './MyProfile.css'

const MyProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/users/get-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setProfile(res.data)
        setFormData(res.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEdit = () => setEditing(true)

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
  }

  const handleSave = async () => {
    // Call API to update profile - not yet implemented on backend
    setProfile(formData)
    setEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  if (loading) return <div className="loading">Loading profile...</div>

  return (
    <div className="my-profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {editing ? (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              <FaSave /> Save
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        

        <div className="profile-details">
          <div className="card profile-info">
            <h3><FaUser /> Personal Information</h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.name}</p>
                )}
              </div>

              <div className="info-field">
                <label>NIC</label>
                <p>{profile.nic}</p>
              </div>

              <div className="info-field">
                <label>Role</label>
                <p>{profile.role}</p>
              </div>

              <div className="info-field">
                <label>Member Since</label>
                <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="card contact-info">
            <h3><FaEnvelope /> Contact Information</h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Email</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              <div className="info-field">
                <label>Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>

              <div className="info-field">
                <label>Address</label>
                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
