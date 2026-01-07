const canvas = document.getElementById('neuralCanvas');// 1. SUPABASE CONFIGURATION
// Replace these with your actual keys from the Supabase Settings > API tab
const supabaseUrl = 'https://gwrlbqjpjlhdkpgprlxy.supabase.co';
const supabaseKey = 'YOUR_ACTUAL_ANON_PUBLIC_KEY_HERE'; 

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. FORM ELEMENTS
const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('#passwordField');
const signUpBtn = document.querySelector('.btn-signup-alt');

// 3. LOGIN LOGIC
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        window.location.href = 'portal.html'; 
    }
});

// 4. SIGN UP LOGIC
signUpBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert("Sign up error: " + error.message);
    } else {
        alert("Success! Check your email or your Supabase 'Auth' tab.");
    }
});

// 5. NEURAL CANVAS ANIMATION (Kept your original logic)
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
    }
    draw() {
        ctx.fillStyle = 'rgba(177, 157, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(157, 141, 241, ${1 - distance/120})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// 6. PASSWORD TOGGLE
const togglePassword = document.querySelector('#togglePassword');
togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

init();
animate();