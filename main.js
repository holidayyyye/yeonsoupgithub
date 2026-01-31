document.addEventListener('DOMContentLoaded', function() {
    const thankYouMessage = document.getElementById('thank-you-message');
    const goBackButton = document.getElementById('go-back-button');

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

    // Navigation and Content Switching Logic
    const showInvitationButton = document.getElementById('show-invitation');
    const showSajuButton = document.getElementById('show-saju');
    const invitationSection = document.getElementById('invitation-section');
    const sajuSection = document.getElementById('saju-section');

    function showSection(sectionToShow) {
        invitationSection.classList.add('hidden');
        sajuSection.classList.add('hidden');

        showInvitationButton.classList.remove('active');
        showSajuButton.classList.remove('active');

        if (sectionToShow === 'invitation') {
            invitationSection.classList.remove('hidden');
            showInvitationButton.classList.add('active');
        } else if (sectionToShow === 'saju') {
            sajuSection.classList.remove('hidden');
            showSajuButton.classList.add('active');
        }
    }

    if (showInvitationButton && showSajuButton) {
        showInvitationButton.addEventListener('click', function() {
            showSection('invitation');
        });

        showSajuButton.addEventListener('click', function() {
            showSection('saju');
        });
    }

    // Form Submission Logic for Invitation Form
    const invitationForm = document.getElementById('submission-form');
    const invitationFormContainer = invitationSection.querySelector('.container'); // Get container within invitation section

    if (invitationForm && thankYouMessage && invitationFormContainer) {
        invitationForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(invitationForm);
            const formUrl = invitationForm.action;

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
                    invitationFormContainer.style.display = 'none'; // Hide the form container
                    thankYouMessage.classList.remove('hidden'); // Show the thank you message
                    invitationForm.reset(); // Optionally clear the form fields
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
    }

    if (goBackButton) { // Ensure goBackButton listener is always attached
        goBackButton.addEventListener('click', function() {
            thankYouMessage.classList.add('hidden'); // Hide the thank you message
            // Decide which section to show when returning, default to invitation
            showSection('invitation');
            // If the user was in saju section, maybe return to saju section?
            // For now, always return to invitation section
            invitationFormContainer.style.display = 'block'; // Ensure form container is visible if returning to invitation
        });
    }


    // Placeholder Saju (Fortune-Telling) Logic
    const sajuForm = document.getElementById('saju-form');
    const sajuResultDiv = document.getElementById('saju-result');
    const sajuResultText = document.getElementById('saju-text');
    const sajuResetButton = document.getElementById('saju-reset-button');
    const sajuFormContainer = sajuSection.querySelector('.container'); // Get container within saju section

    // Placeholder fortune messages - more varied and context-aware
    const fortunes = {
        general: [
            "오늘은 운수 대통! 모든 일이 술술 풀릴 거예요.",
            "조금은 조심해야 할 하루네요. 중요한 결정은 신중하게!",
            "새로운 기회가 찾아올 거예요. 용기를 내어 도전하세요.",
            "사랑과 행복이 가득한 날이에요. 주변 사람들에게 감사함을 표현해 보세요.",
            "건강에 유의해야 해요. 충분한 휴식을 취하는 것이 중요합니다.",
            "금전운이 상승하고 있어요. 작은 행운을 기대해 봐도 좋겠네요.",
            "뜻밖의 소식이 들려올 수 있어요. 긍정적인 마음으로 기다려 보세요.",
            "인간관계에서 좋은 변화가 있을 거예요. 마음을 열고 대화해 보세요."
        ],
        luckyDays: [
            "오늘은 행운이 가득한 날입니다. 새로운 시작에 길한 운이 따를 것입니다.",
            "뜻밖의 좋은 소식이 들려올 수 있습니다. 마음을 열고 받아들이세요.",
            "노력한 만큼의 결실을 맺을 운입니다. 꾸준히 나아가세요."
        ],
        cautionDays: [
            "오늘은 신중함이 필요한 하루입니다. 섣부른 판단은 피하세요.",
            "주변 사람들과의 오해를 조심하세요. 침착하게 대처하는 것이 중요합니다.",
            "예상치 못한 지출이 발생할 수 있습니다. 금전 관리에 신경 쓰세요."
        ],
        neutralDays: [
            "평온하고 무난한 하루가 예상됩니다. 일상을 즐기며 에너지를 충전하세요.",
            "큰 변화는 없지만, 소소한 기쁨을 찾을 수 있는 날입니다.",
            "현재에 만족하고 미래를 위한 계획을 세우기에 좋은 시기입니다."
        ]
    };

    if (sajuForm && sajuResultDiv && sajuResultText && sajuResetButton && sajuFormContainer) {
        sajuForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Simulate fortune-telling based on inputs (simplified)
            const birthYear = parseInt(sajuForm.elements['birth-year'].value);
            const birthMonth = parseInt(sajuForm.elements['birth-month'].value);
            const birthDay = parseInt(sajuForm.elements['birth-day'].value);
            const gender = sajuForm.elements['gender'].value;

            if (!birthYear || !birthMonth || !birthDay || !gender) {
                alert('모든 필수 정보를 입력해주세요.');
                return;
            }

            // Simple deterministic fortune based on birth day parity
            let fortuneCategory;
            if (birthDay % 3 === 0) { // Example: Day divisible by 3 is lucky
                fortuneCategory = fortunes.luckyDays;
            } else if (birthDay % 3 === 1) { // Example: Day with remainder 1 is caution
                fortuneCategory = fortunes.cautionDays;
            } else { // Example: Day with remainder 2 is neutral
                fortuneCategory = fortunes.neutralDays;
            }
            
            const selectedFortune = fortuneCategory[Math.floor(Math.random() * fortuneCategory.length)];

            sajuResultText.textContent = `당신의 ${birthYear}년 ${birthMonth}월 ${birthDay}일(${gender === 'male' ? '남성' : '여성'}) 사주는 다음과 같습니다:\n\n${selectedFortune}\n\n${fortunes.general[Math.floor(Math.random() * fortunes.general.length)]}`;

            sajuForm.style.display = 'none'; // Hide form
            sajuResultDiv.classList.remove('hidden'); // Show result
        });

        sajuResetButton.addEventListener('click', function() {
            sajuResultDiv.classList.add('hidden'); // Hide result
            sajuForm.style.display = 'block'; // Show form
            sajuForm.reset(); // Clear form fields
        });
    }

    // Initialize to show invitation section
    showSection('invitation');
});