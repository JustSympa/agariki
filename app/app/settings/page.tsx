'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  MapPin, 
  Bell, 
  Shield, 
  Save,
  Upload,
  Camera,
  LogOut,
  Plus,
  Trash2,
  Edit,
  X,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, changePassword } from '@/lib/store/slices/authSlice'
import { 
  fetchUserPoints, 
  createPoint, 
  updatePoint, 
  deletePoint 
} from '@/lib/store/slices/poaSlice'
import { AppDispatch, RootState } from '@/lib/store'
import { POA_TYPES, USER_TYPES } from '@/lib/db/schema'

// Add Point Modal Component
import { AddPointModal } from '@/components/settings/add-point-modal'
import { EditPointModal } from '@/components/settings/edit-point-modal'

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { points, loading: pointsLoading } = useSelector((state: RootState) => state.poa)
  
  const [activeTab, setActiveTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    bio: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Point management states
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPoint, setEditingPoint] = useState<any>(null)
  const [deletingPointId, setDeletingPointId] = useState<string | null>(null)

  // Initialize profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.fullName || '',
        phone: user.phone || '',
        bio: '' // Add bio field to users table if needed
      })
    }
  }, [user])

  // Fetch user's points when POA tab is active
  useEffect(() => {
    if (activeTab === 'poa' && user?.id) {
      dispatch(fetchUserPoints(user.id))
    }
  }, [activeTab, user?.id, dispatch])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      await dispatch(updateProfile({
        id: user.id,
        updates: profileForm
      })).unwrap()

      setProfileSuccess('Profile updated successfully!')
      setTimeout(() => setProfileSuccess(null), 3000)
    } catch (error: any) {
      setProfileError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    try {
      await dispatch(changePassword({
        newPassword: passwordForm.newPassword
      })).unwrap()

      setPasswordSuccess('Password changed successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
      setTimeout(() => setPasswordSuccess(null), 3000)
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  const handleAddPoint = async (pointData: any) => {
    if (!user) return
    
    try {
      await dispatch(createPoint({
        user_id: user.id,
        type: user.userType === USER_TYPES.PRODUCER ? POA_TYPES.POP : POA_TYPES.POD,
        ...pointData,
        is_active: true
      })).unwrap()
      
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to add point:', error)
    }
  }

  const handleEditPoint = async (id: string, updates: any) => {
    try {
      await dispatch(updatePoint({ id, updates })).unwrap()
      setEditingPoint(null)
    } catch (error) {
      console.error('Failed to update point:', error)
    }
  }

  const handleDeletePoint = async (id: string) => {
    try {
      await dispatch(deletePoint(id)).unwrap()
      setDeletingPointId(null)
    } catch (error) {
      console.error('Failed to delete point:', error)
    }
  }

  const getUserTypeName = (type: number) => {
    return type === USER_TYPES.PRODUCER ? 'Producer' : 'Consumer'
  }

  const getPoaTypeName = (type: number) => {
    return type === POA_TYPES.POP ? 'PoP (Point of Presence)' : 'PoD (Point of Delivery)'
  }

  if (!user) return null

  return (
    <div className="max-w-6xl mx-6 my-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-gray-600">Manage your account, preferences, and Points of Activity</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tabs navigation */}
        <TabsList className="grid grid-cols-4 gap-2 bg-brand/5 p-1 rounded-xl">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-brand">
            <User className="w-4 h-4 lg:mr-2 md:hidden lg:block" />
            <span className='hidden md:inline'>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="poa" className="data-[state=active]:bg-white data-[state=active]:text-brand">
            <MapPin className="w-4 h-4 lg:mr-2 md:hidden lg:block" />
            <span className='hidden md:inline'>Points of Activity</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-brand">
            <Bell className="w-4 h-4 lg:mr-2 md:hidden lg:block" />
            <span className='hidden md:inline'>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-brand">
            <Shield className="w-4 h-4 lg:mr-2 md:hidden lg:block" />
            <span className='hidden md:inline'>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand/20 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
              <div className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium">
                {getUserTypeName(user.userType)} Account
              </div>
            </div>

            {profileError && (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{profileError}</AlertDescription>
              </Alert>
            )}

            {profileSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{profileSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile picture - Read only */}
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-linear-to-br from-brand to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <button 
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-2 border-brand/20 rounded-full flex items-center justify-center hover:bg-brand/5 cursor-not-allowed opacity-50"
                      title="Profile picture upload coming soon"
                    >
                      <Camera className="w-4 h-4 text-brand" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Profile pictures coming soon</p>
                    <Button variant="outline" size="sm" className="gap-2" disabled>
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account type - Read only */}
              <div className="space-y-4">
                <Label>Account Type</Label>
                <div className="p-4 bg-linear-to-r from-brand/5 to-transparent rounded-xl border border-brand/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{getUserTypeName(user.userType)} Account</p>
                      <p className="text-sm text-gray-600">
                        {user.userType === USER_TYPES.PRODUCER 
                          ? 'You can add Points of Presence (PoP)' 
                          : 'You can add Points of Delivery (PoD)'
                        }
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Change Type
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                    className="border-2 focus:border-brand"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="border-2 focus:border-brand bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="border-2 focus:border-brand"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="userType">User Type</Label>
                  <Input
                    id="userType"
                    value={getUserTypeName(user.userType)}
                    disabled
                    className="border-2 focus:border-brand bg-gray-50 capitalize"
                  />
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <Label htmlFor="bio">Bio / Description</Label>
                  <textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    rows={3}
                    className="w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell others about your mushroom business..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-brand/20">
                <Button 
                  type="submit" 
                  className="gap-2 bg-brand hover:bg-brand/90"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Points of Activity Tab */}
        <TabsContent value="poa" className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand/20 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Points of Activity</h2>
                <p className="text-gray-600">
                  Manage your {user.userType === USER_TYPES.PRODUCER ? 'Points of Presence (PoP)' : 'Points of Delivery (PoD)'}
                </p>
              </div>
              <Button 
                className="gap-2 bg-brand hover:bg-brand/90"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4" />
                Add New Point
              </Button>
            </div>

            {/* Loading state */}
            {pointsLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!pointsLoading && points.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Points Yet</h3>
                <p className="text-gray-600 mb-6">
                  {user.userType === USER_TYPES.PRODUCER 
                    ? 'Add your first Point of Presence to start appearing on the map'
                    : 'Add your first Point of Delivery to show your demand'
                  }
                </p>
                <Button 
                  className="gap-2 bg-brand hover:bg-brand/90"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Point
                </Button>
              </div>
            )}

            {/* Points list */}
            {!pointsLoading && points.length > 0 && (
              <div className="space-y-4">
                {points.map((point) => (
                  <div
                    key={point.id}
                    className="p-4 rounded-xl border border-brand/20 hover:bg-brand/5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          point.type === POA_TYPES.POP ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <MapPin className={`w-6 h-6 ${
                            point.type === POA_TYPES.POP ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-foreground">{point.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              point.type === POA_TYPES.POP 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {getPoaTypeName(point.type)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              point.isActive 
                                ? 'bg-brand/10 text-brand' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {point.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{point.addressHint}</p>
                          <div className="flex gap-4">
                            <div>
                              <span className="text-sm text-gray-500">Fresh Capacity:</span>
                              <span className="ml-2 font-medium text-foreground">
                                {point.freshCapacity}kg
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Dry Capacity:</span>
                              <span className="ml-2 font-medium text-foreground">
                                {point.dryCapacity}kg
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setEditingPoint(point)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeletingPointId(point.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {!pointsLoading && points.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-brand/20">
                <div className="p-4 bg-linear-to-r from-green-50 to-transparent rounded-xl border border-green-100">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-green-700">{points.length}</p>
                </div>
                <div className="p-4 bg-linear-to-r from-brand/5 to-transparent rounded-xl border border-brand/20">
                  <p className="text-sm text-gray-600">Active Points</p>
                  <p className="text-2xl font-bold text-foreground">
                    {points.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="p-4 bg-linear-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                  <p className="text-sm text-gray-600">Total Fresh Capacity</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {points.reduce((sum, p) => sum + (parseFloat(p.freshCapacity?.toString() || '0')), 0)}kg
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Notifications Tab (Placeholder - for impressing teacher 😂) */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand/20 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              {[
                { title: 'New Messages', description: 'Get notified when you receive new chat messages', enabled: true },
                { title: 'Demand Alerts', description: 'Receive alerts about new demand in your area', enabled: true },
                { title: 'Price Updates', description: 'Get notified about market price changes', enabled: true },
                { title: 'Security Alerts', description: 'Important security and login notifications', enabled: true },
                { title: 'Weekly Reports', description: 'Receive weekly activity reports', enabled: false }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-brand/20 hover:bg-brand/5 transition-all duration-200">
                  <div>
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id={`notification-${index}`}
                      defaultChecked={item.enabled}
                      disabled
                    />
                    <label
                      htmlFor={`notification-${index}`}
                      className="block w-12 h-6 rounded-full cursor-not-allowed bg-gray-300 transition-colors duration-200 has-checked:bg-brand"
                    >
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 has-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-white rounded-2xl border border-brand/20 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              {/* Change Password Form */}
              {showPasswordForm ? (
                <div className="p-4 rounded-xl border border-brand/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">Change Password</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordError(null)
                        setPasswordSuccess(null)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {passwordError && (
                    <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {passwordSuccess && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">{passwordSuccess}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handlePasswordChange}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password *</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="border-2 focus:border-brand"
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="border-2 focus:border-brand"
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowPasswordForm(false)
                            setPasswordForm({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            })
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-brand hover:bg-brand/90"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-brand/20">
                  <h3 className="font-medium text-foreground mb-2">Change Password</h3>
                  <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    <Shield className="w-4 h-4" />
                    Change Password
                  </Button>
                </div>
              )}

              {/* 2FA Button (Placeholder - for impressing teacher 😂) */}
              <div className="p-4 rounded-xl border border-brand/20">
                <h3 className="font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                <Button variant="outline" className="gap-2" disabled>
                  <Shield className="w-4 h-4" />
                  Enable 2FA (Coming Soon)
                </Button>
              </div>

              {/* Delete Account (Placeholder - for impressing teacher 😂) */}
              <div className="p-4 rounded-xl border border-red-100 bg-red-50">
                <h3 className="font-medium text-red-700 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back.</p>
                <Button variant="outline" className="gap-2 text-red-600 border-red-300 hover:bg-red-50" disabled>
                  <Trash2 className="w-4 h-4" />
                  Delete Account (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sign out */}
      <div className="mt-8 p-6 bg-linear-to-r from-red-50 to-transparent rounded-2xl border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-red-700">Sign Out</h3>
            <p className="text-sm text-red-600">Sign out of your account on this device</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
            onClick={handleSignOut}
            disabled={loading}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Add Point Modal */}
      {showAddModal && (
        <AddPointModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPoint}
          userType={user.userType}
          loading={loading}
        />
      )}

      {/* Edit Point Modal */}
      {editingPoint && (
        <EditPointModal
          point={editingPoint}
          onClose={() => setEditingPoint(null)}
          onSubmit={(updates) => handleEditPoint(editingPoint.id, updates)}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingPointId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Point</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this point? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletingPointId(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDeletePoint(deletingPointId)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}