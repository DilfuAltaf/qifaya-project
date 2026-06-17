async function test() {
  try {
    const res = await fetch('http://localhost:4444/products?name=SaD');
    const data = await res.json();
    console.log("Data length (SaD):", data.data ? data.data.length : data.length);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
