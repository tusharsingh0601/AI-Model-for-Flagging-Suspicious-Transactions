document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fraud-form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const amount = formData.get('amount');

        try {
            const response = await fetch('/predict/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `amount=${amount}`
            });

            const data = await response.json();

            if (data.is_fraud) {
                resultDiv.textContent = 'WARNING: High Probability of Fraud!';
                resultDiv.className = 'fraud';
            } else {
                resultDiv.textContent = 'Transaction appears safe.';
                resultDiv.className = 'safe';
            }
        } catch (error) {
            console.error('Error:', error);
            resultDiv.textContent = 'An error occurred during prediction.';
            resultDiv.className = '';
        }
    });
});

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
