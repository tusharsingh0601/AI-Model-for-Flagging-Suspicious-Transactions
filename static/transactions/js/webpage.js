document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Canvas Neural Network Background Effect (Keep this as is) ---
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 150;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(188, 19, 254, ${1 - dist / connectionDistance})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- 2. Scroll Animations & Counters (Keep this as is) ---
    const observerOptions = { threshold: 0.1 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show-scroll');
        });
    }, observerOptions);
    document.querySelectorAll('.hidden-scroll').forEach((el) => scrollObserver.observe(el));

    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats-section');
    let counted = false;
    const startCounting = () => {
        if (counted) return;
        counted = true;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 100;
            const update = () => {
                const c = +counter.innerText;
                if (c < target) {
                    counter.innerText = Math.ceil(c + increment);
                    setTimeout(update, 20);
                } else {
                    counter.innerText = target.toLocaleString() + "+";
                }
            };
            update();
        });
    };
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startCounting();
    }, { threshold: 0.5 });
    if (statsSection) statsObserver.observe(statsSection);


    // --- 3. HELPER: Get CSRF Token ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    // --- 4. MAIN LOGIC: Connect to Python Backend ---
    async function runSimulation() {
        const loader = document.getElementById('loader-overlay');
        const loadingText = document.getElementById('loading-text');

        // Show Loader
        loader.classList.remove('hidden');
        loadingText.innerText = "Connecting to Neural Network...";

        // Get Input Values
        const idInput = document.getElementById('txn-id').value || "UNKNOWN-ID";
        const amountInput = document.getElementById('txn-amount').value;
        const locInput = document.getElementById('txn-location').value || "Unknown Location";

        // Default to 0 if empty to prevent crash
        const amountToSend = amountInput ? amountInput : 0;

        try {
            // SEND DATA TO DJANGO
            const response = await fetch('/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    step: 1,
                    type: "TRANSFER",
                    amount: parseFloat(amountToSend),
                    oldbalanceOrg: parseFloat(amountToSend),
                    newbalanceOrig: 0,
                    oldbalanceDest: 0,
                    newbalanceDest: parseFloat(amountToSend)
                })
            });

            const data = await response.json();

            // Hide Loader
            loader.classList.add('hidden');

            // 1. Show the result immediately
            if (data.is_fraud) {
                alert(`⚠️ ALERT: High Risk Transaction Detected!\n\nClick OK to view details in Dashboard.`);
            } else {
                alert(`✅ Success: Transaction is Safe.\n\nClick OK to view details in Dashboard.`);
            }

            // 2. REDIRECT to Dashboard
            window.location.href = "/dashboard/";

        } catch (error) {
            // ... error handling stays the same ...
            loader.classList.add('hidden');
            console.error('Error:', error);
            alert("System Error: Could not connect to AI Engine.");
        }
    }

    // Bind Event Listeners
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        runSimulation();
    });

    const uploadBtn = document.getElementById('upload-analyze-btn');
    uploadBtn.addEventListener('click', async () => {

        const file = fileInput.files[0];

        if (!file) {
            alert("Please select CSV file");
            return;
        }

        const formData = new FormData();
        formData.append("csv_file", file);

        try {

            const response = await fetch('/predict_csv/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                console.log(data);
                return;
            }

            alert(
                `Processed ${data.total} Transactions\nFrauds Detected: ${data.fraud_count}`
            );

            window.location.href = "/dashboard/";

        } catch (err) {
            console.error(err);
            alert(err);
        }
    });

    // File Input Logic (Visual only for now)
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const fileInfo = document.getElementById('file-info');

    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    function handleFile(file) {
        if (file.name.endsWith('.csv')) {
            fileInfo.innerHTML = `<i class="fa-solid fa-file-csv"></i> ${file.name}`;
            fileInfo.classList.remove('hidden');
            uploadBtn.disabled = false;
        } else {
            alert('Only CSV files are allowed.');
        }
    }
});