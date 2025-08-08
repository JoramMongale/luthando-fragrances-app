import crypto from 'crypto'

export interface PayFastData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first?: string
  name_last?: string
  email_address?: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description?: string
  custom_str1?: string
  custom_str2?: string
  custom_str3?: string
  custom_str4?: string
  custom_str5?: string
}

export interface PayFastConfig {
  orderId: string
  amount: number
  customerEmail: string
  customerName: string
  items: Array<{ name: string; quantity: number }>
}

export const generatePayFastForm = (orderData: PayFastConfig) => {
  try {
    const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID
    const merchantKey = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY
    const sandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === 'true'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (!merchantId || !merchantKey) {
      throw new Error('PayFast credentials not configured')
    }

    const payFastData: PayFastData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/payment/success?order_id=${orderData.orderId}`,
      cancel_url: `${baseUrl}/payment/cancel?order_id=${orderData.orderId}`,
      notify_url: `${baseUrl}/api/payfast/notify`,
      email_address: orderData.customerEmail,
      name_first: orderData.customerName.split(' ')[0] || 'Customer',
      name_last: orderData.customerName.split(' ').slice(1).join(' ') || '',
      m_payment_id: orderData.orderId,
      amount: orderData.amount.toFixed(2),
      item_name: `Luthando Fragrances Order #${orderData.orderId.substring(0, 8)}`,
      item_description: orderData.items.map(item => `${item.name} (${item.quantity})`).join(', ').substring(0, 100),
      custom_str1: orderData.orderId,
    }

    // Generate signature
    const signature = generateSignature(payFastData)
    
    const actionUrl = sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process'

    return {
      success: true,
      actionUrl,
      formData: { ...payFastData, signature }
    }
  } catch (error) {
    console.error('PayFast form generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PayFast form'
    }
  }
}

export const generateSignature = (data: PayFastData, passphrase?: string) => {
  try {
    // Create parameter string
    const pfOutput = Object.keys(data)
      .filter(key => {
        const value = data[key as keyof PayFastData]
        return value !== '' && value !== undefined && value !== null
      })
      .sort()
      .map(key => {
        const value = data[key as keyof PayFastData] as string
        return `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}`
      })
      .join('&')

    // Add passphrase if provided
    const pfOutputWithPassphrase = passphrase 
      ? `${pfOutput}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
      : pfOutput

    // Generate MD5 signature
    return crypto.createHash('md5').update(pfOutputWithPassphrase).digest('hex')
  } catch (error) {
    console.error('Signature generation error:', error)
    throw new Error('Failed to generate PayFast signature')
  }
}

export const verifyPayFastSignature = (data: any, signature: string, passphrase?: string): boolean => {
  try {
    // Remove signature from data
    const dataForSigning = { ...data }
    delete dataForSigning.signature
    
    const generatedSignature = generateSignature(dataForSigning, passphrase)
    return generatedSignature === signature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

// Auto-submit PayFast form
export const submitPayFastForm = (formData: any, actionUrl: string) => {
  try {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = actionUrl
    form.style.display = 'none'

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value as string
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    
    return { success: true }
  } catch (error) {
    console.error('Form submission error:', error)
    return { 
      success: false, 
      error: 'Failed to submit payment form' 
    }
  }
}

// Validate PayFast IP address (for webhooks)
export const isValidPayFastIP = (ip: string): boolean => {
  const validIPs = [
    '197.97.145.144',
    '197.97.145.145',
    '197.97.145.146',
    '197.97.145.147',
    '197.97.145.148',
    '197.97.145.149',
    '197.97.145.150',
    '197.97.145.151',
    '197.97.145.152',
    '197.97.145.153',
    '197.97.145.154',
    '197.97.145.155',
    '197.97.145.156',
    '197.97.145.157',
    '197.97.145.158',
    '197.97.145.159',
    '197.97.145.160',
    '197.97.145.161',
    '197.97.145.162',
    '197.97.145.163',
    '197.97.145.164',
    '197.97.145.165',
    '197.97.145.166',
    '197.97.145.167',
    '197.97.145.168',
    '197.97.145.169',
    '197.97.145.170',
    '197.97.145.171',
    '197.97.145.172',
    '197.97.145.173',
    '197.97.145.174',
    '197.97.145.175'
  ]
  
  return validIPs.includes(ip)
}
