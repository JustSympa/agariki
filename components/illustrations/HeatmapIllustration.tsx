export function HeatmapIllustration() {
  return (
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 bg-linear-to-r from-brand/10 to-brand/5 rounded-2xl" />
      
      {/* Cameroon simplified outline */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full p-4"
        style={{ opacity: 0.3 }}
      >
        <path
          d="M20,30 L40,25 L50,35 L60,30 L70,40 L65,60 L55,70 L40,65 L30,75 L25,60 L20,45 Z"
          fill="#c6613f"
          fillOpacity="0.1"
          stroke="#c6613f"
          strokeWidth="0.5"
        />
      </svg>
      
      {/* Heat points */}
      {[25, 35, 45, 55, 65, 75].map((left, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-red-500/60 rounded-full animate-pulse"
          style={{ 
            left: `${left}px`, 
            top: `${40 + Math.sin(i) * 30}px`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
      
      {/* Producer points */}
      {[30, 40, 50, 60, 70].map((left, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 bg-green-500/70 rounded-full border-2 border-green-600"
          style={{ 
            left: `${left}px`, 
            top: `${60 + Math.cos(i) * 20}px` 
          }}
        />
      ))}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
        <line
          x1="30"
          y1="45"
          x2="50"
          y2="65"
          stroke="#c6613f"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <line
          x1="40"
          y1="50"
          x2="60"
          y2="70"
          stroke="#c6613f"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <line
          x1="50"
          y1="55"
          x2="70"
          y2="75"
          stroke="#c6613f"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
      </svg>
    </div>
  )
}