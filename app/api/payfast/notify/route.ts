import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orders'
import { verifyPayFastSignature, isValidPayFastIP } from '@/lib/payments/payfast'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get IP address for validation
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] || realIP || ''

    // Validate IP in production
    if (process.env.NODE_ENV === 'production' && !isValidPayFastIP(ip)) {
      console.error('Invalid PayFast IP:', ip)
      return NextResponse.json({ error: 'Invalid source IP' }, { status: 403 })
    }

    // Get the raw body
    const body = await request.text()
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}
    
    // Convert URLSearchParams to object
    for (const [key, value] of params.entries()) {
      data[key] = value
    }

    console.log('PayFast webhook received:', {
      payment_status: data.payment_status,
      order_id: data.m_payment_id,
      amount: data.amount_gross
    })

    // Verify the signature
    const signature = data.signature
    delete data.signature // Remove signature from data for verification
    
    const passphrase = process.env.PAYFAST_PASSPHRASE
    const isValidSignature = verifyPayFastSignature(data, signature, passphrase)

    if (!isValidSignature) {
      console.error('Invalid PayFast signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Extract order information
    const orderId = data.custom_str1 || data.m_payment_id
    const paymentStatus = data.payment_status
    const paymentReference = data.pf_payment_id

    if (!orderId) {
      console.error('No order ID found in PayFast webhook')
      return NextResponse.json({ error: 'No order ID' }, { status: 400 })
    }

    // Update order status based on payment status
    let orderStatus: 'paid' | 'cancelled' = 'paid'
    
    if (paymentStatus === 'COMPLETE') {
      orderStatus = 'paid'
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
      orderStatus = 'cancelled'
    }

    // Update the order in the database
    const { data: updatedOrder, error } = await updateOrderStatus(
      orderId,
      orderStatus,
      paymentReference
    )

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log(`Order ${orderId} updated to ${orderStatus}`)

    // PayFast expects a 200 OK response
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PayFast webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PayFast requires a GET endpoint that returns 200 OK for validation
export async function GET() {
  return NextResponse.json({ status: 'PayFast webhook endpoint ready' })
}
