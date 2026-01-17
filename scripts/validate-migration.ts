#!/usr/bin/env tsx

/**
 * Migration Validation Script
 * Run with: npm run validate:migration
 */

import { validateMigration } from '../lib/migration-utils'

async function main() {
  console.log('🔍 Validating Migration Status...')
  console.log('='.repeat(50))

  try {
    const validation = await validateMigration()

    console.log('📊 Data Counts:')
    console.log('─'.repeat(30))
    
    // Products
    console.log('Products:')
    console.log(`  Supabase: ${validation.products.supabase}`)
    console.log(`  Firestore: ${validation.products.firestore}`)
    console.log(`  Match: ${validation.products.match ? '✅' : '❌'}`)
    console.log()

    // Users
    console.log('Users:')
    console.log(`  Supabase: ${validation.users.supabase}`)
    console.log(`  Firestore: ${validation.users.firestore}`)
    console.log(`  Match: ${validation.users.match ? '✅' : '❌'}`)
    console.log()

    // Orders
    console.log('Orders:')
    console.log(`  Supabase: ${validation.orders.supabase}`)
    console.log(`  Firestore: ${validation.orders.firestore}`)
    console.log(`  Match: ${validation.orders.match ? '✅' : '❌'}`)
    console.log()

    // Summary
    console.log('📈 Summary:')
    console.log('─'.repeat(30))
    
    const allMatch = validation.products.match && validation.users.match && validation.orders.match
    
    if (allMatch) {
      console.log('🎉 All data counts match! Migration validation passed.')
    } else {
      console.log('⚠️  Some data counts do not match. Review migration logs.')
      
      if (!validation.products.match) {
        console.log(`   Products: Difference of ${Math.abs(validation.products.supabase - validation.products.firestore)}`)
      }
      if (!validation.users.match) {
        console.log(`   Users: Difference of ${Math.abs(validation.users.supabase - validation.users.firestore)}`)
      }
      if (!validation.orders.match) {
        console.log(`   Orders: Difference of ${Math.abs(validation.orders.supabase - validation.orders.firestore)}`)
      }
    }

  } catch (error) {
    console.error('❌ Validation failed:', error)
    process.exit(1)
  }
}

// Run validation
main().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})