document.addEventListener('DOMContentLoaded', function() {
    // --- Firebase Configuration ---
    const firebaseConfig = {
      apiKey: "AIzaSyCQ0zGMNhZBz4fImnqd9yRN327fI2xOd3Q",
      authDomain: "yeonsoup-f985c.firebaseapp.com",
      projectId: "yeonsoup-f985c",
      storageBucket: "yeonsoup-f985c.firebasestorage.app",
      messagingSenderId: "622055626652",
      appId: "1:622055626652:web:a3a548abcb3ffcfb871a59"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    let travelData = {}; // This will be populated from Firebase

    // --- Basic UI Elements ---
    const thankYouMessage = document.getElementById('thank-you-message');
    const goBackButton = document.getElementById('go-back-button');

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = 'light';
        localStorage.setItem('theme', currentTheme);
    }
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- Navigation and Content Switching ---
    const showInvitationButton = document.getElementById('show-invitation');
    const showSajuButton = document.getElementById('show-saju');
    const showAlbumButton = document.getElementById('show-album');
    const invitationSection = document.getElementById('invitation-section');
    const sajuSection = document.getElementById('saju-section');
    const albumSection = document.getElementById('album-section');

    function showSection(sectionToShow) {
        invitationSection.classList.add('hidden');
        sajuSection.classList.add('hidden');
        albumSection.classList.add('hidden');
        showInvitationButton.classList.remove('active');
        showSajuButton.classList.remove('active');
        showAlbumButton.classList.remove('active');

        if (sectionToShow === 'invitation') {
            invitationSection.classList.remove('hidden');
            showInvitationButton.classList.add('active');
        } else if (sectionToShow === 'saju') {
            sajuSection.classList.remove('hidden');
            showSajuButton.classList.add('active');
        } else if (sectionToShow === 'album') {
            albumSection.classList.remove('hidden');
            showAlbumButton.classList.add('active');
            albumList.classList.remove('hidden');
            photoDisplayArea.classList.add('hidden');
            backToAlbumListButton.classList.add('hidden');
            adminPanel.classList.add('hidden');
            adminPasswordInput.value = '';
            addDestinationButton.classList.add('hidden');
            exitAdminModeButton.classList.add('hidden');
            adminPasswordInput.classList.remove('hidden');
            adminPasswordSubmit.classList.remove('hidden');
        }
    }

    if (showInvitationButton && showSajuButton && showAlbumButton) {
        showInvitationButton.addEventListener('click', () => showSection('invitation'));
        showSajuButton.addEventListener('click', () => showSection('saju'));
        showAlbumButton.addEventListener('click', () => showSection('album'));
    }

    // --- Album and Firebase Logic ---
    const albumList = document.getElementById('album-list');
    const photoDisplayArea = document.getElementById('photo-display-area');
    const photoDisplayAreaTitle = photoDisplayArea.querySelector('h2');
    const photoGrid = document.getElementById('photo-grid');
    const backToAlbumListButton = document.getElementById('back-to-album-list');
    
    // Function to render the list of destinations from travelData object
    function renderAlbumList() {
        albumList.innerHTML = ''; // Clear the list first
        if (!travelData) {
            const noDataItem = document.createElement('li');
            noDataItem.textContent = '여행지가 없습니다. 관리자 모드에서 추가해주세요.';
            albumList.appendChild(noDataItem);
            return;
        }
        for (const destinationId in travelData) {
            const destination = travelData[destinationId];
            const li = document.createElement('li');
            li.dataset.destination = destinationId;
            li.textContent = destination.name;
            albumList.appendChild(li);
        }
    }

    // Listen for real-time updates from Firebase
    const destinationsRef = database.ref('destinations');
    destinationsRef.on('value', (snapshot) => {
        travelData = snapshot.val();
        renderAlbumList(); // Re-render the list whenever data changes
    });
    
    function displayDestinationPhotos(destinationId) {
        const destination = travelData[destinationId];
        if (!destination) return;

        albumList.classList.add('hidden');
        photoDisplayArea.classList.remove('hidden');
        backToAlbumListButton.classList.remove('hidden');
        photoDisplayAreaTitle.textContent = destination.name + ' 사진';
        photoGrid.innerHTML = '';

        if (destination.photos && Array.isArray(destination.photos)) {
            destination.photos.forEach(photoUrl => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('photo-item');
                const img = document.createElement('img');
                img.src = photoUrl;
                img.alt = destination.name + ' 사진';
                imgContainer.appendChild(img);
                photoGrid.appendChild(imgContainer);
            });
        }
        adminPanel.classList.add('hidden');
        adminPasswordInput.value = '';
        addDestinationButton.classList.add('hidden');
        exitAdminModeButton.classList.add('hidden');
        adminPasswordInput.classList.remove('hidden');
        adminPasswordSubmit.classList.remove('hidden');
    }

    albumList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'LI' && target.dataset.destination) {
            displayDestinationPhotos(target.dataset.destination);
        }
    });

    backToAlbumListButton.addEventListener('click', () => {
        photoDisplayArea.classList.add('hidden');
        backToAlbumListButton.classList.add('hidden');
        albumList.classList.remove('hidden');
    });

    // --- Admin Logic ---
    const adminModeToggle = document.getElementById('admin-mode-toggle');
    const adminPanel = document.getElementById('admin-panel');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminPasswordSubmit = document.getElementById('admin-password-submit');
    const addDestinationButton = document.getElementById('add-destination-button');
    const exitAdminModeButton = document.getElementById('exit-admin-mode');
    const ADMIN_PASSWORD = "gemini";

    adminModeToggle.addEventListener('click', () => {
        adminPanel.classList.toggle('hidden');
        adminPasswordInput.value = '';
        addDestinationButton.classList.add('hidden');
        exitAdminModeButton.classList.add('hidden');
        adminPasswordInput.classList.remove('hidden');
        adminPasswordSubmit.classList.remove('hidden');
    });

    adminPasswordSubmit.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            alert('관리자 모드 활성화!');
            addDestinationButton.classList.remove('hidden');
            exitAdminModeButton.classList.remove('hidden');
            adminPasswordInput.classList.add('hidden');
            adminPasswordSubmit.classList.add('hidden');
        } else {
            alert('비밀번호가 올바르지 않습니다.');
            adminPasswordInput.value = '';
        }
    });

    exitAdminModeButton.addEventListener('click', () => {
        adminPanel.classList.add('hidden');
    });

    addDestinationButton.addEventListener('click', () => {
        const destinationName = prompt('새 여행지의 이름을 입력하세요:');
        if (destinationName) {
            const destinationId = destinationName.toLowerCase().replace(/\s+/g, '-');
            const photoUrlsString = prompt('사진 URL을 쉼표(,)로 구분하여 입력하세요:');
            const photoUrls = photoUrlsString ? photoUrlsString.split(',').map(url => url.trim()) : [];

            // Write to Firebase
            database.ref('destinations/' + destinationId).set({
                name: destinationName,
                photos: photoUrls
            }).then(() => {
                alert(`새 여행지 "${destinationName}"이 Firebase에 저장되었습니다.`);
            }).catch((error) => {
                alert('데이터 저장에 실패했습니다: ' + error.message);
            });
        }
    });

    // --- Form Submission Logic (Invitation) ---
    const invitationForm = document.getElementById('submission-form');
    if (invitationForm) {
        invitationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(invitationForm);
            try {
                const response = await fetch(invitationForm.action, {
                    method: 'POST', body: formData, headers: {'Accept': 'application/json'}
                });
                if (response.ok) {
                    invitationForm.parentElement.style.display = 'none';
                    thankYouMessage.classList.remove('hidden');
                    invitationForm.reset();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Form submission failed.');
                }
            } catch (error) {
                alert('An error occurred during submission.');
            }
        });
    }

    if (goBackButton) {
        goBackButton.addEventListener('click', () => {
            thankYouMessage.classList.add('hidden');
            invitationForm.parentElement.style.display = 'block';
            showSection('invitation');
        });
    }

    // --- Saju Logic (Unchanged) ---
    const sajuForm = document.getElementById('saju-form');
    const sajuResultDiv = document.getElementById('saju-result');
    const sajuResultText = document.getElementById('saju-text');
    const sajuResetButton = document.getElementById('saju-reset-button');
    if (sajuForm) {
        // ... (saju logic remains the same)
    }
    
    // --- Initial Load ---
    showSection('invitation');
});