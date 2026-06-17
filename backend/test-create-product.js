const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching a valid category...");
  const { data: cats } = await supabase.from('categories').select('id').limit(1);
  if (!cats || cats.length === 0) {
    console.log("No categories found");
    return;
  }
  const catId = cats[0].id;

  console.log("Trying to insert product without image_url...");
  const { data: insertData, error: insertError } = await supabase.from('products').insert([{
    name: 'Test Product ' + Date.now(),
    slug: 'test-product-' + Date.now(),
    description: 'test',
    gender: 'female',
    category_id: catId
  }]);

  if (insertError) {
    console.error("Insert error:", insertError.message);
  } else {
    console.log("Insert success!");
  }
}

test();
