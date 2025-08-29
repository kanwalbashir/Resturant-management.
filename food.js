// Navbar toggle
const menu = document.querySelector('#menu-bars');
const navbar = document.querySelector('.navbar');
if (menu && navbar) {
    menu.onclick = () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };
}
//store postion
window.addEventListener("beforeunload", () => {
    localStorage.setItem("scrollPosition", window.scrollY);
});
//  Restore scroll position
window.addEventListener("load", () => {
    const scrollPos = localStorage.getItem("scrollPosition");
    if (scrollPos) {
        window.scrollTo(0, scrollPos);}
    })
// Get latest user info
async function getUser() {
    const token = localStorage.getItem("token"); 
    if (!token) return null;

    try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Unauthorized");
        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user)); 
        localStorage.setItem("userId", user._id); 
        return user;
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const dynamicTitle = document.getElementById("dynamicTitle");
    const user = JSON.parse(localStorage.getItem("user")); 

    if (user && dynamicTitle) {
        dynamicTitle.textContent = user.name || user.fullName || user.username || "Taste Haven";
    }
});

// Highlight current page
document.querySelectorAll(".navbar a").forEach(link => {
    if (link.href === location.href) link.classList.add("active");
});

// Show/hide password
const togglePassword = document.getElementById("togglePassword");
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const passwordField = document.getElementById("password");
        if (!passwordField) return;
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;
        this.classList.toggle("fa-eye-slash");
    });
}

// Search form toggle
const searchIcon = document.getElementById("search-icon");
const searchForm = document.getElementById("search-form");
const closeBtn = document.getElementById("close");
const searchBox = document.getElementById("search-box");

if (searchIcon && searchForm) {
    searchIcon.onclick = () => searchForm.classList.toggle("active");
    if (closeBtn) closeBtn.onclick = () => searchForm.classList.remove("active");

    // Redirect to search page on submit
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchBox.value.trim();
        if (!query) return;
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    });
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    const userIcon = document.getElementById("userIcon");
    const userInitial = document.getElementById("userInitial");
    const userDropdown = document.getElementById("userDropdown");
    const fullNameDisplay = document.getElementById("fullNameDisplay");
    const logoutBtn = document.querySelector("#userDropdown #logoutBtn");
    const dynamicTitle = document.querySelector(".logo");

    if (!userIcon) return;
    const user = JSON.parse(localStorage.getItem("user")); 

    // Not logged in
    if (!user) {
        if (dynamicTitle) dynamicTitle.innerHTML = '<i class="fas fa-utensils"></i> Taste Haven';
        if (userIcon) {
            userIcon.textContent = "";
            userIcon.classList.add("fas", "fa-user");
            userIcon.addEventListener("click", () => {
                window.location.href = "login.html";
            });
        }
        if (userDropdown) userDropdown.style.display = "none";
        return;
    }
    //only one admin window
     if (user.role === "admin") {
        window.location.href = "../admin/admin.html";
        return;
    }
    // Logged-in user
    if (user.role === "user") {
    const displayName = user.name || user.fullName || user.username || "User";

    if (dynamicTitle) dynamicTitle.innerHTML = `<i class="fas fa-utensils"></i> ${displayName}`;
    if (userInitial) userInitial.textContent = displayName.charAt(0).toUpperCase();
    if (fullNameDisplay) fullNameDisplay.textContent = displayName;
    }
    // Dropdown toggle
    if (userIcon && userDropdown) {
        userIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!userDropdown.contains(e.target) && e.target !== userIcon) {
                userDropdown.style.display = "none";
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear(); 
            window.location.href = "login.html";
        });
    }
});
//login for order and booking
document.addEventListener("DOMContentLoaded", () => {
     const userData = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "null");
const protectedLinks = document.querySelectorAll('a[href="Order.html"], a[href="Reservation.html"]');

    protectedLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (!userData) { 
                e.preventDefault();
                alert("You must log in to use this feature.");
                window.location.href = "login.html";
            }
        });
    });
});

//auto fill
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("user")) || JSON.parse(localStorage.getItem("user"));

    if (!user) return;
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const phoneInput = document.getElementById("userPhone");

    if (nameInput) {
        nameInput.value = user.name || user.fullName || "";
        nameInput.readOnly = true; // prevent editing
    }
    if (emailInput) {
        emailInput.value = user.email || "";
        emailInput.readOnly = true;
    }
    if (phoneInput) {
        phoneInput.value = user.phone || "";
        phoneInput.readOnly = true;
    }
});
