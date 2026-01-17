'use client'

import React, { useState, useEffect } from 'react'
import { 
 Settings,
 Store,
 CreditCard,
 Truck,
 Bell,
 Shield,
 Globe,
 Mail,
 Phone,
 MapPin,
 Save,
 AlertCircle
} from 'lucide-react'

interface BusinessSettings {
 business_name: string
 business_email: string
 business_phone: string
 business_address: string
 business_city: string
 business_postal_code: string
 whatsapp_number: string
 currency: string
 tax_rate: number
 shipping_fee: number
 free_shipping_threshold: number
 payfast_merchant_id: string
 payfast_merchant_key: string
 payfast_sandbox: boolean
 email_notifications: boolean
 sms_notifications: boolean
 low_stock_threshold: number
}

export default function AdminSettings() {
 const [settings, setSettings] = useState<BusinessSettings>({
   business_name: 'Luthando Fragrances',
   business_email: 'info@luthandofragrances.co.za',
   business_phone: '+27 12 345 6789',
   business_address: '123 Main Street',
   business_city: 'Johannesburg',
   business_postal_code: '2000',
   whatsapp_number: '27123456789',
   currency: 'ZAR',
   tax_rate: 15,
   shipping_fee: 100,
   free_shipping_threshold: 500,
   payfast_merchant_id: '',
   payfast_merchant_key: '',
   payfast_sandbox: true,
   email_notifications: true,
   sms_notifications: false,
   low_stock_threshold: 5
 })
 
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [message, setMessage] = useState({ type: '', text: '' })
 const [activeTab, setActiveTab] = useState('business')

 useEffect(() => {
   loadSettings()
 }, [])

 const loadSettings = async () => {
   try {
     // In a real app, load from database
     // For now, using localStorage or defaults
     const savedSettings = localStorage.getItem('business_settings')
     if (savedSettings) {
       setSettings(JSON.parse(savedSettings))
     }
   } catch (error) {
     console.error('Error loading settings:', error)
   } finally {
     setLoading(false)
   }
 }

 const saveSettings = async () => {
   try {
     setSaving(true)
     setMessage({ type: '', text: '' })

     // In a real app, save to database
     // For now, using localStorage
     localStorage.setItem('business_settings', JSON.stringify(settings))

     setMessage({ type: 'success', text: 'Settings saved successfully!' })
     setTimeout(() => setMessage({ type: '', text: '' }), 3000)
   } catch (error) {
     console.error('Error saving settings:', error)
     setMessage({ type: 'error', text: 'Failed to save settings' })
   } finally {
     setSaving(false)
   }
 }

 const handleChange = (field: keyof BusinessSettings, value: any) => {
   setSettings(prev => ({
     ...prev,
     [field]: value
   }))
 }

 if (loading) {
   return (
     <div className="flex items-center justify-center h-64">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
     </div>
   )
 }

 return (
   <div className="space-y-6">
     {/* Header */}
     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
       <div>
         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
         <p className="text-gray-600">Manage your business settings and preferences</p>
       </div>
       
       <button 
         onClick={saveSettings}
         disabled={saving}
         className="btn btn-primary flex items-center gap-2"
       >
         <Save size={16} />
         {saving ? 'Saving...' : 'Save Settings'}
       </button>
     </div>

     {/* Messages */}
     {message.text && (
       <div className={`rounded-lg p-4 flex items-center gap-2 ${
         message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
       }`}>
         <AlertCircle size={16} />
         {message.text}
       </div>
     )}

     {/* Tabs */}
     <div className="border-b border-gray-200">
       <nav className="-mb-px flex space-x-8">
         {[
           { id: 'business', label: 'Business Info', icon: Store },
           { id: 'payment', label: 'Payment', icon: CreditCard },
           { id: 'shipping', label: 'Shipping', icon: Truck },
           { id: 'notifications', label: 'Notifications', icon: Bell },
           { id: 'inventory', label: 'Inventory', icon: Shield }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
               activeTab === tab.id
                 ? 'border-blue-500 text-blue-600'
                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
             }`}
           >
             <tab.icon size={16} />
             {tab.label}
           </button>
         ))}
       </nav>
     </div>

     {/* Tab Content */}
     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
       {activeTab === 'business' && (
         <div className="space-y-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Business Name
               </label>
               <input
                 type="text"
                 value={settings.business_name}
                 onChange={(e) => handleChange('business_name', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Business Email
               </label>
               <input
                 type="email"
                 value={settings.business_email}
                 onChange={(e) => handleChange('business_email', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Business Phone
               </label>
               <input
                 type="tel"
                 value={settings.business_phone}
                 onChange={(e) => handleChange('business_phone', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 WhatsApp Number
               </label>
               <input
                 type="tel"
                 value={settings.whatsapp_number}
                 onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="27123456789"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Business Address
               </label>
               <input
                 type="text"
                 value={settings.business_address}
                 onChange={(e) => handleChange('business_address', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 City
               </label>
               <input
                 type="text"
                 value={settings.business_city}
                 onChange={(e) => handleChange('business_city', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Postal Code
               </label>
               <input
                 type="text"
                 value={settings.business_postal_code}
                 onChange={(e) => handleChange('business_postal_code', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Currency
               </label>
               <select
                 value={settings.currency}
                 onChange={(e) => handleChange('currency', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="ZAR">ZAR - South African Rand</option>
                 <option value="USD">USD - US Dollar</option>
                 <option value="EUR">EUR - Euro</option>
               </select>
             </div>
           </div>
         </div>
       )}

       {activeTab === 'payment' && (
         <div className="space-y-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 PayFast Merchant ID
               </label>
               <input
                 type="text"
                 value={settings.payfast_merchant_id}
                 onChange={(e) => handleChange('payfast_merchant_id', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="10000100"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 PayFast Merchant Key
               </label>
               <input
                 type="text"
                 value={settings.payfast_merchant_key}
                 onChange={(e) => handleChange('payfast_merchant_key', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="46f0cd694581a"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Tax Rate (%)
               </label>
                <input
                  type="number"
                  value={settings.tax_rate === 0 ? '' : settings.tax_rate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleChange('tax_rate', 0);
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                        handleChange('tax_rate', numValue);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="15"
                />
             </div>

             <div>
               <label className="flex items-center gap-2">
                 <input
                   type="checkbox"
                   checked={settings.payfast_sandbox}
                   onChange={(e) => handleChange('payfast_sandbox', e.target.checked)}
className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
/>
<span className="text-sm font-medium text-gray-700">Use PayFast Sandbox (Testing)</span>
</label>
</div>
</div><div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Payment Gateway Information</h4>
          <p className="text-sm text-blue-800">
            PayFast is the recommended payment gateway for South African businesses. 
            Get your merchant credentials from your PayFast dashboard.
          </p>
        </div>
      </div>
    )}

    {activeTab === 'shipping' && (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Shipping Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
               <input
                 type="number"
                 value={settings.shipping_fee === 0 ? '' : settings.shipping_fee}
                 onChange={(e) => {
                   const value = e.target.value;
                   if (value === '') {
                     handleChange('shipping_fee', 0);
                   } else {
                     const numValue = parseFloat(value);
                     if (!isNaN(numValue) && numValue >= 0) {
                       handleChange('shipping_fee', numValue);
                     }
                   }
                 }}
                 className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 min="0"
                 step="1"
                 placeholder="100"
               />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Shipping Threshold
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
               <input
                 type="number"
                 value={settings.free_shipping_threshold === 0 ? '' : settings.free_shipping_threshold}
                 onChange={(e) => {
                   const value = e.target.value;
                   if (value === '') {
                     handleChange('free_shipping_threshold', 0);
                   } else {
                     const numValue = parseFloat(value);
                     if (!isNaN(numValue) && numValue >= 0) {
                       handleChange('free_shipping_threshold', numValue);
                     }
                   }
                 }}
                 className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 min="0"
                 step="1"
                 placeholder="500"
               />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Orders above this amount qualify for free shipping
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Shipping Zones</h4>
          <p className="text-sm text-gray-600 mb-4">
            Configure different shipping rates for different regions
          </p>
          <button className="btn btn-secondary">
            Configure Shipping Zones
          </button>
        </div>
      </div>
    )}

    {activeTab === 'notifications' && (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => handleChange('email_notifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <p className="text-xs text-gray-500">Receive order notifications via email</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.sms_notifications}
              onChange={(e) => handleChange('sms_notifications', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
              <p className="text-xs text-gray-500">Receive order notifications via SMS</p>
            </div>
          </label>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Customer Notifications</h4>
          <p className="text-sm text-gray-600 mb-4">
            Configure automated emails sent to customers
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm">Order confirmation email</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm">Shipping notification email</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm">Delivery confirmation email</span>
            </label>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'inventory' && (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={settings.low_stock_threshold === 0 ? '' : settings.low_stock_threshold}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleChange('low_stock_threshold', 0);
                } else {
                  const intValue = parseInt(value);
                  if (!isNaN(intValue) && intValue >= 1) {
                    handleChange('low_stock_threshold', intValue);
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              placeholder="5"
            />
            <p className="text-xs text-gray-500 mt-1">
              Products below this quantity will be marked as low stock
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Stock Management</h4>
          <p className="text-sm text-yellow-800 mb-4">
            Enable automatic stock tracking and notifications
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-yellow-600" />
              <span className="text-sm">Track stock levels</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-yellow-600" />
              <span className="text-sm">Prevent overselling</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-yellow-600" />
              <span className="text-sm">Low stock email alerts</span>
            </label>
          </div>
        </div>
      </div>
    )}
  </div>
</div>)
}
