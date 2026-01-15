'use client'

export function MapContainer() {
  return (
    <div className="relative h-[500px] bg-linear-to-br from-brand/5 to-gray-50">
      {/* Placeholder map */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Map Integration</h3>
          <p className="text-gray-600 max-w-md">
            This area will display an interactive Mapbox map showing Points of Activity and heatmaps.
            Connect your Mapbox token to enable the map.
          </p>
        </div>
      </div>

      {/* Simulated map elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-500/70 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-red-500/60 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-red-500/80 rounded-full animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-500/70 rounded-full border-2 border-green-600" />
      <div className="absolute bottom-1/3 left-1/2 w-7 h-7 bg-green-500/70 rounded-full border-2 border-green-600" />
    </div>
  )
}