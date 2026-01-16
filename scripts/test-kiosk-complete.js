const API_KEY = process.argv[2];
const BASE_URL = 'http://localhost:3000';

if (!API_KEY) {
  console.error('Please provide API KEY as argument');
  process.exit(1);
}

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runTests() {
  console.log('Starting Complete Kiosk API Tests...\n');

  let createdBooking = null;

  try {
    // Test 1: Authenticate
    console.log('--- Test 1: Authenticate ---');
    const authRes = await fetch(`${BASE_URL}/api/kiosk/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: API_KEY })
    });

    console.log('Status:', authRes.status);
    const authData = await authRes.json();
    console.log('Response:', JSON.stringify(authData, null, 2));

    if (authRes.status !== 200) throw new Error('Authentication failed');
    console.log('✅ Auth Test Passed\n');

    // Test 2: Get Bookings for today
    console.log('--- Test 2: Get Bookings for Today ---');
    const today = new Date().toISOString().split('T')[0];
    const getBookingsRes = await fetch(
      `${BASE_URL}/api/kiosk/bookings?date=${today}`,
      { headers: { 'x-kiosk-api-key': API_KEY } }
    );

    console.log('Status:', getBookingsRes.status);
    const getBookingsData = await getBookingsRes.json();
    console.log(`Found ${getBookingsData.bookings?.length || 0} bookings today`);

    if (getBookingsRes.status !== 200) throw new Error('Get bookings failed');
    console.log('✅ Get Bookings Test Passed\n');

    // Test 3: Get Available Resources
    console.log('--- Test 3: Get Available Resources ---');
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const resourcesRes = await fetch(
      `${BASE_URL}/api/kiosk/resources/available?start_time=${now.toISOString()}&end_time=${oneHourFromNow.toISOString()}`,
      { headers: { 'x-kiosk-api-key': API_KEY } }
    );

    console.log('Status:', resourcesRes.status);
    const resourcesData = await resourcesRes.json();
    console.log(`Available resources: ${resourcesData.total_available}`);

    if (resourcesRes.status !== 200) throw new Error('Get resources failed');
    console.log('✅ Get Resources Test Passed\n');

    // Test 4: Create Booking (Scheduled)
    console.log('--- Test 4: Create Scheduled Booking ---');

    const { data: services } = await supabase
      .from('services')
      .select('id, name, duration_minutes')
      .eq('is_active', true)
      .limit(1);

    const { data: staff } = await supabase
      .from('staff')
      .select('id, display_name')
      .eq('is_active', true)
      .limit(1);

    if (!services || services.length === 0 || !staff || staff.length === 0) {
      console.error('No services or staff available');
      return;
    }

    const scheduledStartTime = new Date();
    scheduledStartTime.setHours(scheduledStartTime.getHours() + 2);

    const createBookingRes = await fetch(`${BASE_URL}/api/kiosk/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kiosk-api-key': API_KEY
      },
      body: JSON.stringify({
        customer_email: `scheduled_${Date.now()}@example.com`,
        customer_name: 'Scheduled Customer',
        customer_phone: '+525512345678',
        service_id: services[0].id,
        staff_id: staff[0].id,
        start_time_utc: scheduledStartTime.toISOString(),
        notes: 'Scheduled booking test'
      })
    });

    console.log('Status:', createBookingRes.status);
    const createBookingData = await createBookingRes.json();
    console.log('Response:', JSON.stringify(createBookingData, null, 2));

    if (createBookingRes.status !== 201) throw new Error('Create booking failed');
    createdBooking = createBookingData.booking;
    console.log('✅ Create Booking Test Passed\n');

    // Test 5: Confirm Booking
    console.log('--- Test 5: Confirm Booking ---');
    if (createdBooking && createdBooking.short_id) {
      const confirmRes = await fetch(
        `${BASE_URL}/api/kiosk/bookings/${createdBooking.short_id}/confirm`,
        {
          method: 'POST',
          headers: { 'x-kiosk-api-key': API_KEY }
        }
      );

      console.log('Status:', confirmRes.status);
      const confirmData = await confirmRes.json();
      console.log('Response:', JSON.stringify(confirmData, null, 2));

      if (confirmRes.status !== 200) throw new Error('Confirm booking failed');
      console.log('✅ Confirm Booking Test Passed\n');
    }

    // Test 6: Walk-in Booking
    console.log('--- Test 6: Walk-in Booking ---');
    const walkinRes = await fetch(`${BASE_URL}/api/kiosk/walkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kiosk-api-key': API_KEY
      },
      body: JSON.stringify({
        customer_email: `walkin_${Date.now()}@example.com`,
        customer_name: 'Walk-in Customer',
        service_id: services[0].id,
        notes: 'Automated Walk-in Test'
      })
    });

    console.log('Status:', walkinRes.status);
    const walkinData = await walkinRes.json();
    console.log('Response:', JSON.stringify(walkinData, null, 2));

    if (walkinRes.status !== 201) throw new Error('Walk-in failed');
    console.log('✅ Walk-in Test Passed\n');

    console.log('✅✅✅ ALL TESTS PASSED ✅✅✅');
    process.exit(0);

  } catch (e) {
    console.error('\n❌ Test Failed:', e.message);
    process.exit(1);
  }
}

runTests();
