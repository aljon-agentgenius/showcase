// Staff Portal functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateDateTime();
    loadDriverData();
    setupSearch();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    
    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
}

// Function to get real driver data from localStorage (driver portal data)
function getRealDriverData() {
    const todayData = JSON.parse(localStorage.getItem('todayData') || '{}');
    const today = new Date().toDateString();
    
    // Check if today's data exists
    if (todayData.date === today) {
        // Create John Smith data from real driver portal data
        const johnSmith = {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@helpfastpersonnel.com',
            status: todayData.clockIn ? (todayData.clockOut ? 'Clocked Out' : 'Clocked In') : 'Not Clocked In',
            clockIn: todayData.clockIn || '--:--',
            clockOut: todayData.clockOut || '--:--',
            totalHours: todayData.totalHours || '0h 0m',
            phone: '+1 (416) 123-4567',
            truckNumber: 'TRK-001',
            location: 'Toronto, ON',
            clockInLocation: todayData.clockInLocation || null,
            uniformPhoto: todayData.uniformPhoto || null
        };
        
        return [johnSmith];
    }
    
    // Return empty array if no real data exists
    return [];
}

// Sample driver data for demonstration (fallback)
const sampleDrivers = [
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@helpfastpersonnel.com',
        status: 'Clocked Out',
        clockIn: '07:30 AM',
        clockOut: '05:30 PM',
        totalHours: '10h 0m',
        phone: '+1 (514) 234-5678',
        truckNumber: 'TRK-002',
        location: 'Montreal, QC',
        clockInLocation: {
            latitude: 45.5017,
            longitude: -73.5673,
            accuracy: 20,
            timestamp: Date.now() - 43200000 // 12 hours ago
        }
    },
    {
        id: 3,
        name: 'Mike Davis',
        email: 'mike.davis@helpfastpersonnel.com',
        status: 'Not Clocked In',
        clockIn: '--:--',
        clockOut: '--:--',
        totalHours: '0h 0m',
        phone: '+1 (604) 345-6789',
        truckNumber: 'TRK-003',
        location: 'Vancouver, BC',
        clockInLocation: null
    },
    {
        id: 4,
        name: 'Lisa Wilson',
        email: 'lisa.wilson@helpfastpersonnel.com',
        status: 'Clocked In',
        clockIn: '06:45 AM',
        clockOut: '--:--',
        totalHours: '0h 0m',
        phone: '+1 (403) 456-7890',
        truckNumber: 'TRK-004',
        location: 'Calgary, AB',
        clockInLocation: {
            latitude: 51.0447,
            longitude: -114.0719,
            accuracy: 12,
            timestamp: Date.now() - 7200000 // 2 hours ago
        }
    },
    {
        id: 5,
        name: 'David Thompson',
        email: 'david.thompson@helpfastpersonnel.com',
        status: 'Clocked In',
        clockIn: '07:15 AM',
        clockOut: '--:--',
        totalHours: '0h 0m',
        phone: '+1 (780) 567-8901',
        truckNumber: 'TRK-005',
        location: 'Edmonton, AB',
        clockInLocation: {
            latitude: 53.5461,
            longitude: -113.4938,
            accuracy: 18,
            timestamp: Date.now() - 5400000 // 1.5 hours ago
        }
    },
    {
        id: 6,
        name: 'Emily Chen',
        email: 'emily.chen@helpfastpersonnel.com',
        status: 'Clocked Out',
        clockIn: '06:30 AM',
        clockOut: '04:30 PM',
        totalHours: '10h 0m',
        phone: '+1 (613) 678-9012',
        truckNumber: 'TRK-006',
        location: 'Ottawa, ON',
        clockInLocation: {
            latitude: 45.4215,
            longitude: -75.6972,
            accuracy: 14,
            timestamp: Date.now() - 39600000 // 11 hours ago
        }
    }
];

function loadDriverData() {
    const tableBody = document.getElementById('driversTableBody');
    tableBody.innerHTML = '';
    
    // Get real driver data first
    const realDrivers = getRealDriverData();
    
    // Combine real drivers with sample drivers
    const allDrivers = [...realDrivers, ...sampleDrivers];
    
    allDrivers.forEach(driver => {
        const row = createDriverRow(driver);
        tableBody.appendChild(row);
    });
    
    updateStatistics();
}

