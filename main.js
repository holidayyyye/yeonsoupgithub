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
    const storage = firebase.storage();
    let travelData = {};

    // --- Admin Logic State ---
    let isAdmin = false;

    // --- UI Elements ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const showInvitationButton = document.getElementById('show-invitation');
    const showSajuButton = document.getElementById('show-saju');
    const showAlbumButton = document.getElementById('show-album');
    const invitationSection = document.getElementById('invitation-section');
    const sajuSection = document.getElementById('saju-section');
    const albumSection = document.getElementById('album-section');
    const albumList = document.getElementById('album-list');
    const photoDisplayArea = document.getElementById('photo-display-area');
    const photoDisplayAreaTitle = photoDisplayArea.querySelector('h2');
    const photoGrid = document.getElementById('photo-grid');
    const backToAlbumListButton = document.getElementById('back-to-album-list');
    const adminModeToggle = document.getElementById('admin-mode-toggle');
    const adminPanel = document.getElementById('admin-panel');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminPasswordSubmit = document.getElementById('admin-password-submit');
    const addDestinationForm = document.getElementById('add-destination-form');
    const exitAdminModeButton = document.getElementById('exit-admin-mode');
    const uploadProgressContainer = document.getElementById('upload-progress-container');
    const photoAdminControls = document.getElementById('photo-admin-controls');
    const addMorePhotosInput = document.getElementById('add-more-photos-input');
    const moreUploadProgressContainer = document.getElementById('more-upload-progress-container');

    // --- Theme Toggle ---
    let currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-mode', currentTheme === 'dark');
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', currentTheme);
    });

    // --- Navigation ---
    function showSection(sectionToShow) {
        [invitationSection, sajuSection, albumSection].forEach(s => s.classList.add('hidden'));
        [showInvitationButton, showSajuButton, showAlbumButton].forEach(b => b.classList.remove('active'));
        
        const sectionMap = { invitation: invitationSection, saju: sajuSection, album: albumSection };
        const buttonMap = { invitation: showInvitationButton, saju: showSajuButton, album: showAlbumButton };
        
        if (sectionMap[sectionToShow]) {
            sectionMap[sectionToShow].classList.remove('hidden');
            buttonMap[sectionToShow].classList.add('active');
        }

        if (sectionToShow === 'album') {
            photoDisplayArea.classList.add('hidden');
            albumList.classList.remove('hidden');
            // If not in admin mode, ensure admin panel is hidden
            if (!isAdmin) {
                adminPanel.classList.add('hidden');
            } else {
                // If in admin mode, and on album section, ensure admin controls are visible
                // but not the password input if already logged in
                adminPanel.classList.remove('hidden');
                adminPasswordInput.classList.add('hidden');
                adminPasswordSubmit.classList.add('hidden');
                addDestinationForm.classList.remove('hidden');
                exitAdminModeButton.classList.remove('hidden');
            }
        }
    }
    [showInvitationButton, showSajuButton, showAlbumButton].forEach(button => {
        button.addEventListener('click', () => showSection(button.id.replace('show-', '')));
    });

    // --- Album List Rendering ---
    function renderAlbumList() {
        albumList.innerHTML = '';
        if (!travelData) {
            albumList.innerHTML = '<li>여행지가 없습니다. 관리자 모드에서 추가해주세요.</li>';
            return;
        }
        for (const destinationId in travelData) {
            const destination = travelData[destinationId];
            const li = document.createElement('li');
            li.dataset.destination = destinationId;
            li.textContent = destination.name;
            if (isAdmin) {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '삭제';
                deleteButton.className = 'delete-album-button admin-button';
                deleteButton.dataset.destinationId = destinationId;
                li.appendChild(deleteButton);
            }
            albumList.appendChild(li);
        }
    }

    // --- Photo Display Rendering ---
    function displayDestinationPhotos(destinationId) {
        const destination = travelData[destinationId];
        if (!destination) return;
    
        photoAdminControls.dataset.destinationId = destinationId; // Store current destination
        albumList.classList.add('hidden');
        photoDisplayArea.classList.remove('hidden');
        backToAlbumListButton.classList.remove('hidden');
        photoDisplayAreaTitle.textContent = destination.name + ' 사진';
        photoGrid.innerHTML = '';
        photoAdminControls.classList.toggle('hidden', !isAdmin);
    
        if (destination.photos && Array.isArray(destination.photos)) {
            destination.photos.forEach((photoUrl, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('photo-item');
                const img = document.createElement('img');
                img.src = photoUrl;
                img.alt = `${destination.name} 사진 ${index + 1}`;
                imgContainer.appendChild(img);
    
                if (isAdmin) {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '×';
                    deleteButton.className = 'delete-photo-button';
                    deleteButton.dataset.photoUrl = photoUrl;
                    deleteButton.dataset.destinationId = destinationId;
                    imgContainer.appendChild(deleteButton);
                }
                photoGrid.appendChild(imgContainer);
            });
        }
    }

    // --- Firebase Data Sync ---
    const destinationsRef = database.ref('destinations');
    destinationsRef.on('value', (snapshot) => {
        travelData = snapshot.val();
        renderAlbumList();
        // If user is viewing a destination, refresh it
        const currentDestinationId = photoAdminControls.dataset.destinationId;
        if (currentDestinationId && !photoDisplayArea.classList.contains('hidden')) {
            displayDestinationPhotos(currentDestinationId);
        }
    });

    // --- Event Listeners ---
    albumList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('delete-album-button')) {
            const destinationId = target.dataset.destinationId;
            const destination = travelData[destinationId];
            if (confirm(`'${destination.name}' 앨범을 정말로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
                const photoDeletionPromises = (destination.photos || []).map(url => storage.refFromURL(url).delete());
                Promise.all(photoDeletionPromises)
                    .then(() => database.ref('destinations/' + destinationId).remove())
                    .then(() => alert('앨범이 성공적으로 삭제되었습니다.'))
                    .catch(err => alert('앨범 삭제 중 오류: ' + err.message));
            }
        } else if (target.tagName === 'LI' && target.dataset.destination) {
            displayDestinationPhotos(target.dataset.destination);
        }
    });

    photoGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-photo-button')) {
            const { photoUrl, destinationId } = event.target.dataset;
            if (confirm('이 사진을 삭제하시겠습니까?')) {
                storage.refFromURL(photoUrl).delete()
                    .then(() => {
                        const currentPhotos = travelData[destinationId].photos || [];
                        const updatedPhotos = currentPhotos.filter(url => url !== photoUrl);
                        return database.ref(`destinations/${destinationId}/photos`).set(updatedPhotos);
                    })
                    .then(() => alert('사진이 삭제되었습니다.'))
                    .catch(err => alert('사진 삭제 중 오류: ' + err.message));
            }
        }
    });

    backToAlbumListButton.addEventListener('click', () => {
        photoDisplayArea.classList.add('hidden');
        albumList.classList.remove('hidden');
        photoAdminControls.dataset.destinationId = ''; // Clear current destination
        photoAdminControls.classList.add('hidden'); // Ensure photo admin controls are hidden when going back
    });

    // --- Admin Panel ---
    adminModeToggle.addEventListener('click', () => {
        if (isAdmin) { // If already in admin mode, clicking toggle deactivates it
            isAdmin = false;
            adminPanel.classList.add('hidden');
            alert('관리자 모드 비활성화.');
            renderAlbumList(); // Re-render to hide delete buttons
            // Also hide admin forms/buttons that would otherwise be visible
            addDestinationForm.classList.add('hidden');
            exitAdminModeButton.classList.add('hidden');
            photoAdminControls.classList.add('hidden'); // Ensure photo admin controls are hidden
        } else { // If not in admin mode, show password panel
            adminPanel.classList.remove('hidden');
            adminPasswordInput.classList.remove('hidden'); // Ensure password input is visible
            adminPasswordSubmit.classList.remove('hidden'); // Ensure password submit is visible
            adminPasswordInput.focus();
            // Hide other admin controls until password is correct
            addDestinationForm.classList.add('hidden');
            exitAdminModeButton.classList.add('hidden');
            photoAdminControls.classList.add('hidden');
        }
        adminPasswordInput.value = ''; // Clear password field
    });

    adminPasswordSubmit.addEventListener('click', () => {
        if (adminPasswordInput.value === "gemini") {
            isAdmin = true;
            alert('관리자 모드 활성화!');
            adminPanel.classList.remove('hidden'); // Keep admin panel visible
            adminPasswordInput.classList.add('hidden'); // Hide password input
            adminPasswordSubmit.classList.add('hidden'); // Hide password submit button
            addDestinationForm.classList.remove('hidden'); // Show album add form
            exitAdminModeButton.classList.remove('hidden'); // Show exit button
            renderAlbumList(); // Re-render album list with delete buttons

            // If currently on a photo view, show photo admin controls
            const currentDestinationId = photoAdminControls.dataset.destinationId;
            if (currentDestinationId && !photoDisplayArea.classList.contains('hidden')) {
                displayDestinationPhotos(currentDestinationId);
            }
        } else {
            alert('비밀번호가 올바르지 않습니다.');
            adminPasswordInput.value = '';
        }
    });

    exitAdminModeButton.addEventListener('click', () => {
        isAdmin = false;
        adminPanel.classList.add('hidden'); // Hide the entire admin panel
        addDestinationForm.classList.add('hidden'); // Hide album add form
        photoAdminControls.classList.add('hidden'); // Hide photo admin controls
        renderAlbumList(); // Re-render album list to hide delete buttons
        alert('관리자 모드 비활성화.');
    });

    // --- File Upload Forms ---
    function handleFileUpload(files, container, onComplete) {
        if (files.length === 0) return;
        container.innerHTML = `<span>업로드 중: 0/${files.length}</span>`;
        const uploadPromises = Array.from(files).map(file => {
            const fileName = `${Date.now()}-${file.name}`;
            const storageRef = storage.ref(`photos/${fileName}`);
            return storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
        });

        Promise.all(uploadPromises)
            .then(onComplete)
            .catch(err => {
                alert('업로드 중 오류가 발생했습니다: ' + err.message);
                container.innerHTML = '<span style="color: red;">업로드 실패</span>';
            });
    }

    addDestinationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const destinationName = document.getElementById('new-destination-name').value.trim();
        const files = document.getElementById('new-photos-input').files;
        if (!destinationName || files.length === 0) {
            alert('앨범 이름과 사진을 모두 선택하세요.');
            return;
        }
        handleFileUpload(files, uploadProgressContainer, (photoUrls) => {
            const destinationId = destinationName.toLowerCase().replace(/\s+/g, '-');
            database.ref('destinations/' + destinationId).set({ name: destinationName, photos: photoUrls })
                .then(() => {
                    alert('새 앨범이 추가되었습니다.');
                    addDestinationForm.reset();
                    uploadProgressContainer.innerHTML = '';
                });
        });
    });

    addMorePhotosInput.addEventListener('change', (event) => {
        const files = event.target.files;
        const destinationId = photoAdminControls.dataset.destinationId;
        if (!destinationId || files.length === 0) return;

        handleFileUpload(files, moreUploadProgressContainer, (newUrls) => {
            const existingPhotos = travelData[destinationId]?.photos || [];
            const updatedPhotos = [...existingPhotos, ...newUrls];
            database.ref(`destinations/${destinationId}/photos`).set(updatedPhotos)
                .then(() => {
                    alert(`${files.length}개의 사진이 추가되었습니다.`);
                    moreUploadProgressContainer.innerHTML = '';
                    addMorePhotosInput.value = ''; // Reset file input
                });
        });
    });
    
    // Initial Load
    showSection('invitation');
    
    // Hide saju logic for brevity
    const sajuForm = document.getElementById('saju-form');
    if (sajuForm) {
        // saju logic...
    }
});