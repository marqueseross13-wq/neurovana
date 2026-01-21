// ============================================
// SUPABASE CONFIGURATION
// ============================================
const supabaseUrl = 'https://gwrlbqjpjlhdkpgprlxy.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmxicWpwamxoZGtwZ3BybHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjU5MDMsImV4cCI6MjA4MzMwMTkwM30.TYs76jAv9WYevgrZqHg4mrfBQf1AdUNKhBitAUZ6QDg';

// Defensive: make sure supabase script loaded
if (!window.supabase || !window.supabase.createClient) {
  console.error("Supabase is not loaded. Make sure this is before script.js:\n<script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script>");
} else {
  const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

  // ============================================
  // HELPERS
  // ============================================
  const $ = (sel) => document.querySelector(sel);

  function setButtonLoading(btn, isLoading, labelWhenLoading = "Please wait...") {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.dataset._label = btn.dataset._label || btn.textContent;
    btn.textContent = isLoading ? labelWhenLoading : btn.dataset._label;
    btn.style.opacity = isLoading ? "0.85" : "1";
    btn.style.cursor = isLoading ? "not-allowed" : "pointer";
  }

  function normalizeEmail(value) {
    return (value || "").trim().toLowerCase();
  }

  function getCredentials() {
    const emailEl = $("#emailInput") || $('input[type="email"]');
    const passEl = $("#passwordField");

    const email = normalizeEmail(emailEl?.value);
    const password = passEl?.value || "";

    return { email, password, emailEl, passEl };
  }

  function showError(message) {
    alert(message); // keep simple; later we can swap to a toast UI
  }

  // ============================================
  // ELEMENTS
  // ============================================
  const loginForm = $("#loginForm");
  const signUpBtn = $(".btn-signup-alt"); // you also have inline onclick; this still works
  const passwordInput = $("#passwordField");
  const togglePassword = $("#togglePassword");

  // ============================================
  // LOGIN LOGIC
  // ============================================
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const loginBtn = loginForm.querySelector('.btn-login');
      setButtonLoading(loginBtn, true, "Logging in...");

      try {
        const { email, password } = getCredentials();

        if (!email || !password) {
          showError("Please enter both email and password.");
          return;
        }

        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          showError("Login failed: " + error.message);
          return;
        }

        // Success
        window.location.href = "loading.html";
      } catch (err) {
        console.error(err);
        showError("Something went wrong while logging in. Please try again.");
      } finally {
        setButtonLoading(loginForm.querySelector('.btn-login'), false);
      }
    });
  }

  // ============================================
  // SIGN UP LOGIC
  // ============================================
  // NOTE: Your HTML already has onclick="window.location.href='signup.html'"
  // If you want signup to happen right on index.html, remove the onclick from the button.
  if (signUpBtn) {
    signUpBtn.addEventListener("click", async (e) => {
      // If the button is meant to redirect to signup.html, let it redirect.
      // If you want "sign up from here", comment out the next 2 lines and remove inline onclick in HTML.
      // return;

      // If inline onclick is present, this JS never really gets a chance to run signup logic.
      // We'll prevent default so your signup logic can run if you choose to use it here:
      e.preventDefault();

      setButtonLoading(signUpBtn, true, "Creating account...");

      try {
        const { email, password } = getCredentials();

        if (!email || !password) {
          showError("Please enter both email and password.");
          return;
        }

        if (password.length < 6) {
          showError("Password must be at least 6 characters.");
          return;
        }

        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
        });

        if (error) {
          showError("Sign up error: " + error.message);
          return;
        }

        alert("Success! Check your email (or Supabase Auth tab) to confirm your account.");
      } catch (err) {
        console.error(err);
        showError("Something went wrong while signing up. Please try again.");
      } finally {
        setButtonLoading(signUpBtn, false);
      }
    });
  }

  // ============================================
  // PASSWORD TOGGLE (CLICK + KEYBOARD)
  // ============================================
  function togglePasswordVisibility() {
    if (!passwordInput) return;

    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");

    if (togglePassword) {
      togglePassword.classList.toggle("fa-eye", isPassword);
      togglePassword.classList.toggle("fa-eye-slash", !isPassword);
    }
  }

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", togglePasswordVisibility);

    // allow Enter/Space for accessibility
    togglePassword.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePasswordVisibility();
      }
    });
  }

  // ============================================
  // OPTIONAL: Redirect if already logged in
  // ============================================
  (async function autoRedirectIfLoggedIn() {
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (data?.session) {
        // already logged in
        // window.location.href = "loading.html";
      }
    } catch (e) {
      // ignore
    }
  })();
}
