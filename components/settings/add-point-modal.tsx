'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Loader2, MapPin } from 'lucide-react'
import { USER_TYPES, POA_TYPES } from '@/lib/db/schema'

interface AddPointModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  userType: number
  loading: boolean
}

export function AddPointModal({ isOpen, onClose, onSubmit, userType, loading }: AddPointModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    address_hint: '',
    fresh_capacity: '',
    dry_capacity: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.address_hint.trim()) newErrors.address_hint = 'Location hint is required'
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required'
    if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required'
    
    const lat = parseFloat(formData.latitude)
    const lng = parseFloat(formData.longitude)
    if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = 'Invalid latitude'
    if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = 'Invalid longitude'

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description || null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address_hint: formData.address_hint,
        fresh_capacity: formData.fresh_capacity ? parseFloat(formData.fresh_capacity) : 0,
        dry_capacity: formData.dry_capacity ? parseFloat(formData.dry_capacity) : 0,
      })
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        address_hint: '',
        fresh_capacity: '',
        dry_capacity: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Failed to submit:', error)
    }
  }

  const getPointTypeName = () => {
    return userType === USER_TYPES.PRODUCER 
      ? 'Point of Presence (PoP)' 
      : 'Point of Delivery (PoD)'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-brand/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Add {getPointTypeName()}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {userType === USER_TYPES.PRODUCER 
              ? 'Add a location where you produce or store mushrooms'
              : 'Add a location where you want to receive mushrooms'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Point Name *
                {errors.name && (
                  <span className="text-red-600 text-sm ml-2">{errors.name}</span>
                )}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value})
                  setErrors({...errors, name: ''})
                }}
                placeholder="e.g., Main Farm, Warehouse, Restaurant Kitchen"
                className="border-2 focus:border-brand"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: { target: { value: any } }) => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details about this point..."
                rows={3}
                className="border-2 focus:border-brand"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_hint">
                Location Hint *
                {errors.address_hint && (
                  <span className="text-red-600 text-sm ml-2">{errors.address_hint}</span>
                )}
              </Label>
              <Input
                id="address_hint"
                value={formData.address_hint}
                onChange={(e) => {
                  setFormData({...formData, address_hint: e.target.value})
                  setErrors({...errors, address_hint: ''})
                }}
                placeholder="e.g., Near Central Pharmacy, Behind Total Station"
                className="border-2 focus:border-brand"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Use nearby landmarks instead of exact addresses for security
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">
                  Latitude *
                  {errors.latitude && (
                    <span className="text-red-600 text-sm ml-2">{errors.latitude}</span>
                  )}
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => {
                    setFormData({...formData, latitude: e.target.value})
                    setErrors({...errors, latitude: ''})
                  }}
                  placeholder="e.g., 4.0656"
                  className="border-2 focus:border-brand"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">
                  Longitude *
                  {errors.longitude && (
                    <span className="text-red-600 text-sm ml-2">{errors.longitude}</span>
                  )}
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => {
                    setFormData({...formData, longitude: e.target.value})
                    setErrors({...errors, longitude: ''})
                  }}
                  placeholder="e.g., 9.7085"
                  className="border-2 focus:border-brand"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fresh_capacity">Fresh Capacity (kg)</Label>
                <Input
                  id="fresh_capacity"
                  type="number"
                  step="0.01"
                  value={formData.fresh_capacity}
                  onChange={(e) => setFormData({...formData, fresh_capacity: e.target.value})}
                  placeholder="e.g., 500"
                  className="border-2 focus:border-brand"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dry_capacity">Dry Capacity (kg)</Label>
                <Input
                  id="dry_capacity"
                  type="number"
                  step="0.01"
                  value={formData.dry_capacity}
                  onChange={(e) => setFormData({...formData, dry_capacity: e.target.value})}
                  placeholder="e.g., 200"
                  className="border-2 focus:border-brand"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="p-4 bg-brand/5 rounded-xl border border-brand/20">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand" />
                <div>
                  <p className="text-sm font-medium text-brand">Privacy Note</p>
                  <p className="text-xs text-gray-600">
                    Your exact location is protected. Others will only see your location hint.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-brand/20">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-brand hover:bg-brand/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `Add ${getPointTypeName()}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}