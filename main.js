document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('housewarming-form');
    const container = document.querySelector('.container'); // The form container
    const thankYouMessage = document.getElementById('thank-you-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // In a real application, you would collect form data here
        // const formData = new FormData(form);
        // for (let [name, value] of formData.entries()) {
        //     console.log(`${name}: ${value}`);
        // }

        // Hide the form container
        container.classList.add('hidden');

        // Show the thank you message
        thankYouMessage.classList.remove('hidden');
    });
});