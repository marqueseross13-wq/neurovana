// supabase.js - Fixed version
// Make sure this loads AFTER the Supabase CDN script

(function() {
    // Wait for Supabase library to be available
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.error('Supabase library not loaded. Make sure to include the CDN script before this file.');
        return;
    }

    const SUPABASE_URL = "https://gwrlbqjpjlhdkpgprlxy.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmxicWpwamxoZGtwZ3BybHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjU5MDMsImV4cCI6MjA4MzMwMTkwM30.TYs76jAv9WYevgrZqHg4mrfBQf1AdUNKhBitAUZ6QDg";

    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ Supabase client initialized:", window.supabaseClient);
    } catch (error) {
        console.error("❌ Failed to initialize Supabase client:", error);
    }
})();