async function test() {
  try {
    const res = await fetch('http://localhost:4444/products');
    const data = await res.json();
    console.log("All products:");
    data.data.forEach(p => console.log(`- ${p.name}`));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
