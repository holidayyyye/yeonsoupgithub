document.addEventListener('DOMContentLoaded', () => {
    const nameContainer = document.getElementById('name-container');
    const resultContainer = document.getElementById('result-container');
    const submitButton = document.getElementById('submit-name');
    const nameInput = document.getElementById('name-input');

    submitButton.addEventListener('click', () => {
        // You can optionally use the name value for something,
        // but for now, we'll just show the result.
        const name = nameInput.value;

        nameContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    });
});
