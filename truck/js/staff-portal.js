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

// Sample driver data - in a real app, this would come from a database
const sampleDrivers = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@helpfastpersonnel.com',
        status: 'Clocked In',
        clockIn: '08:00 AM',
        clockOut: '--:--',
        totalHours: '0h 0m',
        phone: '+1 (555) 123-4567',
        truckNumber: 'TRK-001',
        location: 'Los Angeles, CA'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@helpfastpersonnel.com',
        status: 'Clocked Out',
        clockIn: '07:30 AM',
        clockOut: '05:30 PM',
        totalHours: '10h 0m',
        phone: '+1 (555) 234-5678',
        truckNumber: 'TRK-002',
        location: 'San Francisco, CA'
    },
    {
        id: 3,
        name: 'Mike Davis',
        email: 'mike.davis@helpfastpersonnel.com',
        status: 'Not Clocked In',
        clockIn: '--:--',
        clockOut: '--:--',
        totalHours: '0h 0m',
        phone: '+1 (555) 345-6789',
        truckNumber: 'TRK-003',
        location: 'Phoenix, AZ'
    },
    {
        id: 4,
        name: 'Lisa Wilson',
        email: 'lisa.wilson@helpfastpersonnel.com',
        status: 'Clocked In',
        clockIn: '06:45 AM',
        clockOut: '--:--',
        totalHours: '0h 0m',
        phone: '+1 (555) 456-7890',
        truckNumber: 'TRK-004',
        location: 'Seattle, WA'
    }
];

function loadDriverData() {
    const tableBody = document.getElementById('driversTableBody');
    tableBody.innerHTML = '';
    
    sampleDrivers.forEach(driver => {
        const row = createDriverRow(driver);
        tableBody.appendChild(row);
    });
    
    updateStatistics();
}

function createDriverRow(driver) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    const statusClass = driver.status === 'Clocked In' ? 'bg-green-100 text-green-800' :
                       driver.status === 'Clocked Out' ? 'bg-gray-100 text-gray-800' :
                       'bg-yellow-100 text-yellow-800';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
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
            <button onclick="viewDriverDetails(${driver.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fas fa-eye"></i> View
            </button>
            <button onclick="showAIInsights(${driver.id})" class="text-green-600 hover:text-green-900">
                <i class="fas fa-robot"></i> AI Insights
            </button>
        </td>
    `;
    
    return row;
}

function updateStatistics() {
    const totalDrivers = sampleDrivers.length;
    const clockedIn = sampleDrivers.filter(d => d.status === 'Clocked In').length;
    const issues = sampleDrivers.filter(d => d.status === 'Not Clocked In').length;
    const avgHours = calculateAverageHours();
    
    document.getElementById('totalDrivers').textContent = totalDrivers;
    document.getElementById('clockedIn').textContent = clockedIn;
    document.getElementById('issues').textContent = issues;
    document.getElementById('avgHours').textContent = avgHours;
}

function calculateAverageHours() {
    const driversWithHours = sampleDrivers.filter(d => d.totalHours !== '0h 0m');
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

function viewDriverDetails(driverId) {
    const driver = sampleDrivers.find(d => d.id === driverId);
    if (!driver) return;
    
    // Create a modal with driver details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Driver Details</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-3">
                <div><strong>Name:</strong> ${driver.name}</div>
                <div><strong>Email:</strong> ${driver.email}</div>
                <div><strong>Phone:</strong> ${driver.phone}</div>
                <div><strong>Truck Number:</strong> ${driver.truckNumber}</div>
                <div><strong>Location:</strong> ${driver.location}</div>
                <div><strong>Status:</strong> ${driver.status}</div>
                <div><strong>Clock In:</strong> ${driver.clockIn}</div>
                <div><strong>Clock Out:</strong> ${driver.clockOut}</div>
                <div><strong>Total Hours:</strong> ${driver.totalHours}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showAIInsights(driverId) {
    const driver = sampleDrivers.find(d => d.id === driverId);
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