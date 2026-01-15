// ============================================
// SUPABASE CONFIGURATION FOR SIGNUP PAGE
// ============================================
const supabaseUrl = 'https://gwrlbqjpjlhdkpgprlxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmxicWpwamxoZGtwZ3BybHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjU5MDMsImV4cCI6MjA4MzMwMTkwM30.TYs76jAv9WYevgrZqHg4mrfBQf1AdUNKhBitAUZ6QDg'; //

const { createClient } = window.supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// TEST CONNECTION
(async () => {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabaseClient.auth.getSession();
    console.log('Session test result:', { data, error });
})();
// ============================================
// HANDLE REGISTRATION
// ============================================
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    console.log('Attempting signup with:', email);

    const { data, error } = await supabaseClient.auth.signUp({ 
        email, 
        password 
    });

    if (error) {
        console.error('Signup error:', error);
        alert("Error: " + error.message);
    } else {
        console.log('Signup success:', data);
        alert("Account created! Check your email for a confirmation link.");
        window.location.href = 'index.html';
    }
});

// ============================================
// NEURAL NETWORK ANIMATION (SAME AS INDEX)
// ============================================
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Impulse {
    constructor(branch) {
        this.branch = branch;
        this.progress = 0;
        this.speed = 0.015 + Math.random() * 0.02;
        this.intensity = 0.7 + Math.random() * 0.3;
        this.size = 2 + Math.random() * 1.5;
    }

    update() {
        this.progress += this.speed;
        return this.progress < 1;
    }

    draw(ctx) {
        const points = this.branch.points;
        const index = Math.floor(this.progress * (points.length - 1));
        
        if (index >= points.length - 1) return;
        
        const p1 = points[index];
        const p2 = points[index + 1];
        const localProgress = (this.progress * (points.length - 1)) - index;
        
        const x = p1.x + (p2.x - p1.x) * localProgress;
        const y = p1.y + (p2.y - p1.y) * localProgress;
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.fillStyle = `rgba(255, 255, 255, ${this.intensity * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(200, 150, 255, 0.5)';
        ctx.fillStyle = `rgba(220, 180, 255, ${this.intensity * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        for (let i = 1; i <= 3; i++) {
            const trailProgress = this.progress - (i * 0.04);
            if (trailProgress < 0) continue;
            
            const trailIndex = Math.floor(trailProgress * (points.length - 1));
            if (trailIndex >= points.length - 1) continue;
            
            const tp1 = points[trailIndex];
            const tp2 = points[trailIndex + 1];
            const tLocalProgress = (trailProgress * (points.length - 1)) - trailIndex;
            
            const tx = tp1.x + (tp2.x - tp1.x) * tLocalProgress;
            const ty = tp1.y + (tp2.y - tp1.y) * tLocalProgress;
            
            const trailAlpha = (1 - i / 3) * this.intensity * 0.25;
            ctx.fillStyle = `rgba(180, 150, 255, ${trailAlpha})`;
            ctx.beginPath();
            ctx.arc(tx, ty, this.size * (1 - i / 4), 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class Neuron {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.branches = [];
        this.impulses = [];
        this.lastImpulseTime = Date.now();
        
        const mainBranchCount = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < mainBranchCount; i++) {
            const angle = (Math.PI * 2 * i) / mainBranchCount + (Math.random() - 0.5) * 0.4;
            this.createBranch(this.x, this.y, angle, 0, 100 + Math.random() * 80, 3);
        }
    }

    createBranch(startX, startY, angle, depth, length, thickness) {
        if (depth > 4 || length < 15) return;
        
        const segments = 12 + Math.floor(Math.random() * 8);
        const points = [];
        let x = startX;
        let y = startY;
        let currentAngle = angle;
        
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const segmentLength = (length / segments) * (1 - progress * 0.25);
            
            currentAngle += (Math.random() - 0.5) * 0.25;
            
            x += Math.cos(currentAngle) * segmentLength;
            y += Math.sin(currentAngle) * segmentLength;
            
            const t = thickness * (1 - progress * 0.4);
            
            points.push({ 
                x, 
                y, 
                thickness: Math.max(0.5, t)
            });
        }
        
        this.branches.push({ points, depth, thickness });
        
        const numSubBranches = depth === 0 ? 2 : (Math.random() > 0.6 ? 1 : 0);
        
        for (let i = 0; i < numSubBranches; i++) {
            const branchPoint = Math.floor(segments * (0.4 + Math.random() * 0.4));
            const bp = points[branchPoint];
            const angleOffset = (Math.random() - 0.5) * 0.9;
            const newAngle = currentAngle + angleOffset;
            const newLength = length * (0.6 + Math.random() * 0.2);
            const newThickness = thickness * 0.7;
            
            this.createBranch(bp.x, bp.y, newAngle, depth + 1, newLength, newThickness);
        }
    }

    fireImpulse() {
        this.branches.forEach(branch => {
            if (Math.random() > 0.4) {
                this.impulses.push(new Impulse(branch));
            }
        });
    }

    update() {
        const now = Date.now();
        if (now - this.lastImpulseTime > 2000 + Math.random() * 3000) {
            this.fireImpulse();
            this.lastImpulseTime = now;
        }
        
        this.impulses = this.impulses.filter(impulse => impulse.update());
    }

    draw(ctx) {
        this.branches.forEach(branch => {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            for (let i = 0; i < branch.points.length - 1; i++) {
                const p1 = branch.points[i];
                const p2 = branch.points[i + 1];
                
                const baseOpacity = 0.2 - (branch.depth * 0.04);
                ctx.lineWidth = p1.thickness;
                
                const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                gradient.addColorStop(0, `rgba(180, 130, 255, ${baseOpacity})`);
                gradient.addColorStop(1, `rgba(200, 160, 255, ${baseOpacity * 0.7})`);
                ctx.strokeStyle = gradient;
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
        
        this.impulses.forEach(impulse => impulse.draw(ctx));
    }
}

const neurons = [];
const cols = 5;
const rows = 4;
const marginX = canvas.width * 0.1;
const marginY = canvas.height * 0.1;
const spacingX = (canvas.width - marginX * 2) / (cols - 1);
const spacingY = (canvas.height - marginY * 2) / (rows - 1);

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const x = marginX + col * spacingX + (Math.random() - 0.5) * spacingX * 0.3;
        const y = marginY + row * spacingY + (Math.random() - 0.5) * spacingY * 0.3;
        neurons.push(new Neuron(x, y));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(13, 2, 33, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    neurons.forEach(neuron => {
        neuron.update();
        neuron.draw(ctx);
    });
    
    requestAnimationFrame(animate);
}

ctx.fillStyle = '#0d0221';
ctx.fillRect(0, 0, canvas.width, canvas.height);
animate();