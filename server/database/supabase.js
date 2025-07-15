const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🔧 TEMPORARILY FORCE MOCK MODE - NO SUPABASE CONNECTIONS
console.log('🔧 FORCED MOCK MODE: Supabase connections disabled for testing');

// Force all connections to null to use mock data only
let supabase = null;
let supabaseAdmin = null;

module.exports = {
  supabase,
  supabaseAdmin
}; 
