async function testApi() {
    try {
        console.log("Fetching API...");
        const res = await fetch('http://localhost:3000/api/cron/generate-article');
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response Body:");
        console.log(text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
testApi();
