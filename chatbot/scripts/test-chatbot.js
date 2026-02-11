// Simple test script for chatbot endpoints
// Usage: node scripts/test-chatbot.js

const BASE = 'http://localhost:8000';

async function request(message) {
  try {
    const res = await fetch(`${BASE}/api/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (err) {
    return { error: err.message };
  }
}

async function run() {
  console.log('Testing chatbot endpoints on', BASE);

  const tests = [
    { name: 'Greeting', message: 'Hi' },
    { name: 'Search (example: Gulberg)', message: 'I need a property in Gulberg' },
    { name: 'Search (no results)', message: 'I need a property in NowhereTown' }
  ];

  for (const t of tests) {
    console.log('\n--- ' + t.name + ' ---');
    const res = await request(t.message);
    if (res.error) {
      console.error('Request error:', res.error);
    } else {
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(res.data, null, 2));
    }
  }
}

run().catch(err => console.error('Test runner error:', err));