function createDriverRow(driver) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    row.setAttribute('data-driver-id', driver.id);
    
    const statusClass = driver.status === 'Clocked In' ? 'bg-green-100 text-green-800' :
                       driver.status === 'Clocked Out' ? 'bg-gray-100 text-gray-800' :
                       'bg-yellow-100 text-yellow-800';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <button onclick="toggleDriverDetails(${driver.id})" class="mr-2 text-gray-400 hover:text-gray-600 transition-transform duration-200" id="expandBtn-${driver.id}">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span class="text-white font-medium">${driver.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">${driver.name}</div>
                    <div class="text-sm text-gray-500">${driver.email}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${driver.status}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${driver.clockIn}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${driver.clockOut}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${driver.totalHours}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="showAIInsights(${driver.id})" class="text-green-600 hover:text-green-900">
                <i class="fas fa-robot"></i> AI Insights
            </button>
        </td>
    `;
    
    return row;
}

function updateStatistics() {
    const realDrivers = getRealDriverData();
    const allDrivers = [...realDrivers, ...sampleDrivers];
    
    const totalDrivers = allDrivers.length;
    const clockedIn = allDrivers.filter(d => d.status === 'Clocked In').length;
    const issues = allDrivers.filter(d => d.status === 'Not Clocked In').length;
    const avgHours = calculateAverageHours(allDrivers);
    
    document.getElementById('totalDrivers').textContent = totalDrivers;
    document.getElementById('clockedIn').textContent = clockedIn;
    document.getElementById('issues').textContent = issues;
    document.getElementById('avgHours').textContent = avgHours;
}

function calculateAverageHours(drivers = sampleDrivers) {
    const driversWithHours = drivers.filter(d => d.totalHours !== '0h 0m');
    if (driversWithHours.length === 0) return '0h';
    
    const totalHours = driversWithHours.reduce((sum, driver) => {
        const hours = parseInt(driver.totalHours.split('h')[0]);
        return sum + hours;
    }, 0);
    
    return Math.round(totalHours / driversWithHours.length) + 'h';
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tableBody = document.getElementById('driversTableBody');
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const driverName = row.querySelector('td:first-child').textContent.toLowerCase();
            const driverEmail = row.querySelector('td:first-child div:last-child').textContent.toLowerCase();
            
            if (driverName.includes(searchTerm) || driverEmail.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

function refreshData() {
    // Simulate data refresh
    showNotification('Data refreshed successfully!', 'success');
    loadDriverData();
}

// Global variable to store map instances
let driverMaps = {};

function toggleDriverDetails(driverId) {
    const realDrivers = getRealDriverData();
    const allDrivers = [...realDrivers, ...sampleDrivers];
    const driver = allDrivers.find(d => d.id === driverId);
    if (!driver) return;
    
    const row = document.querySelector(`[data-driver-id="${driverId}"]`);
    const expandBtn = document.getElementById(`expandBtn-${driverId}`);
    const existingDetails = document.getElementById(`details-${driverId}`);
    
    if (existingDetails) {
        // Collapse
        existingDetails.remove();
        expandBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        expandBtn.style.transform = 'rotate(0deg)';
        
        // Remove map if exists
        if (driverMaps[driverId]) {
            driverMaps[driverId].remove();
            delete driverMaps[driverId];
        }
    } else {
        // Expand
        expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        expandBtn.style.transform = 'rotate(90deg)';
        
        // Create details row
        const detailsRow = document.createElement('tr');
        detailsRow.id = `details-${driverId}`;
        detailsRow.className = 'bg-gray-50';
        
                 detailsRow.innerHTML = `
             <td colspan="6" class="px-6 py-4">
                 <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <!-- Driver Details -->
                     <div class="space-y-4">
                         <h4 class="font-semibold text-gray-800 mb-3">Driver Information</h4>
                         <div class="grid grid-cols-2 gap-4 text-sm">
                             <div><span class="font-medium text-gray-600">Phone:</span> ${driver.phone}</div>
                             <div><span class="font-medium text-gray-600">Truck Number:</span> ${driver.truckNumber}</div>
                             <div><span class="font-medium text-gray-600">Status:</span> ${driver.status}</div>
                             <div><span class="font-medium text-gray-600">Clock In:</span> ${driver.clockIn}</div>
                             <div><span class="font-medium text-gray-600">Clock Out:</span> ${driver.clockOut}</div>
                             <div><span class="font-medium text-gray-600">Total Hours:</span> ${driver.totalHours}</div>
                         </div>
                     </div>
                     
                     <!-- Uniform Photo -->
                     <div class="space-y-4">
                         <h4 class="font-semibold text-gray-800 mb-3">Uniform Photo</h4>
                         <div id="uniformInfo-${driverId}">
                             ${driver.uniformPhoto ? `
                                 <div class="space-y-3">
                                     <div class="relative">
                                         <img src="${driver.uniformPhoto}" alt="Uniform Photo" class="w-full h-48 object-cover rounded-lg border-2 border-green-200">
                                         <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                             <i class="fas fa-check mr-1"></i>Verified
                                         </div>
                                     </div>
                                     <div class="text-sm text-green-600">
                                         <i class="fas fa-check-circle mr-1"></i>Uniform compliance verified
                                     </div>
                                 </div>
                             ` : `
                                 <div class="text-sm text-gray-500">No uniform photo available</div>
                             `}
                         </div>
                     </div>
                     
                     <!-- Location Details -->
                     <div class="space-y-4">
                         <h4 class="font-semibold text-gray-800 mb-3">Clock-in Location</h4>
                         <div id="locationInfo-${driverId}">
                             ${driver.clockInLocation ? `
                                 <div class="space-y-3">
                                     <div class="text-sm">
                                         <span class="font-medium text-gray-600">Location:</span> 
                                         <span id="locationText-${driverId}">Loading...</span>
                                     </div>
                                     <div class="text-sm">
                                         <span class="font-medium text-gray-600">Accuracy:</span> 
                                         <span id="locationAccuracy-${driverId}">${Math.round(driver.clockInLocation.accuracy)}m</span>
                                     </div>
                                     <div class="text-sm">
                                         <span class="font-medium text-gray-600">Time:</span> 
                                         <span id="locationTime-${driverId}">${new Date(driver.clockInLocation.timestamp).toLocaleTimeString()}</span>
                                     </div>
                                     <div id="locationMap-${driverId}" class="w-full h-48 rounded-lg border border-blue-200"></div>
                                 </div>
                             ` : `
                                 <div class="text-sm text-gray-500">No location data available</div>
                             `}
                         </div>
                     </div>
                 </div>
             </td>
         `;
        
        // Insert details row after the main row
        row.parentNode.insertBefore(detailsRow, row.nextSibling);
        
        // Initialize map and location data if available
        if (driver.clockInLocation) {
            setTimeout(() => {
                initializeDriverMap(driverId, driver.clockInLocation);
                getDriverLocationText(driverId, driver.clockInLocation);
            }, 1000); // 1 second loading delay
        }
    }
}

function initializeDriverMap(driverId, location) {
    const mapContainer = document.getElementById(`locationMap-${driverId}`);
    if (!mapContainer) return;
    
    // Initialize the map
    const map = L.map(`locationMap-${driverId}`).setView([location.latitude, location.longitude], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add a marker for the exact location
    const marker = L.marker([location.latitude, location.longitude]).addTo(map);
    marker.bindPopup('Clock-in Location').openPopup();
    
    // Add accuracy circle
    if (location.accuracy && location.accuracy > 0) {
        const accuracyCircle = L.circle([location.latitude, location.longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: location.accuracy
        }).addTo(map);
    }
    
    // Store map instance
    driverMaps[driverId] = map;
}

function getDriverLocationText(driverId, location) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=16&addressdetails=1`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                let locationText = '';
                
                // Try to get city and state/country
                if (data.address.city) {
                    locationText = data.address.city;
                } else if (data.address.town) {
                    locationText = data.address.town;
                } else if (data.address.village) {
                    locationText = data.address.village;
                } else if (data.address.suburb) {
                    locationText = data.address.suburb;
                }
                
                // Add state/province if available
                if (data.address.state) {
                    locationText += locationText ? `, ${data.address.state}` : data.address.state;
                } else if (data.address.country) {
                    locationText += locationText ? `, ${data.address.country}` : data.address.country;
                }
                
                // If no location found, use coordinates
                if (!locationText) {
                    locationText = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
                }
                
                // Update the location text
                const locationTextElement = document.getElementById(`locationText-${driverId}`);
                if (locationTextElement) {
                    locationTextElement.textContent = locationText;
                }
            }
        })
        .catch(error => {
            console.log('Could not fetch location:', error);
            const locationTextElement = document.getElementById(`locationText-${driverId}`);
            if (locationTextElement) {
                locationTextElement.textContent = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
            }
        });
}

