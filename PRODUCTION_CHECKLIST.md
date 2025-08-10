# Production Deployment Checklist for Luthando Fragrances

## ✅ Pre-Deployment Checks

### Environment Variables (Vercel Dashboard)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_APP_URL (https://luthando-fragrances.vercel.app or custom domain)
- [ ] NEXT_PUBLIC_BUSINESS_NAME (Luthando Fragrances)
- [ ] NEXT_PUBLIC_WHATSAPP_NUMBER
- [ ] NEXT_PUBLIC_PAYFAST_MERCHANT_ID
- [ ] NEXT_PUBLIC_PAYFAST_MERCHANT_KEY
- [ ] PAYFAST_PASSPHRASE
- [ ] NEXT_PUBLIC_PAYFAST_SANDBOX (set to false for production)
- [ ] SENDGRID_API_KEY (optional)
- [ ] SENDGRID_FROM_EMAIL (optional)

### Database (Supabase)
- [ ] All tables created and migrated
- [ ] RLS policies configured
- [ ] Storage bucket for product images created
- [ ] Email templates configured
- [ ] Authentication settings verified

### Payment Gateway (PayFast)
- [ ] Merchant account verified
- [ ] Webhook URL configured
- [ ] Test transactions completed
- [ ] Production credentials set

### Domain Configuration
- [ ] Custom domain configured in Vercel
- [ ] SSL certificate active
- [ ] DNS records properly configured
- [ ] Email domain verified (if using custom email)

## 🧪 Testing Checklist

### User Flows
- [ ] User registration with email verification
- [ ] User login/logout
- [ ] Password reset flow
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Payment processing (sandbox first, then production)
- [ ] Order confirmation emails
- [ ] Order history viewing

### Admin Functions
- [ ] Admin login and access control
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Customer management
- [ ] Image upload for products
- [ ] Analytics dashboard

### Mobile Testing
- [ ] Homepage responsive design
- [ ] Product browsing on mobile
- [ ] Cart functionality on mobile
- [ ] Checkout form on mobile
- [ ] Admin panel on tablet/mobile

### Performance
- [ ] Page load speed < 3 seconds
- [ ] Images optimized and lazy loaded
- [ ] Database queries optimized
- [ ] No console errors in production

## 🚀 Deployment Steps

1. **Push to GitHub**
  ```bash
  git add .
  git commit -m "Production ready - fixes applied"
  git push origin main
