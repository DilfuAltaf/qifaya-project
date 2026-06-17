async function test() {
  try {
    const res = await fetch('https://qifaya-project.vercel.app/products?name=blablabla');
    const data = await res.json();
    console.log("Prod length:", data.data ? data.data.length : data.length);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
