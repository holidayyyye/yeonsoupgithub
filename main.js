document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submission-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const container = document.querySelector('.container'); // Assuming the form is inside .container

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