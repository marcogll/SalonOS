require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupKiosk() {
  console.log('Setting up Kiosk...');
  
  // 1. Get a location
  const { data: locations, error: locError } = await supabase
    .from('locations')
    .select('id, name')
    .limit(1);

  if (locError || !locations || locations.length === 0) {
    console.error('Error fetching locations or no locations found:', locError);
    return;
  }

  const location = locations[0];
  console.log(`Using location: ${location.name} (${location.id})`);

  // 2. Check if kiosk exists
  const { data: existingKiosks, error: kioskError } = await supabase
    .from('kiosks')
    .select('id, api_key')
    .eq('location_id', location.id)
    .eq('device_name', 'TEST_KIOSK_DEVICE');

  if (existingKiosks && existingKiosks.length > 0) {
    console.log('Test Kiosk already exists.');
    console.log('API_KEY=' + existingKiosks[0].api_key);
    return existingKiosks[0].api_key;
  }

  // 3. Create Kiosk (Direct Insert to bypass broken SQL function)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let apiKey = '';
  for (let i = 0; i < 64; i++) {
    apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const { data: newKiosk, error: createError } = await supabase
    .from('kiosks')
    .insert({
      location_id: location.id,
      device_name: 'TEST_KIOSK_DEVICE',
      display_name: 'Test Kiosk Display',
      api_key: apiKey,
      ip_address: '127.0.0.1'
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating kiosk:', createError);
    return;
  }

  console.log('Kiosk created successfully!');
  console.log('API_KEY=' + newKiosk.api_key);
  return newKiosk.api_key;
}

setupKiosk();
