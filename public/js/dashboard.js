// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login if no user is logged in
        window.location.href = '/login.html';
        return;
    }
    loadUserProfile(currentUser);
    loadUpcomingCampaigns(); // Ensure this is called
});

// Load user profile
function loadUserProfile(user) {
    document.getElementById('donorName').textContent = user.name || 'Donor';
    document.getElementById('bloodGroup').textContent = user.bloodGroup || '-';
    document.getElementById('age').textContent = user.age || '-';
    document.getElementById('phone').textContent = user.phone || '-';
    document.getElementById('email').textContent = user.email || '-';
    document.getElementById('address').textContent = user.address || '-';
}

// Load donation history
function loadDonationHistory(user) {
    // In a real application, you would fetch this data from the server
    // For demo purposes, we'll use mock data
    const lastDonation = user.lastDonation ? new Date(user.lastDonation) : null;
    
    if (lastDonation) {
        document.getElementById('lastDonation').textContent = lastDonation.toLocaleDateString();
        
        // Calculate next eligible date (3 months after last donation)
        const nextEligibleDate = new Date(lastDonation);
        nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
        document.getElementById('nextEligibleDate').textContent = nextEligibleDate.toLocaleDateString();
        
        // Mock data for total donations and lives saved
        document.getElementById('totalDonations').textContent = '3';
        document.getElementById('livesSaved').textContent = '9';
    } else {
        document.getElementById('lastDonation').textContent = 'No donations yet';
        document.getElementById('nextEligibleDate').textContent = 'You are eligible to donate now';
    }
}

// Load upcoming campaigns
async function loadUpcomingCampaigns() {
    try {
        const response = await fetch('/api/campaigns');
        const campaigns = await response.json();

        const campaignsList = document.getElementById('campaignsList');
        campaignsList.innerHTML = '';

        if (campaigns.length === 0) {
            campaignsList.innerHTML = '<p>No upcoming campaigns available.</p>';
            return;
        }

        campaigns.forEach(campaign => {
            const campaignCard = document.createElement('div');
            campaignCard.className = 'campaign-card';
            campaignCard.innerHTML = `
                <h3>${campaign.title}</h3>
                <p class="date">${new Date(campaign.date).toLocaleDateString()}</p>
                <p class="location">${campaign.location}</p>
                <p>${campaign.description}</p>
                <button class="register-btn">Register Now</button>
            `;

            campaignCard.querySelector('.register-btn').addEventListener('click', () => {
                alert(`You have registered for ${campaign.title} on ${new Date(campaign.date).toLocaleDateString()}`);
            });

            campaignsList.appendChild(campaignCard);
        });
    } catch (error) {
        console.error('Error loading campaigns:', error);
        document.getElementById('campaignsList').innerHTML = '<p>Error loading campaigns. Please try again later.</p>';
    }
}

// Show edit profile modal
function showEditProfileModal(user) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editProfileModal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <input type="text" id="editName" value="${user.name}" required placeholder="Full Name">
                </div>
                <div class="form-group">
                    <select id="editBloodGroup" required>
                        <option value="">Select Blood Group</option>
                        <option value="A+" ${user.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                        <option value="A-" ${user.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                        <option value="B+" ${user.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                        <option value="B-" ${user.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                        <option value="AB+" ${user.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                        <option value="AB-" ${user.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                        <option value="O+" ${user.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                        <option value="O-" ${user.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                    </select>
                </div>
                <div class="form-group">
                    <input type="number" id="editAge" value="${user.age}" required placeholder="Age" min="18" max="65">
                </div>
                <div class="form-group">
                    <input type="tel" id="editPhone" value="${user.phone}" required placeholder="Phone Number">
                </div>
                <div class="form-group">
                    <input type="email" id="editEmail" value="${user.email}" required placeholder="Email">
                </div>
                <div class="form-group">
                    <textarea id="editAddress" required placeholder="Address">${user.address}</textarea>
                </div>
                <button type="submit" class="submit-button">Save Changes</button>
            </form>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Show modal
    modal.style.display = 'block';
    
    // Add event listener for close button
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    });
    
    // Add event listener for form submission
    modal.querySelector('#editProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const updatedUser = {
            ...user,
            name: document.getElementById('editName').value,
            bloodGroup: document.getElementById('editBloodGroup').value,
            age: parseInt(document.getElementById('editAge').value),
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value,
            address: document.getElementById('editAddress').value
        };
        
        // Update user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update profile display
        loadUserProfile(updatedUser);
        
        // Close modal
        modal.style.display = 'none';
        document.body.removeChild(modal);
        
        // Show success message
        alert('Profile updated successfully!');
    });
}