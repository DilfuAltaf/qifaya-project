async function test() {
  try {
    const res = await fetch('https://qifaya-project.vercel.app/products?name=sadas');
    const data = await res.json();
    console.log("Prod length:", data.data ? data.data.length : data.length);
    console.log("First:", data.data ? data.data[0]?.name : data[0]?.name);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
