const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://qifaya-project.vercel.app/products');
    console.log("Prod length:", res.data.data ? res.data.data.length : res.data.length);
    const arr = res.data.data || res.data;
    arr.forEach(p => console.log(`- ${p.name} (desc: ${p.description})`));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
