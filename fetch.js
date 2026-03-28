const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://myftvviplvkkloehljyx.supabase.co', 'sb_publishable_eO5EXLNXQxq5_Z3dC_KGqA_-Wgi41xd');
async function run() {
  const { data, error } = await supabase.from('investments').select('*');
  const fs = require('fs');
  fs.writeFileSync('output.json', JSON.stringify({data, error}, null, 2));
}
run();
