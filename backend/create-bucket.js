const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Creating bucket 'product-images'...");
  const { data, error } = await supabase.storage.createBucket('product-images', { public: true });
  if (error) {
    console.error("Failed to create bucket:", error.message);
  } else {
    console.log("Bucket created successfully:", data);
  }
}

test();
