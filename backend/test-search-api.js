async function test() {
  try {
    const res = await fetch('http://localhost:4444/products?name=a');
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data length:", data.data ? data.data.length : data.length);
    console.log("First item:", data.data ? data.data[0]?.name : data[0]?.name);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
