const axios = require('axios');

async function test() {
  try {
    const params = { page: 1, limit: 12, name: 'sa' };
    const res = await axios.get('http://localhost:4444/products', { params });
    console.log("Status:", res.status);
    console.log("Data length:", res.data.data ? res.data.data.length : res.data.length);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
