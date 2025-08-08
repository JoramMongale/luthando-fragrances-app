import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orders'
import { verifyPayFastSignature } from '@/lib/payments/payfast'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}
    
    // Convert URLSearchParams to object
    for (const [key, value] of params.entries()) {
      data[key] = value
    }

    console.log('PayFast webhook received:', data)

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

    // TODO: Send email notification here if needed
    // await sendOrderConfirmationEmail(updatedOrder)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PayFast webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PayFast requires a GET endpoint that returns 200 OK for validation
export async function GET() {
  return NextResponse.json({ message: 'PayFast webhook endpoint' })
}
