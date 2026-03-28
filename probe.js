const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://myftvviplvkkloehljyx.supabase.co', 'sb_publishable_eO5EXLNXQxq5_Z3dC_KGqA_-Wgi41xd');
async function run() {
  const fs = require('fs');
  let text = "";
  for (const col of ['asset_name', 'name', 'title', 'symbol', 'category']) {
    const { error } = await supabase.from('investments').insert([{ [col]: 'X' }]);
    text += `${col} err: ${error?.message}\n`;
  }
  fs.writeFileSync('probe_out.txt', text);
}
run();

