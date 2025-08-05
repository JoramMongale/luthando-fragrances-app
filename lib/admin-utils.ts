// Utility functions for admin operations

export const generateProductSKU = (name: string, category: string): string => {
  const namePrefix = name.substring(0, 3).toUpperCase()
  const categoryPrefix = category.substring(0, 2).toUpperCase()
  const timestamp = Date.now().toString().slice(-4)
  return `${categoryPrefix}-${namePrefix}-${timestamp}`
}

export const validateProductData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long')
  }

  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0')
  }

  if (!data.category) {
    errors.push('Category is required')
  }

  if (data.stock_quantity < 0) {
    errors.push('Stock quantity cannot be negative')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const formatProductForDisplay = (product: any) => {
  return {
    ...product,
    formattedPrice: new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(product.price),
    stockStatus: product.stock_quantity <= 5 ? 'low' : 
                 product.stock_quantity <= 20 ? 'medium' : 'high',
    isNew: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
}

export const exportProductsToCSV = (products: any[]): string => {
  const headers = ['ID', 'Name', 'Description', 'Price', 'Category', 'Stock', 'Active', 'Created']
  const rows = products.map(product => [
    product.id,
    product.name,
    product.description,
    product.price,
    product.category,
    product.stock_quantity,
    product.is_active ? 'Yes' : 'No',
    new Date(product.created_at).toLocaleDateString()
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  return csvContent
}

export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
