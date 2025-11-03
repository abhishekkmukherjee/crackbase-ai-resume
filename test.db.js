const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  try {
    // Try to fetch from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Error:', error.message)
    } else {
      console.log('✅ Database connection successful!')
      console.log('Users table exists and is accessible')
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message)
  }
}

testConnection()
