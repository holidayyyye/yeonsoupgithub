document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submission-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const container = document.querySelector('.container'); // Assuming the form is inside .container

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let currentTheme = localStorage.getItem('theme'); // Can be 'dark' or 'light'

    // Set initial theme based on localStorage, default to 'light'
    if (!currentTheme) {
        currentTheme = 'light';
        localStorage.setItem('theme', currentTheme);
    }

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️'; // Sun emoji for dark mode (click to go light)
    } else { // currentTheme is 'light'
        // No class needed for light mode, as it's the default via :root
        themeToggle.textContent = '🌙'; // Moon emoji for light mode (click to go dark)
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                themeToggle.textContent = '🌙'; // Show moon
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.add('dark-mode');
                themeToggle.textContent = '☀️'; // Show sun
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Form Submission Logic
    if (form && thankYouMessage && container) {
        const goBackButton = document.getElementById('go-back-button');

        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(form);
            const formUrl = form.action;

            try {
                const response = await fetch(formUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for Formspree to return JSON
                    }
                });

                if (response.ok) {
                    // Formspree submission successful
                    container.style.display = 'none'; // Hide the form container
                    thankYouMessage.classList.remove('hidden'); // Show the thank you message
                    form.reset(); // Optionally clear the form fields
                } else {
                    // Formspree submission failed (e.g., validation error)
                    const data = await response.json();
                    alert(data.error || 'Form submission failed. Please try again.');
                    console.error('Formspree error:', data);
                }
            } catch (error) {
                // Network or other unexpected error
                alert('An error occurred during submission. Please try again later.');
                console.error('Submission error:', error);
            }
        });

        if (goBackButton) {
            goBackButton.addEventListener('click', function() {
                thankYouMessage.classList.add('hidden'); // Hide the thank you message
                container.style.display = 'block'; // Show the form container
            });
        }

    } else {
        console.error('Form, thank you message, container, or go back button element not found.');
    }
});