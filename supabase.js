"use strict";

const SUPABASE_URL = "https://zvyjberdjonlkgnexcdm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_IbK4QaSYOa6CJJEhyg5UaA_nSRaO54u";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

window.bizoraSupabase = supabaseClient;