"use strict";

/*
 * Bizora — Supabase Configuration
 * Browser-based setup using the Supabase CDN.
 */

(function () {
    const SUPABASE_URL =
        "https://zvyjberdjonlkgnexcdm.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_IbK4QaSYOa6CJJEhyg5UaA_nSRaO54u";

    // Prevent initialization errors if the CDN hasn't loaded.
    if (!window.supabase) {
        console.error(
            "Bizora: Supabase library failed to load."
        );
        return;
    }

    // Create the client once.
    if (window.bizoraSupabase) {
        return;
    }

    try {
        window.bizoraSupabase = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

        console.info(
            "Bizora: Supabase client initialized."
        );
    } catch (error) {
        console.error(
            "Bizora: Supabase initialization failed.",
            error
        );
    }
})();