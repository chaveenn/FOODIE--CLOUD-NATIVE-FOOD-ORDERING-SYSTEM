import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Location.css'

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const Location = () => {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:8000/restaurants/my-restaurants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const restaurant = response.data.restaurants[0]
        if (restaurant) {
          setRestaurant(restaurant)
        } else {
          setRestaurant(null)
        }
      } catch (error) {
        console.error("Failed to fetch restaurant location:", error)
        setRestaurant(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLocationData()
  }, [])

  const formatAddress = (address) => {
    if (!address) return "Address not available"
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
  }

  if (loading) return <div className="loading">Loading location information...</div>
  if (!restaurant) return <div className="loading">No restaurant location found.</div>

  const lat = restaurant.location?.latitude || 0
  const lng = restaurant.location?.longitude || 0

  return (
    <div className="location-container">
      <div className="location-header">
        <h2>
          <FaMapMarkedAlt /> Restaurant Location
        </h2>
      </div>

      <div className="location-content">
        <div className="address-card">
          <h3>Address Information</h3>
          <p className="full-address">{(restaurant.address)}</p>
          <div className="coords">
            <span>Coordinates: </span>
            <span>{lat}, {lng}</span>
          </div>
        </div>


        <div className="map-card">
          <h3>Map View</h3>
          <div className="map-container">
            <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={true} style={{ height: "300px", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  {restaurant.name}<br />{formatAddress(restaurant.address)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Location
