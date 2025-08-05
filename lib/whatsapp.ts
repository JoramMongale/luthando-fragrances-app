const BUSINESS_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '27742961451'

export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

export const formatOrderMessage = (
  items: Array<{ name: string; price: number; quantity?: number }>,
  total: number,
  shippingDetails?: any
) => {
  let message = `🌟 New Order - Luthando Fragrances 🌟\n\n`
  
  if (shippingDetails) {
    message += `👤 Customer Details:\n`
    message += `Name: ${shippingDetails.firstName} ${shippingDetails.lastName}\n`
    message += `Email: ${shippingDetails.email}\n`
    message += `Phone: ${shippingDetails.phone}\n`
    message += `Address: ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.postalCode}\n\n`
  }
  
  message += `🛍️ Order Items:\n`
  items.forEach((item, index) => {
    const quantity = item.quantity ? ` (x${item.quantity})` : ''
    message += `${index + 1}. ${item.name}${quantity} - R${item.price.toFixed(2)}\n`
  })
  
  message += `\n💰 Total: R${total.toFixed(2)}\n\n`
  message += `📦 Please confirm this order and provide delivery details.\n`
  message += `Thank you for choosing Luthando Fragrances! 🌹`
  
  return message
}
