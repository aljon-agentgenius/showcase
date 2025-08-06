// Driver Portal functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateDateTime();
    loadTodayData();
    checkUniformStatus();
    updateClockInButton();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    
    // Set up drag and drop
    setupDragAndDrop();
});

function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    
    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
    document.getElementById('clockDisplay').textContent = timeString;
}

function loadTodayData() {
    const today = new Date().toDateString();
    const todayData = JSON.parse(localStorage.getItem('todayData') || '{}');
    
    if (todayData.date === today) {
        if (todayData.clockIn) {
            document.getElementById('clockInTime').textContent = todayData.clockIn;
            document.getElementById('statusText').textContent = 'Clocked In';
            document.getElementById('clockInBtn').classList.add('hidden');
            document.getElementById('clockOutBtn').classList.remove('hidden');
            
            // Show uniform photo if available
            if (todayData.uniformPhoto) {
                showUniformPhotoInSummary(todayData.uniformPhoto);
            }
            
            // Show location information if available
            if (todayData.clockInLocation) {
                showLocationInfo(todayData.clockInLocation);
            }
        }
        
        if (todayData.clockOut) {
            document.getElementById('clockOutTime').textContent = todayData.clockOut;
            document.getElementById('statusText').textContent = 'Clocked Out';
            document.getElementById('totalHours').textContent = todayData.totalHours || '0h 0m';
        }
    }
}

function clockIn() {
    // Check if uniform photo is confirmed
    const uniformConfirmed = localStorage.getItem('uniformConfirmed');
    if (!uniformConfirmed) {
        showNotification('Please take and confirm your uniform photo before clocking in.', 'error');
        return;
    }
    
    // Request location before clocking in
    if (navigator.geolocation) {
        showNotification('Requesting location...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Location obtained successfully
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                
                completeClockIn(location);
                showNotification('Location captured successfully!', 'success');
            },
            function(error) {
                // Location error - still allow clock in but notify user
                let errorMessage = 'Location could not be obtained. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'Unknown location error.';
                        break;
                }
                
                showNotification(errorMessage, 'warning');
                completeClockIn(null); // Clock in without location
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        // Geolocation not supported
        showNotification('Location services not supported by your browser.', 'warning');
        completeClockIn(null); // Clock in without location
    }
}

function completeClockIn(location) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const today = now.toDateString();
    
    const todayData = {
        date: today,
        clockIn: timeString,
        clockOut: null,
        totalHours: null,
        uniformPhoto: localStorage.getItem('uniformPhotoData'),
        clockInLocation: location
    };
    
    localStorage.setItem('todayData', JSON.stringify(todayData));
    
    document.getElementById('clockInTime').textContent = timeString;
    document.getElementById('statusText').textContent = 'Clocked In';
    document.getElementById('clockInBtn').classList.add('hidden');
    document.getElementById('clockOutBtn').classList.remove('hidden');
    
    // Hide uniform check section after successful clock in
    document.getElementById('uniformCheckSection').classList.add('hidden');
    
    // Show uniform photo in summary
    showUniformPhotoInSummary();
    
    // Reload today's data to show location information immediately
    loadTodayData();
    
    showNotification('Successfully clocked in!', 'success');
}

function clockOut() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const today = now.toDateString();
    
    const todayData = JSON.parse(localStorage.getItem('todayData') || '{}');
    todayData.clockOut = timeString;
    
    // Calculate total hours
    if (todayData.clockIn) {
        const clockInTime = new Date(today + ' ' + todayData.clockIn);
        const clockOutTime = new Date(today + ' ' + timeString);
        const diffMs = clockOutTime - clockInTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        todayData.totalHours = `${diffHours}h ${diffMinutes}m`;
    }
    
    localStorage.setItem('todayData', JSON.stringify(todayData));
    
    document.getElementById('clockOutTime').textContent = timeString;
    document.getElementById('statusText').textContent = 'Clocked Out';
    document.getElementById('totalHours').textContent = todayData.totalHours || '0h 0m';
    document.getElementById('clockOutBtn').classList.add('hidden');
    document.getElementById('clockInBtn').classList.remove('hidden');
    
    showNotification('Successfully clocked out!', 'success');
}

