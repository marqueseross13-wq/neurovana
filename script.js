// ============================================
// SUPABASE CONFIGURATION
// ============================================
const supabaseUrl = 'https://gwrlbqjpjlhdkpgprlxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmxicWpwamxoZGtwZ3BybHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjU5MDMsImV4cCI6MjA4MzMwMTkwM30.TYs76jAv9WYevgrZqHg4mrfBQf1AdUNKhBitAUZ6QDg'; //

const { createClient } = window.supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// ============================================
// FORM ELEMENTS
// ============================================
const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('#passwordField');
const signUpBtn = document.querySelector('.btn-signup-alt');
const togglePassword = document.querySelector('#togglePassword');

// ============================================
// LOGIN LOGIC
// ============================================
// ============================================
// LOGIN LOGIC - SAFE VERSION
// ============================================
if (loginForm) { // This check prevents the crash on loading.html
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            window.location.href = 'loading.html'; 
        }
    });
}
// ============================================
// SIGN UP LOGIC
// ============================================
signUpBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert("Sign up error: " + error.message);
    } else {
        alert("Success! Check your email or your Supabase 'Auth' tab.");
    }
});

// ============================================
// PASSWORD TOGGLE
// ============================================
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});