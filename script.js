// State Management
let rooms = JSON.parse(localStorage.getItem('resort_rooms')) || [
    {
    number: "511",
    name: "SAFRA511",
    password: "Net#2023%"
    },
    {
    number: "512",
    name: "SAFRA512",
    password: "2000%Safra@"
    },
    {
    number: "521",
    name: "SAFRA521",
    password: "521#2023%"
    },
    {
    number: "522",
    name: "SAFRA522",
    password: "Safra#2023#1"
    },
    {
    number: "531",
    name: "SAFRA531",
    password: "2000@Safra"
    },
    {
    number: "532",
    name: "SAFRA532",
    password: "Safra*2023"
    },
    {
    number: "541",
    name: "SAFRA541",
    password: "541#2023"
    },
    {
    number: "542",
    name: "SAFRA542",
    password: "2023%542"
    },
    {
    number: "551",
    name: "SAFRA551",
    password: "551@Safra"
    },
    {
    number: "552",
    name: "SAFRA552",
    password: "Safra@2023"
    },
    {
    number: "561",
    name: "SAFRA561",
    password: "NetWifi@2023"
    },
    {
    number: "562",
    name: "SAFRA562",
    password: "???"
    }
];
let deleteIndex = null;

// DOM Elements
const roomGrid = document.getElementById('roomGrid');
const roomForm = document.getElementById('roomForm');
const roomModal = document.getElementById('roomModal');
const confirmModal = document.getElementById('confirmModal');
const addRoomBtn = document.getElementById('addRoomBtn');
const searchBar = document.getElementById('searchBar');
const totalRoomsSpan = document.getElementById('totalRooms');
const toast = document.getElementById('toast');
const toggleModalPwd = document.getElementById('toggleModalPwd');
const wifiPasswordInput = document.getElementById('wifiPassword');

// Modal Elements
const modalTitle = document.getElementById('modalTitle');
const editIndexInput = document.getElementById('editIndex');
const roomNumberInput = document.getElementById('roomNumber');
const wifiNameInput = document.getElementById('wifiName');
const confirmRoomNumSpan = document.getElementById('confirmRoomNum');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderRooms();
});

// Functions
function saveToLocalStorage() {
    localStorage.setItem('resort_rooms', JSON.stringify(rooms));
    updateStats();
}

function updateStats() {
    totalRoomsSpan.textContent = `Total Rooms: ${rooms.length}`;
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function renderRooms(filter = '') {
    roomGrid.innerHTML = '';
    
    const filteredRooms = rooms.filter(room => 
        room.number.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredRooms.length === 0) {
        roomGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>${filter ? 'No rooms match your search.' : 'No rooms added yet. Click \'Add New Room\' to get started.'}</p>
            </div>
        `;
        return;
    }

    filteredRooms.forEach((room, index) => {
        // Find original index for editing/deleting when filtered
        const originalIndex = rooms.findIndex(r => r === room);
        
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <h3>Room ${room.number} <span>ID: ${originalIndex + 1}</span></h3>
            <div class="wifi-info">
                <div class="info-item">
                    <span class="info-label">Wi-Fi Name</span>
                    <div class="info-value-wrapper">
                        <span class="info-value">${room.name}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${room.name}', 'Wi-Fi Name')" title="Copy Name">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="info-item">
                    <span class="info-label">Password</span>
                    <div class="info-value-wrapper">
                        <span class="info-value pwd-text" id="pwd-${originalIndex}">••••••••</span>
                        <div class="action-btns">
                            <button class="copy-btn" onclick="togglePassword(${originalIndex}, '${room.password}')" title="Show/Hide">
                                <i class="fas fa-eye" id="eye-${originalIndex}"></i>
                            </button>
                            <button class="copy-btn" onclick="copyToClipboard('${room.password}', 'Password')" title="Copy Password">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-secondary btn-sm" onclick="openEditModal(${originalIndex})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${originalIndex})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        roomGrid.appendChild(card);
    });
    updateStats();
}

// Modal Logic
function openAddModal() {
    modalTitle.textContent = 'Add New Room';
    roomForm.reset();
    editIndexInput.value = '';
    wifiPasswordInput.type = 'password';
    document.getElementById('toggleModalPwd').innerHTML = '<i class="fas fa-eye"></i>';
    roomModal.classList.add('active');
}

function openEditModal(index) {
    const room = rooms[index];
    modalTitle.textContent = 'Edit Room Details';
    editIndexInput.value = index;
    roomNumberInput.value = room.number;
    wifiNameInput.value = room.name;
    wifiPasswordInput.value = room.password;
    wifiPasswordInput.type = 'password';
    document.getElementById('toggleModalPwd').innerHTML = '<i class="fas fa-eye"></i>';
    roomModal.classList.add('active');
}

function closeModal() {
    roomModal.classList.remove('active');
    confirmModal.classList.remove('active');
}

// Event Listeners
addRoomBtn.addEventListener('click', openAddModal);

document.querySelectorAll('.close-btn, #cancelDelete').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

window.addEventListener('click', (e) => {
    if (e.target === roomModal || e.target === confirmModal) {
        closeModal();
    }
});

roomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const index = editIndexInput.value;
    const roomData = {
        number: roomNumberInput.value.trim(),
        name: wifiNameInput.value.trim(),
        password: wifiPasswordInput.value.trim()
    };

    if (index === '') {
        // Add new
        rooms.push(roomData);
        showToast('Room added successfully!');
    } else {
        // Update existing
        rooms[index] = roomData;
        showToast('Room updated successfully!');
    }

    saveToLocalStorage();
    renderRooms(searchBar.value);
    closeModal();
});

// Search functionality
searchBar.addEventListener('input', (e) => {
    renderRooms(e.target.value);
});

// Toggle Password visibility in modal
toggleModalPwd.addEventListener('click', () => {
    const type = wifiPasswordInput.type === 'password' ? 'text' : 'password';
    wifiPasswordInput.type = type;
    toggleModalPwd.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Utility Functions exposed to window for inline onclick
window.togglePassword = (index, password) => {
    const pwdSpan = document.getElementById(`pwd-${index}`);
    const eyeIcon = document.getElementById(`eye-${index}`);
    
    if (pwdSpan.textContent === '••••••••') {
        pwdSpan.textContent = password;
        eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        pwdSpan.textContent = '••••••••';
        eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
};

window.copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard!`, 'info');
    }).catch(err => {
        showToast('Failed to copy text', 'error');
    });
};

window.openDeleteModal = (index) => {
    deleteIndex = index;
    confirmRoomNumSpan.textContent = rooms[index].number;
    confirmModal.classList.add('active');
};

document.getElementById('confirmDelete').addEventListener('click', () => {
    if (deleteIndex !== null) {
        rooms.splice(deleteIndex, 1);
        saveToLocalStorage();
        renderRooms(searchBar.value);
        showToast('Room deleted successfully!', 'error');
        closeModal();
        deleteIndex = null;
    }
});
