# PayFast Integration Testing Guide

## Current Setup
- Using SANDBOX credentials for testing
- Production credentials need to be updated after you secure them

## Testing PayFast Integration

### 1. Test Card Numbers (Sandbox Mode)
For successful payments:
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVV: Any 3 digits

For failed payments:
- Card Number: `4000 0000 0000 0036`

### 2. Testing Process
1. Add products to cart
2. Go to checkout
3. Fill in shipping details
4. Select "Online Payment (PayFast)"
5. Click "Pay Now"
6. You'll be redirected to PayFast sandbox
7. Use test card details
8. Complete payment
9. You'll be redirected back to success/cancel page

### 3. Webhook Testing
PayFast will send notifications to: `http://localhost:3000/api/payfast/notify`

For local testing, use ngrok:
```bash
npx ngrok http 3000
