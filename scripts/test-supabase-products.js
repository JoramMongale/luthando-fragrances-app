#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

console.log('Testing Supabase Products Connection')
console.log('====================================\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log(`Supabase URL: ${supabaseUrl ? 'Set' : 'Missing'}`)
console.log(`Supabase Key: ${supabaseKey ? '****' + supabaseKey.slice(-4) : 'Missing'}`)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(supabaseUrl, supabaseKey)

async function testProducts() {
  try {
    console.log('\n1. Testing products table access...')
    
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .limit(5)
    
    if (error) {
      console.error(`❌ Supabase error: ${error.message}`)
      console.error(`   Code: ${error.code}`)
      console.error(`   Details: ${error.details}`)
      console.error(`   Hint: ${error.hint}`)
      return false
    }
    
    console.log(`✅ Success! Found ${count || 0} products`)
    console.log(`   Sample: ${data?.length || 0} rows returned`)
    
    if (data && data.length > 0) {
      console.log('\n   First product:')
      console.log(`     ID: ${data[0].id}`)
      console.log(`     Name: ${data[0].name}`)
      console.log(`     Price: R${data[0].price}`)
      console.log(`     Image URL: ${data[0].image_url ? 'Set' : 'None'}`)
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

async function testUnifiedDb() {
  try {
    console.log('\n2. Testing unified-db.getProducts()...')
    
    // Need to import the ES module
    const { getProducts } = require('../lib/unified-db')
    
    const { data, error } = await getProducts('All')
    
    if (error) {
      console.error(`❌ Unified DB error: ${error.message || error}`)
      return false
    }
    
    console.log(`✅ Unified DB success! Found ${data?.length || 0} products`)
    
    return true
    
  } catch (error) {
    console.error('❌ Unified DB import error:', error.message)
    console.error('   Stack:', error.stack)
    return false
  }
}

async function runTests() {
  console.log('\n====================================')
  console.log('Running Tests...')
  console.log('====================================')
  
  const supabaseSuccess = await testProducts()
  const unifiedSuccess = await testUnifiedDb()
  
  console.log('\n====================================')
  console.log('Test Summary')
  console.log('====================================')
  console.log(`Supabase direct: ${supabaseSuccess ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Unified DB: ${unifiedSuccess ? '✅ PASS' : '❌ FAIL'}`)
  
  if (!supabaseSuccess) {
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check Supabase project is active')
    console.log('2. Verify tables exist: products, cart_items, user_profiles')
    console.log('3. Check RLS policies allow anonymous access')
    console.log('4. Verify environment variables in .env.local')
  }
}

runTests()