document.addEventListener('DOMContentLoaded', () => {
    const nameContainer = document.getElementById('name-container');
    const resultContainer = document.getElementById('result-container');
    const submitButton = document.getElementById('submit-name');
    const nameInput = document.getElementById('name-input');
    const resultText = document.getElementById('result-text'); // Get result text element

    submitButton.addEventListener('click', () => {
        const name = nameInput.value.trim(); // Get name and trim whitespace

        // Update result text with the entered name, or a default if empty
        if (name) {
            resultText.textContent = `${name}님 똥 먹으세요`;
        } else {
            resultText.textContent = `이름 없는 분 똥 먹으세요`; // Default message
        }

        nameContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    });
});
