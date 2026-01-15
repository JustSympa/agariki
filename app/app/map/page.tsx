'use client'

import { useEffect, useState } from 'react'
import { MapContainer } from '@/components/map/map-container'
import { MapSidebar } from '@/components/map/map-sidebar'
import { Button } from '@/components/ui/button'
import { 
  Filter, 
  Layers, 
  Search, 
  MapPin, 
  Users,
  ZoomIn,
  ZoomOut,
  Navigation,
  Target
} from 'lucide-react'

export default function MapPage() {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showProducers, setShowProducers] = useState(true)
  const [showConsumers, setShowConsumers] = useState(true)
  const [mapView, setMapView] = useState<'demand' | 'supply'>('demand')

  return (
    <div className="flex flex-col lg:flex-row gap-6 mx-6 mt-6">
      {/* Main map area */}
      <div className="flex-1">
        {/* Map header */}
        <div className="bg-white rounded-2xl border border-brand/20 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Interactive Map</h1>
              <p className="text-gray-600">Visualize fungus demand and supply in real-time</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={mapView === 'demand' ? 'default' : 'outline'}
                onClick={() => setMapView('demand')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Demand View
              </Button>
              <Button
                variant={mapView === 'supply' ? 'default' : 'outline'}
                onClick={() => setMapView('supply')}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Supply View
              </Button>
            </div>
          </div>
        </div>

        {/* Map container */}
        <div className="bg-white rounded-2xl border border-brand/20 shadow-lg overflow-hidden">
          {/* Map controls */}
          <div className="p-4 border-b border-brand/20 bg-linear-to-r from-brand/5 to-transparent">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/70 rounded-full" />
                <span className="text-sm text-gray-700">High Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500/70 rounded-full" />
                <span className="text-sm text-gray-700">Medium Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500/70 rounded-full" />
                <span className="text-sm text-gray-700">Producers</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="w-4 h-4" />
                  Search Area
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Target className="w-4 h-4" />
                  My Location
                </Button>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <MapContainer />

          {/* Map bottom controls */}
          <div className="p-4 border-t border-brand/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showHeatmap ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="gap-2"
                >
                  <Layers className="w-4 h-4" />
                  {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
                </Button>
                <Button
                  variant={showProducers ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowProducers(!showProducers)}
                  className="gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Producers
                </Button>
                <Button
                  variant={showConsumers ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowConsumers(!showConsumers)}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Consumers
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-brand/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Producers</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-brand/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Demand Points</p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-brand/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Demand Zones</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-brand" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map sidebar for filters and details */}
      <MapSidebar />
    </div>
  )
}