let payments = [];
let referrals = [];
let userProfile = {
    email: '',
    phone: '',
    isVerified: false,
};

// Function to show the desired page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Handle user registration
function registerUser(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('phone').value;

    // Save user details
    userProfile.email = email;
    userProfile.phone = phone;

    // Send verification email using SMTP.js
    sendVerificationEmail(email);
    alert("A verification code has been sent to your email!");

    showPage('verificationPage');  // Show verification page after registration
}

// Send verification email via SMTP.js
function sendVerificationEmail(email) {
    const verificationCode = generateVerificationCode();

    // Send email using SMTP.js
    Email.send({
        SecureToken: "your-smtp-token", // Use your SMTP token here
        To: email,
        From: "your-email@example.com",
        Subject: "Sider Fee Email Verification",
        Body: `
            <p>Welcome to Sider Fee!</p>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>Please enter this code on the verification page to complete your registration.</p>
        `,
    }).then(function (message) {
        console.log("Verification email sent successfully");
        localStorage.setItem('verificationCode', verificationCode); // Store code temporarily
    });
}

// Generate random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Verify the code entered by the user
function verifyUser(event) {
    event.preventDefault();
    const enteredCode = document.getElementById('verificationCode').value;
    const storedCode = localStorage.getItem('verificationCode');

    if (enteredCode === storedCode) {
        userProfile.isVerified = true;
        alert("Email verified successfully!");
        showPage('dashboardPage');  // Show the dashboard after verification
    } else {
        alert("Invalid verification code. Please try again.");
    }
}

// Handle login
function loginUser(event) {
    event.preventDefault();
    const password = document.getElementById('loginPassword').value;

    // For demo, simply check if the user has been verified
    if (userProfile.isVerified) {
        alert("Login successful! Welcome to the dashboard.");
        showPage('dashboardPage');
    } else {
        alert("Please verify your email first.");
    }
}

// Display dashboard with user profile
function loadDashboard() {
    const dashboardContent = `
        <h2>Welcome, ${userProfile.email}</h2>
        <p>Phone: ${userProfile.phone}</p>
        <p>Status: ${userProfile.isVerified ? 'Verified' : 'Not Verified'}</p>
        <h3>Referrals</h3>
        <ul>
            ${referrals.map(referral => `<li>${referral}</li>`).join('')}
        </ul>
        <h3>Payments</h3>
        <ul>
            ${payments.map(payment => `<li>${payment}</li>`).join('')}
        </ul>
    `;
    document.getElementById('dashboardContent').innerHTML = dashboardContent;
}
