import { createClient } from "@supabase/supabase-js";

const supabaseUrl ="https://vjuypkezxhkjkrprdvjn.supabase.co";
const supabaseKey = "sb_publishable_jHXR1M_YeWdqlXXDz4yxGA_9sR74wcn";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);