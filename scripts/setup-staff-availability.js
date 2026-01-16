require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStaffAvailability() {
  console.log('Setting up staff availability...');

  const locationId = '90d200c5-55dd-4726-bc23-e32ca0c5655b';

  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('id, display_name')
    .eq('location_id', locationId)
    .is('is_active', true);

  if (staffError || !staff || staff.length === 0) {
    console.error('Error fetching staff:', staffError);
    return;
  }

  console.log(`Found ${staff.length} staff members`);

  for (const member of staff) {
    const { error: updateError } = await supabase
      .from('staff')
      .update({
        work_hours_start: '09:00:00',
        work_hours_end: '20:00:00',
        work_days: 'MON,TUE,WED,THU,FRI,SAT',
        is_available_for_booking: true
      })
      .eq('id', member.id);

    if (updateError) {
      console.error(`Error updating ${member.display_name}:`, updateError);
    } else {
      console.log(`✓ Updated ${member.display_name}`);
    }
  }

  console.log('\n✅ Staff availability setup complete!');
}

setupStaffAvailability();
