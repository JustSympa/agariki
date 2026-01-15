'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Filter, 
  MapPin, 
  Users, 
  Thermometer,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export function MapSidebar() {
  const [filtersOpen, setFiltersOpen] = useState(true)

  return (
    <div className="lg:w-80">
      <div className="bg-white rounded-2xl border border-brand/20 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-brand/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Map Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="text-brand hover:text-brand/80"
            >
              {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          <div className="relative">
            <Input
              placeholder="Search location..."
              className="pl-10 border-2 focus:border-brand"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Filters content */}
        {filtersOpen && (
          <div className="p-6 space-y-6">
            {/* Point type filter */}
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand" />
                Point Type
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Show Producers (PoP)', color: 'bg-green-500', defaultChecked: true },
                  { label: 'Show Consumers (PoD)', color: 'bg-blue-500', defaultChecked: true },
                  { label: 'Show High Demand', color: 'bg-red-500', defaultChecked: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`filter-${index}`}
                      defaultChecked={item.defaultChecked}
                      className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-full`} />
                      <label htmlFor={`filter-${index}`} className="text-sm text-gray-700">
                        {item.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity filter */}
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-brand" />
                Capacity Range
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Fresh Capacity (kg)</label>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">0</span>
                    <span className="text-xs text-gray-500">1000+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    defaultValue="500"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand"
                  />
                </div>
              </div>
            </div>

            {/* Active users */}
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                Active Nearby
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'John Mushroom', type: 'Producer', distance: '2km' },
                  { name: 'Alice Fungus', type: 'Producer', distance: '5km' },
                  { name: 'Market Restaurant', type: 'Consumer', distance: '1km' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-brand/10 hover:bg-brand/5 transition-colors">
                    <div className={`w-8 h-8 ${user.type === 'Producer' ? 'bg-green-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                      <span className={`text-xs font-medium ${user.type === 'Producer' ? 'text-green-700' : 'text-blue-700'}`}>
                        {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.type} • {user.distance} away</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-brand hover:text-brand/80">
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-brand/20">
              <Button variant="outline" className="flex-1">
                Clear Filters
              </Button>
              <Button className="flex-1 bg-brand hover:bg-brand/90">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="mt-6 p-6 bg-linear-to-r from-brand/5 to-transparent rounded-2xl border border-brand/20">
        <h4 className="font-medium text-foreground mb-3">Map Tips</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5" />
            Click on any point to see details
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5" />
            Long press to add your own point
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5" />
            Red areas indicate high demand
          </li>
        </ul>
      </div>
    </div>
  )
}