function handleFileUpload(event) {
    const files = event.target.files;
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    
    for (let file of files) {
        const fileId = Date.now() + Math.random();
        const fileElement = createFileElement(file, fileId);
        uploadedFilesContainer.appendChild(fileElement);
        
        // Store file info in localStorage
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        uploadedFiles.push({
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        });
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }
    
    showNotification(`${files.length} file(s) uploaded successfully!`, 'success');
}

function createFileElement(file, fileId) {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
    div.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-file text-blue-500 mr-3"></i>
            <div>
                <div class="font-medium text-gray-800">${file.name}</div>
                <div class="text-sm text-gray-500">${formatFileSize(file.size)}</div>
            </div>
        </div>
        <button onclick="removeFile('${fileId}')" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return div;
}

function removeFile(fileId) {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    
    // Remove from DOM
    const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileElement) {
        fileElement.remove();
    }
    
    showNotification('File removed successfully!', 'info');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function setupDragAndDrop() {
    const dropZone = document.querySelector('.border-dashed');
    const fileInput = document.getElementById('fileInput');
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-500', 'bg-blue-50');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const event = { target: { files: files } };
            handleFileUpload(event);
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load uploaded files on page load
function loadUploadedFiles() {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    const container = document.getElementById('uploadedFiles');
    
    uploadedFiles.forEach(file => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        div.setAttribute('data-file-id', file.id);
        div.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-file text-blue-500 mr-3"></i>
                <div>
                    <div class="font-medium text-gray-800">${file.name}</div>
                    <div class="text-sm text-gray-500">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button onclick="removeFile('${file.id}')" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

// Load uploaded files when page loads
document.addEventListener('DOMContentLoaded', loadUploadedFiles);

// Uniform photo handling functions
function handleUniformImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        document.getElementById('uniformImage').src = imageData;
        document.getElementById('uniformPreview').classList.remove('hidden');
        
        // Store image data temporarily
        localStorage.setItem('uniformPhotoData', imageData);
    };
    reader.readAsDataURL(file);
}

function retakeUniformPhoto() {
    document.getElementById('uniformImageInput').value = '';
    document.getElementById('uniformPreview').classList.add('hidden');
    localStorage.removeItem('uniformPhotoData');
    localStorage.removeItem('uniformConfirmed');
    updateClockInButton();
}

function confirmUniformPhoto() {
    localStorage.setItem('uniformConfirmed', 'true');
    document.getElementById('uniformCheckSection').classList.remove('bg-yellow-50', 'border-yellow-200');
    document.getElementById('uniformCheckSection').classList.add('bg-green-50', 'border-green-200');
    
    // Update the uniform check message
    const uniformCheckSection = document.getElementById('uniformCheckSection');
    const messageElement = uniformCheckSection.querySelector('p');
    messageElement.innerHTML = '<i class="fas fa-check-circle text-green-600 mr-1"></i>Uniform photo confirmed! You can now clock in.';
    messageElement.className = 'text-sm text-green-700 mb-3';
    
    updateClockInButton();
    showNotification('Uniform photo confirmed! You can now clock in.', 'success');
}

function updateClockInButton() {
    const clockInBtn = document.getElementById('clockInBtn');
    const uniformConfirmed = localStorage.getItem('uniformConfirmed');
    
    if (uniformConfirmed) {
        clockInBtn.className = 'w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition duration-200 transform hover:scale-105';
        clockInBtn.disabled = false;
        clockInBtn.innerHTML = '<i class="fas fa-clock mr-2"></i>Clock In';
    } else {
        clockInBtn.className = 'w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed';
        clockInBtn.disabled = true;
        clockInBtn.innerHTML = '<i class="fas fa-clock mr-2"></i>Clock In (Requires Uniform Photo)';
    }
}

// Check uniform status on page load
function checkUniformStatus() {
    const today = new Date().toDateString();
    const todayData = JSON.parse(localStorage.getItem('todayData') || '{}');
    
    // If already clocked in today, hide uniform check
    if (todayData.date === today && todayData.clockIn) {
        document.getElementById('uniformCheckSection').classList.add('hidden');
    } else {
        // Check if uniform was already confirmed today
        const uniformConfirmed = localStorage.getItem('uniformConfirmed');
        if (uniformConfirmed) {
            confirmUniformPhoto(); // This will update the UI to show confirmed state
        }
    }
}

// Function to display uniform photo in summary
function showUniformPhotoInSummary(photoData = null) {
    const uniformPhotoDisplay = document.getElementById('uniformPhotoDisplay');
    const displayUniformPhoto = document.getElementById('displayUniformPhoto');
    
    // Use provided photo data or get from localStorage
    const photoToDisplay = photoData || localStorage.getItem('uniformPhotoData');
    
    if (photoToDisplay) {
        displayUniformPhoto.src = photoToDisplay;
        uniformPhotoDisplay.classList.remove('hidden');
    }
}

// Global variable to store the map instance
let locationMap = null;

// Function to display location information
function showLocationInfo(location) {
    const locationDisplay = document.getElementById('locationDisplay');
    const locationCoords = document.getElementById('locationCoords');
    const locationAccuracy = document.getElementById('locationAccuracy');
    const locationTime = document.getElementById('locationTime');
    const locationMapContainer = document.getElementById('locationMap');
    
    if (locationDisplay && locationCoords && locationAccuracy && locationTime) {
        // Show the location display section
        locationDisplay.classList.remove('hidden');
        
        // Show coordinates initially while fetching address
        locationCoords.textContent = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
        locationAccuracy.textContent = `${Math.round(location.accuracy)}m`;
        locationTime.textContent = new Date(location.timestamp).toLocaleTimeString();
        
        // Show and initialize the map
        if (locationMapContainer) {
            locationMapContainer.style.display = 'block';
            initializeMap(location.latitude, location.longitude, location.accuracy);
        }
        
        // Fetch human-readable address
        getAddressFromCoordinates(location.latitude, location.longitude);
    }
}

// Function to initialize the map
function initializeMap(latitude, longitude, accuracy) {
    const mapContainer = document.getElementById('locationMap');
    
    if (!mapContainer) return;
    
    // Destroy existing map if it exists
    if (locationMap) {
        locationMap.remove();
    }
    
    // Initialize the map
    locationMap = L.map('locationMap').setView([latitude, longitude], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(locationMap);
    
    // Add a marker for the exact location
    const marker = L.marker([latitude, longitude]).addTo(locationMap);
    marker.bindPopup('Clock-in Location').openPopup();
    
    // Add accuracy circle if accuracy is available
    if (accuracy && accuracy > 0) {
        const accuracyCircle = L.circle([latitude, longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: accuracy
        }).addTo(locationMap);
    }
}

// Function to get location from coordinates using OpenStreetMap Nominatim
function getAddressFromCoordinates(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                // Create a simplified location string
                let location = '';
                
                // Try to get city and state/country
                if (data.address.city) {
                    location = data.address.city;
                } else if (data.address.town) {
                    location = data.address.town;
                } else if (data.address.village) {
                    location = data.address.village;
                } else if (data.address.suburb) {
                    location = data.address.suburb;
                }
                
                // Add state/province if available
                if (data.address.state) {
                    location += location ? `, ${data.address.state}` : data.address.state;
                } else if (data.address.country) {
                    location += location ? `, ${data.address.country}` : data.address.country;
                }
                
                // If no location found, use coordinates
                if (!location) {
                    location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                }
                
                // Update the location display
                const locationCoords = document.getElementById('locationCoords');
                if (locationCoords) {
                    locationCoords.textContent = location;
                }
            }
        })
        .catch(error => {
            console.log('Could not fetch location:', error);
            // Keep showing coordinates if location fetch fails
        });
} 