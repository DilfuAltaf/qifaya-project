const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:/Real Project/qifaya/backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const searchTerm = 'sadas';
  console.log(`Searching for '${searchTerm}' in name or description...`);
  
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    
  if (error) {
    console.error("Search error:", error);
  } else {
    console.log(`Found ${count} products.`);
    data.forEach(p => console.log(`- ${p.name}`));
  }
}

test();
