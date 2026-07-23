const url = "http://localhost:4000/api/products";

async function main() {
  for (let i = 1; i <= 7; i++) {
    try {
      const res = await fetch(url, {
        method: "GET",
      });

      const text = await res.text();
      console.log(`#${i} -> ${res.status} ${res.statusText}`);
      console.log(text.slice(0, 200));
    } catch (err: any) {
      console.log(`#${i} -> ERROR`, err.message);
    }
    await new Promise((r) => setTimeout(r, 150));
  }
}

main();
