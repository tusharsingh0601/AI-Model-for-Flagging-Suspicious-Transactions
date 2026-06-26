let behaviorChartInstance = null; // Variable to store the chart

function renderBehaviorChart() {
    // 1. If chart already exists, don't draw it again (prevents glitching)
    if (behaviorChartInstance) return;

    const canvas = document.getElementById('behaviorChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 2. Create the Chart
    behaviorChartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Mobile App', 'Desktop Web', 'API Access', 'Unknown', 'Tablet'],
            datasets: [{
                label: 'Logins',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(0, 242, 255, 0.6)',
                    'rgba(188, 19, 254, 0.6)',
                    'rgba(0, 255, 136, 0.6)',
                    'rgba(255, 42, 109, 0.6)',
                    'rgba(255, 174, 0, 0.6)'
                ],
                borderWidth: 1,
                borderColor: '#111'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { display: false, backdropColor: 'transparent' }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#fff' }
                }
            }
        }
    });
    console.log("Chart Rendered!");
}

document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. SIDEBAR NAVIGATION (MATCHES YOUR HTML)
    // ==================================================
    const navItems = document.querySelectorAll('.nav-item'); // This selects the <li>
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // No need for e.preventDefault() if clicking the <li>, 
            // but we add it in case you click the <a> inside it.

            // 1. Get the tab name from the data-tab attribute
            const tabName = item.getAttribute('data-tab');
            if (!tabName) return;

            // 2. Visual Update (Sidebar Active State)
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // 3. Update the Header Title (Optional but professional)
            const cleanTitle = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            if (pageTitle) pageTitle.innerText = cleanTitle + " Management";

            // 4. Switch Content Sections
            sections.forEach(section => {
                section.classList.add('hidden'); // Hide everything
                if (section.id === tabName) {
                    section.classList.remove('hidden'); // Show the one we want
                }
            });

            // 5. LAZY LOAD: If behavior tab, draw the chart
            if (tabName === 'behavior') {
                setTimeout(() => {
                    renderBehaviorChart();
                    window.dispatchEvent(new Event('resize'));
                }, 50);
            }

            console.log("Navigated to:", tabName);
        });
    });
    // ==================================================
    // 2. SAFE DATA LOADING
    // ==================================================
    const chartData = window.realData || {
        fraud_count: 0,
        safe_count: 0,
        labels: [],
        amounts: []
    };

    console.log("Dashboard Loaded. Data:", chartData);

    // ==================================================
    // 3. DOUGHNUT CHART (Fraud vs Safe)
    // ==================================================
    const canvasFraud = document.getElementById('doughnutChart');
    if (canvasFraud) {
        const ctxFraud = canvasFraud.getContext('2d');

        const safe = chartData.safe_count || 0;
        const fraud = chartData.fraud_count || 0;
        const totalTxns = safe + fraud;

        const doughnutData = totalTxns > 0 ? [safe, fraud] : [1];
        const doughnutColors = totalTxns > 0 ? ['#00ff88', '#ff2a6d'] : ['#333333'];
        const doughnutLabels = totalTxns > 0 ? ['Safe', 'Fraud'] : ['No Data'];

        new Chart(ctxFraud, {
            type: 'doughnut',
            data: {
                labels: doughnutLabels,
                datasets: [{
                    data: doughnutData,
                    backgroundColor: doughnutColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff' }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // ==================================================
    // 4. LINE CHART (Transaction Trend)
    // ==================================================
    const canvasMain = document.getElementById('mainChart');

    if (canvasMain) {
        const ctxMain = canvasMain.getContext('2d');

        const labels = chartData.labels || [];
        const dataPoints = chartData.amounts || [];

        new Chart(ctxMain, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Transaction Amount ($)',
                    data: dataPoints,
                    borderColor: '#00f2ff',
                    backgroundColor: 'rgba(0, 242, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#aaa' }
                    },
                    x: {
                        display: false
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }


});