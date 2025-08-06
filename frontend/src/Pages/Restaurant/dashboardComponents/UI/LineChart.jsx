import { useEffect, useRef } from 'react'
import './LineChart.css'

const LineChart = () => {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    
    // Sample data
    const data = [340, 480, 320, 580, 420, 650, 590]
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    
    // Find min and max values
    const maxValue = Math.max(...data) * 1.1 // Add 10% padding
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
      
      // Draw y-axis labels
      const labelValue = Math.round(maxValue - (maxValue / gridLines) * i)
      ctx.fillStyle = 'rgba(4, 0, 0, 0.6)'
      ctx.font = '12px Arial'
      ctx.textAlign = 'right'
      ctx.fillText('$' + labelValue, padding - 10, y + 4)
    }
    
    // Draw x-axis labels
    ctx.textAlign = 'center'
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (chartWidth / (labels.length - 1)) * i
      ctx.fillText(labels[i], x, canvas.height - padding / 2)
    }
    
    // Draw line
    ctx.strokeStyle = '#2d3238'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    
    ctx.stroke()
    
    // Draw gradient under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    gradient.addColorStop(0, 'rgba(10, 147, 150, 0.3)')
    gradient.addColorStop(1, 'rgba(10, 147, 150, 0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(padding, padding + chartHeight)
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight
      ctx.lineTo(x, y)
    }
    
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.closePath()
    ctx.fill()
    
    // Draw data points
    ctx.fillStyle = '#0A9396'
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(10, 147, 150, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [])

  return (
    <div className="line-chart-container">
      <canvas ref={canvasRef} className="line-chart"></canvas>
    </div>
  )
}

export default LineChart