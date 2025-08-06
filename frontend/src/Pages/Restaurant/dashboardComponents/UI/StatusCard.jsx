import './StatusCard.css'

const StatusCard = ({ title, value, icon, color }) => {
  return (
    <div className="status-card">
      <div className="card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  )
}

export default StatusCard