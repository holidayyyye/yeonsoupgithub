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
        overall: [
            "오늘은 기운이 왕성하여 새로운 시작에 매우 길한 운세입니다. 망설이지 말고 도전해보세요. 다만, 섣부른 확신은 금물입니다.",
            "현재는 안정과 휴식이 필요한 시기입니다. 급하게 서두르기보다 내실을 다지는 데 집중하세요. 곧 좋은 기회가 찾아올 것입니다.",
            "인간관계에서 새로운 만남이 기대됩니다. 당신의 매력이 빛나는 하루이니, 적극적으로 소통해보세요. 뜻밖의 귀인을 만날 수도 있습니다.",
            "금전운이 서서히 상승하는 기운입니다. 작은 투자나 저축 계획을 세우는 것이 좋겠어요. 불필요한 지출은 피하는 것이 좋습니다.",
            "건강에 유의해야 할 운세입니다. 충분한 휴식과 규칙적인 생활로 몸과 마음을 돌보세요. 스트레스 관리가 중요합니다.",
            "학업이나 업무에서 좋은 성과를 기대할 수 있습니다. 집중력을 발휘하여 목표를 달성해보세요. 주변의 도움을 받는 것도 좋습니다."
        ],
        love: [
            "사랑하는 사람과의 관계가 더욱 깊어지는 운입니다. 진심을 나누고 서로를 존중하면 행복이 배가 될 것입니다.",
            "새로운 인연이 다가올 수 있는 시기입니다. 마음을 열고 긍정적인 자세로 임하면 좋은 만남을 가질 수 있습니다.",
            "오랜 연인이라면 서로의 믿음을 확인하고 미래를 계획하기에 좋습니다. 작은 이벤트로 사랑을 표현해보세요.",
            "솔로라면 평소와 다른 장소에서 뜻밖의 인연을 만날 수 있습니다. 적극적인 자세가 행운을 부를 것입니다."
        ],
        career: [
            "직장에서 당신의 능력을 인정받는 운입니다. 새로운 프로젝트나 업무에 적극적으로 참여하여 성과를 보여주세요.",
            "이직이나 새로운 직업을 고민하고 있다면 좋은 기회가 생길 수 있습니다. 신중하게 정보를 탐색하고 결정하세요.",
            "동료들과의 협력이 중요한 시기입니다. 팀워크를 발휘하면 더 큰 성공을 이룰 수 있습니다."
        ],
        wealth: [
            "예상치 못한 수입이 생길 수 있는 운입니다. 하지만 과도한 욕심은 금물! 현명하게 관리하는 지혜가 필요합니다.",
            "재정 상태를 점검하고 합리적인 소비 계획을 세우기에 좋은 시기입니다. 낭비를 줄이면 재물이 모일 것입니다.",
            "작은 투자는 길하나, 큰 모험은 피하는 것이 좋습니다. 전문가의 조언을 구하는 것도 도움이 됩니다."
        ],
        health: [
            "활력이 넘치고 건강한 기운이 가득한 시기입니다. 규칙적인 운동과 균형 잡힌 식단으로 현재를 유지하세요.",
            "스트레스가 쌓이기 쉬운 운이니, 취미 활동이나 명상으로 마음의 평화를 찾는 것이 중요합니다. 충분한 수면도 필수입니다.",
            "계절 변화에 따른 질환을 조심하세요. 미리 예방하고 몸의 변화에 귀 기울이는 것이 좋습니다."
        ]
    };

    const getFortuneSegment = (categoryArray) => categoryArray[Math.floor(Math.random() * categoryArray.length)];

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

            // Generate more complex fortune based on inputs
            // Example: Using birthDay and birthMonth for slight variation
            let overallFortune = getFortuneSegment(fortunes.overall);
            let loveFortune = getFortuneSegment(fortunes.love);
            let careerFortune = getFortuneSegment(fortunes.career);
            let wealthFortune = getFortuneSegment(fortunes.wealth);
            let healthFortune = getFortuneSegment(fortunes.health);
            
            // Add some "context" based on birthMonth or birthDay (very simplified simulation)
            if (birthMonth % 2 === 0) {
                overallFortune += "\n\n특히 주변 사람들과의 소통을 통해 뜻밖의 행운을 얻을 수 있습니다.";
            } else {
                overallFortune += "\n\n자신의 내면에 집중하며 새로운 영감을 얻을 수 있는 시기입니다.";
            }

            if (birthDay > 20) {
                careerFortune += "\n\n과감한 결단력이 필요한 때이니, 기회를 놓치지 마세요!";
            } else if (birthDay > 10) {
                wealthFortune += "\n\n안정적인 재물운이 따르니, 계획적인 지출이 중요합니다.";
            } else {
                loveFortune += "\n\n솔로라면 새로운 만남에, 커플이라면 깊은 교감에 좋은 운입니다.";
            }

            sajuResultText.textContent = `
당신의 ${birthYear}년 ${birthMonth}월 ${birthDay}일(${gender === 'male' ? '남성' : '여성'}) 사주 풀이입니다.

**[총 운세]**
${overallFortune}

**[애정운]**
${loveFortune}

**[직업운]**
${careerFortune}

**[재물운]**
${wealthFortune}

**[건강운]**
${healthFortune}

**잊지 마세요:** 이 사주는 재미를 위한 시뮬레이션입니다. 당신의 미래는 당신의 노력과 선택으로 만들어집니다!
`;

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