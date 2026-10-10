"use strict";

const SUPABASE_URL = "https://zvyjberdjonlkgnexcdm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

window.bizoraSupabase = supabaseClient;