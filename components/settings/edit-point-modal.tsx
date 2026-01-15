'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Loader2, MapPin } from 'lucide-react'
import { PointOfActivity, POA_TYPES } from '@/lib/db/schema'

interface EditPointModalProps {
  point: PointOfActivity
  onClose: () => void
  onSubmit: (updates: any) => Promise<void>
  loading: boolean
}

export function EditPointModal({ point, onClose, onSubmit, loading }: EditPointModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address_hint: '',
    fresh_capacity: '',
    dry_capacity: '',
    is_active: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (point) {
      setFormData({
        name: point.name || '',
        description: point.description || '',
        address_hint: point.addressHint || '',
        fresh_capacity: point.freshCapacity?.toString() || '',
        dry_capacity: point.dryCapacity?.toString() || '',
        is_active: point.isActive || true,
      })
    }
  }, [point])

  if (!point) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.address_hint.trim()) newErrors.address_hint = 'Location hint is required'
    
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
        address_hint: formData.address_hint,
        fresh_capacity: formData.fresh_capacity ? parseFloat(formData.fresh_capacity) : 0,
        dry_capacity: formData.dry_capacity ? parseFloat(formData.dry_capacity) : 0,
        is_active: formData.is_active,
      })
    } catch (error) {
      console.error('Failed to update:', error)
    }
  }

  const getPointTypeName = () => {
    return point.type === POA_TYPES.POP 
      ? 'Point of Presence (PoP)' 
      : 'Point of Delivery (PoD)'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-brand/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Edit {getPointTypeName()}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Update your point information
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
                className="border-2 focus:border-brand"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                className="border-2 focus:border-brand"
                disabled={loading}
              />
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
                  className="border-2 focus:border-brand"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, is_active: true})}
                  className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                    formData.is_active 
                      ? 'border-brand bg-brand/10 text-brand font-medium' 
                      : 'border-gray-200 hover:border-brand/30'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, is_active: false})}
                  className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                    !formData.is_active 
                      ? 'border-yellow-300 bg-yellow-50 text-yellow-700 font-medium' 
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Location (Read Only)</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Latitude: {point.latitude}</p>
                  <p>Longitude: {point.longitude}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Location coordinates cannot be changed for security reasons.
                </p>
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
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}