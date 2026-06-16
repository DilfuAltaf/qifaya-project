const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase users table...');
  const { data, error } = await supabase.from('users').insert([{ email: 'test@qifaya.com', password: 'testpassword' }]).select().single();
  
  if (error) {
    console.error('Error connecting to Supabase:', error);
  } else {
    console.log('Successfully connected! Data from users:', data);
  }
}

testConnection();
