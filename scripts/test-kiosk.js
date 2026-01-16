const API_KEY = process.argv[2];
const BASE_URL = 'http://localhost:3000';

if (!API_KEY) {
  console.error('Please provide API KEY as argument');
  process.exit(1);
}

async function runTests() {
  console.log('Starting Kiosk API Tests...');

  // 1. Authenticate
  console.log('\n--- Test 1: Authenticate ---');
  try {
    const authRes = await fetch(`${BASE_URL}/api/kiosk/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: API_KEY })
    });
    
    console.log('Status:', authRes.status);
    const authData = await authRes.json();
    console.log('Response:', authData);

    if (authRes.status !== 200) throw new Error('Authentication failed');
  } catch (e) {
    console.error('Auth Test Failed:', e);
    process.exit(1);
  }

  // 2. Get Resources
  console.log('\n--- Test 2: Get Available Resources ---');
  
  // Generate time window for today
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  const startTime = now.toISOString();
  const endTime = oneHourFromNow.toISOString();
  
  console.log(`Time window: ${startTime} to ${endTime}`);
  
  try {
    const resRes = await fetch(`${BASE_URL}/api/kiosk/resources/available?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`, {
      headers: { 
        'x-kiosk-api-key': API_KEY 
      }
    });
    
    console.log('Status:', resRes.status);
    const resData = await resRes.json();
    console.log('Response:', resData);

    if (resRes.status !== 200) throw new Error('Get Resources failed');
  } catch (e) {
    console.error('Resources Test Failed:', e);
    process.exit(1);
  }

  // 3. Walk-in Booking
  console.log('\n--- Test 3: Walk-in Booking ---');
  
  // Need a service ID. I'll fetch it from the DB via a public endpoint if available, 
  // or assuming I can't reach DB here easily without duplicating setup logic. 
  // Wait, I can use the same setup logic or just try a known ID if I knew one. 
  // But I don't.
  // I will use `setup-kiosk.js` to also print a service ID or just fetch it here if I use supabase client.
  // But this script is meant to test HTTP API.
  // I will assume I can find a service if I query the DB.
  
  // Better approach: Since I am running this locally, I can use the supabase client here too just to get a service ID.
  require('dotenv').config({ path: '.env.local' });
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: services } = await supabase
    .from('services')
    .select('id, name')
    .limit(1);
    
  if (!services || services.length === 0) {
    console.error('No services found to test walk-in');
    return;
  }
  
  const serviceId = services[0].id;
  console.log(`Using Service: ${services[0].name} (${serviceId})`);

  try {
    const walkinRes = await fetch(`${BASE_URL}/api/kiosk/walkin`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-kiosk-api-key': API_KEY
      },
      body: JSON.stringify({
        customer_email: `walkin_test_${Date.now()}@example.com`,
        customer_name: 'Test Walkin',
        service_id: serviceId,
        notes: 'Automated Test'
      })
    });
    
    console.log('Status:', walkinRes.status);
    const walkinData = await walkinRes.json();
    console.log('Response:', JSON.stringify(walkinData, null, 2));

    if (walkinRes.status !== 201) throw new Error('Walk-in failed: ' + walkinData.error);
    
    console.log('✅ WALK-IN TEST PASSED');
  } catch (e) {
    console.error('Walk-in Test Failed:', e);
    process.exit(1);
  }
  
  console.log('\n✅ ALL TESTS PASSED');
  process.exit(0);
}

runTests();
