// Test PayFast signature generation
const crypto = require('crypto')

const testData = {
  merchant_id: '10000100',
  merchant_key: '46f0cd694581a',
  return_url: 'http://localhost:3000/payment/success',
  cancel_url: 'http://localhost:3000/payment/cancel',
  notify_url: 'http://localhost:3000/api/payfast/notify',
  name_first: 'Test',
  name_last: 'Customer',
  email_address: 'test@example.com',
  m_payment_id: 'TEST123',
  amount: '100.00',
  item_name: 'Test Product',
  item_description: 'Test Description'
}

const passphrase = 'jt7NOE43FZPn'

// Generate signature
const pfOutput = Object.keys(testData)
  .filter(key => testData[key] !== '' && testData[key] !== undefined)
  .sort()
  .map(key => `${key}=${encodeURIComponent(testData[key])}`)
  .join('&')

const pfOutputWithPassphrase = `${pfOutput}&passphrase=${encodeURIComponent(passphrase)}`
const signature = crypto.createHash('md5').update(pfOutputWithPassphrase).digest('hex')

console.log('Generated signature:', signature)
console.log('Full string:', pfOutputWithPassphrase)