// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const nav = document.querySelector('nav ul');
    
    // Add login/register or dashboard link based on authentication status
    if (currentUser) {
        const dashboardLi = document.createElement('li');
        dashboardLi.innerHTML = `<a href="/dashboard.html">Dashboard</a>`;
        nav.appendChild(dashboardLi);
        
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
        nav.appendChild(logoutLi);
        
        // Add event listener for logout button
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    } else {
        const loginLi = document.createElement('li');
        loginLi.innerHTML = `<a href="/login.html">Login</a>`;
        nav.appendChild(loginLi);
        
        const registerLi = document.createElement('li');
        registerLi.innerHTML = `<a href="/register.html">Register</a>`;
        nav.appendChild(registerLi);
    }
});

// Form submission handling
const donorForm = document.getElementById('donorForm');
if (donorForm) {
    donorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            age: parseInt(document.getElementById('age').value),
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            lastDonation: new Date()
        };

        try {
            const response = await fetch('/api/donors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Thank you for registering as a donor!');
                donorForm.reset();
                
                // If user is not logged in, prompt to register
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser) {
                    if (confirm('Would you like to create an account to track your donations?')) {
                        window.location.href = '/register.html';
                    }
                }
            } else {
                throw new Error('Failed to register donor');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// Search donors functionality
async function searchDonors() {
    const bloodGroup = document.getElementById('searchBloodGroup').value;
    const searchResults = document.getElementById('searchResults');

    if (!bloodGroup) {
        alert('Please select a blood group');
        return;
    }

    try {
        const response = await fetch(`/api/donors/${bloodGroup}`);
        const donors = await response.json();

        if (donors.length === 0) {
            searchResults.innerHTML = '<p>No donors found for this blood group.</p>';
            return;
        }

        const donorsList = donors.map(donor => `
            <div class="donor-card">
                <h3>${donor.name}</h3>
                <p>Blood Group: ${donor.bloodGroup}</p>
                <p>Age: ${donor.age}</p>
                <p>Contact: ${donor.phone}</p>
                <p>Email: ${donor.email}</p>
                <p>Address: ${donor.address}</p>
                <p>Last Donation: ${new Date(donor.lastDonation).toLocaleDateString()}</p>
            </div>
        `).join('');

        searchResults.innerHTML = donorsList;
    } catch (error) {
        searchResults.innerHTML = '<p>Error searching for donors. Please try again later.</p>';
    }
}

// Helper function to scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add some animation to the donor cards
const style = document.createElement('style');
style.textContent = `
    .donor-card {
        background: white;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .donor-card:hover {
        transform: translateY(-5px);
    }

    .donor-card h3 {
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }

    .donor-card p {
        margin: 0.3rem 0;
    }
`;
document.head.appendChild(style); 