function showAIInsights(driverId) {
    const realDrivers = getRealDriverData();
    const allDrivers = [...realDrivers, ...sampleDrivers];
    const driver = allDrivers.find(d => d.id === driverId);
    if (!driver) return;
    
    const insights = generateAIInsights(driver);
    const content = document.getElementById('aiInsightsContent');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="text-center">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-robot text-blue-600 text-2xl"></i>
                </div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">AI Analysis for ${driver.name}</h4>
                <p class="text-sm text-gray-600">Real-time insights and recommendations</p>
            </div>
            
            <div class="space-y-4">
                ${insights.map(insight => `
                    <div class="p-4 rounded-lg ${insight.type === 'pass' ? 'bg-green-50 border border-green-200' : 
                                                   insight.type === 'fail' ? 'bg-red-50 border border-red-200' : 
                                                   'bg-blue-50 border border-blue-200'}">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <i class="fas ${insight.type === 'pass' ? 'fa-check-circle text-green-500' : 
                                               insight.type === 'fail' ? 'fa-exclamation-circle text-red-500' : 
                                               'fa-info-circle text-blue-500'}"></i>
                            </div>
                            <div class="ml-3">
                                <h5 class="text-sm font-medium ${insight.type === 'pass' ? 'text-green-800' : 
                                                               insight.type === 'fail' ? 'text-red-800' : 
                                                               'text-blue-800'}">${insight.title}</h5>
                                <p class="text-sm ${insight.type === 'pass' ? 'text-green-700' : 
                                                   insight.type === 'fail' ? 'text-red-700' : 
                                                   'text-blue-700'} mt-1">${insight.description}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 class="font-medium text-gray-800 mb-2">Recommendations</h5>
                <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Monitor driver performance regularly</li>
                    <li>• Schedule maintenance checks</li>
                    <li>• Review route optimization</li>
                    <li>• Ensure compliance with regulations</li>
                </ul>
            </div>
        </div>
    `;
    
    openAIInsights();
}

function generateAIInsights(driver) {
    const insights = [];
    
    // Analyze clock in time
    if (driver.clockIn !== '--:--') {
        const clockInHour = parseInt(driver.clockIn.split(':')[0]);
        if (clockInHour <= 8) {
            insights.push({
                type: 'pass',
                title: 'Early Start',
                description: 'Driver started on time, showing good punctuality.'
            });
        } else {
            insights.push({
                type: 'fail',
                title: 'Late Start',
                description: 'Driver started late. Consider reviewing schedule.'
            });
        }
    }
    
    // Analyze total hours
    if (driver.totalHours !== '0h 0m') {
        const hours = parseInt(driver.totalHours.split('h')[0]);
        if (hours >= 8 && hours <= 12) {
            insights.push({
                type: 'pass',
                title: 'Optimal Work Hours',
                description: 'Driver worked within recommended hours (8-12 hours).'
            });
        } else if (hours > 12) {
            insights.push({
                type: 'fail',
                title: 'Overtime Alert',
                description: 'Driver exceeded 12 hours. Review for compliance.'
            });
        }
    }
    
    // Status analysis
    if (driver.status === 'Clocked In') {
        insights.push({
            type: 'info',
            title: 'Active Driver',
            description: 'Driver is currently on duty and active.'
        });
    } else if (driver.status === 'Not Clocked In') {
        insights.push({
            type: 'fail',
            title: 'Inactive Driver',
            description: 'Driver has not clocked in today. Check status.'
        });
    }
    
    // Uniform compliance check
    if (driver.clockIn !== '--:--') {
        insights.push({
            type: 'pass',
            title: 'Uniform Compliance',
            description: 'Driver submitted uniform photo before clocking in - Company policy followed.'
        });
    } else if (driver.status === 'Not Clocked In') {
        insights.push({
            type: 'fail',
            title: 'Uniform Check Pending',
            description: 'Driver has not submitted uniform photo - Cannot clock in until uniform is verified.'
        });
    }
    
    // Performance rating
    const performanceScore = calculatePerformanceScore(driver);
    if (performanceScore >= 80) {
        insights.push({
            type: 'pass',
            title: 'High Performance',
            description: `Driver performance score: ${performanceScore}% - Excellent work!`
        });
    } else if (performanceScore >= 60) {
        insights.push({
            type: 'info',
            title: 'Good Performance',
            description: `Driver performance score: ${performanceScore}% - Room for improvement.`
        });
    } else {
        insights.push({
            type: 'fail',
            title: 'Performance Issues',
            description: `Driver performance score: ${performanceScore}% - Needs attention.`
        });
    }
    
    return insights;
}

function calculatePerformanceScore(driver) {
    let score = 50; // Base score
    
    // Add points for being clocked in
    if (driver.status === 'Clocked In') score += 20;
    
    // Add points for early start
    if (driver.clockIn !== '--:--') {
        const clockInHour = parseInt(driver.clockIn.split(':')[0]);
        if (clockInHour <= 8) score += 15;
        else if (clockInHour <= 9) score += 10;
    }
    
    // Add points for reasonable hours
    if (driver.totalHours !== '0h 0m') {
        const hours = parseInt(driver.totalHours.split('h')[0]);
        if (hours >= 8 && hours <= 12) score += 15;
        else if (hours > 0) score += 5;
    }
    
    return Math.min(100, score);
}

function openAIInsights() {
    document.getElementById('aiInsightsOffcanvas').classList.remove('translate-x-full');
    document.getElementById('overlay').classList.remove('hidden');
}

function closeAIInsights() {
    document.getElementById('aiInsightsOffcanvas').classList.add('translate-x-full');
    document.getElementById('overlay').classList.add('hidden');
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