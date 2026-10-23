
const sidebarToggle = document.getElementById("sidebarToggle");
const appContainer = document.querySelector(".app-container");

sidebarToggle.addEventListener("click", () => {
    const isCollapsed = appContainer.classList.toggle("sidebar-collapsed");

    sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
    sidebarToggle.setAttribute(
        "aria-label",
        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
    );

    sidebarToggle.textContent = isCollapsed ? "☰" : "☰";
});


/* ==========================================
   PASSWORD ANALYZER
   Analyzes passwords locally in the browser
   ========================================== */

const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const analyzePassword = document.getElementById("analyzePassword");
const passwordResults = document.getElementById("passwordResults");
const strengthLabel = document.getElementById("strengthLabel");
const strengthBar = document.getElementById("strengthBar");
const passwordFeedback = document.getElementById("passwordFeedback");

// Show or hide the entered password
if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";
        togglePassword.textContent = isHidden ? "Hide" : "Show";
    });
}

// Analyze the password when the user clicks the button
if (analyzePassword) {
    analyzePassword.addEventListener("click", () => {
        const password = passwordInput.value;

        passwordResults.hidden = false;
        passwordFeedback.innerHTML = "";
        strengthBar.style.width = "0%";

        if (!password) {
            strengthLabel.textContent = "Enter a password first";
            addFeedback("Type a password to begin the analysis.");
            return;
        }

        let score = 0;
        const feedback = [];

        if (password.length >= 8) {
            score++;
        } else {
            feedback.push("Use at least 8 characters.");
        }

        if (password.length >= 12) {
            score++;
        } else {
            feedback.push("Consider using 12 or more characters.");
        }

        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            score++;
        } else {
            feedback.push("Mix uppercase and lowercase letters.");
        }

        if (/\d/.test(password)) {
            score++;
        } else {
            feedback.push("Include at least one number.");
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        } else {
            feedback.push("Consider including a special character.");
        }

        // Identify common patterns that weaken passwords
        const lowerPassword = password.toLowerCase();
        const commonPatterns = [
            "password",
            "qwerty",
            "123456",
            "admin",
            "letmein"
        ];

        const containsCommonPattern = commonPatterns.some(
            pattern => lowerPassword.includes(pattern)
        );

        if (containsCommonPattern) {
            feedback.push(
                "This password contains a commonly used pattern."
            );
        }

        // Determine the final strength
        let strength = "Weak";

        if (
            score >= 4 &&
            password.length >= 12 &&
            !containsCommonPattern
        ) {
            strength = "Strong";
        } else if (
            score >= 3 &&
            !containsCommonPattern
        ) {
            strength = "Moderate";
        }

        strengthLabel.textContent = `Password Strength: ${strength}`;
        strengthBar.style.width = `${(score / 5) * 100}%`;

        if (strength === "Weak") {
            strengthBar.style.backgroundColor = "#ef4444";
        } else if (strength === "Moderate") {
            strengthBar.style.backgroundColor = "#f59e0b";
        } else {
            strengthBar.style.backgroundColor = "#22c55e";
        }

        if (feedback.length === 0) {
            feedback.push("No basic strength issues detected.");
        }

        feedback.forEach(addFeedback);
    });
}

// Add feedback safely without inserting HTML from user input
function addFeedback(message) {
    const item = document.createElement("li");
    item.textContent = message;
    passwordFeedback.appendChild(item);
}


/* ==========================================
   DASHBOARD AND TOOL VIEW NAVIGATION
   ========================================== */

const dashboardView = document.getElementById("dashboardView");
const passwordToolView = document.getElementById("password-tool");

// Open the selected tool and hide the dashboard
function openTool(toolName) {
    dashboardView.hidden = true;
    passwordToolView.hidden = true;

    if (toolName === "password") {
        passwordToolView.hidden = false;
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    const selectedLink = document.querySelector(
        `.nav-link[href="#${toolName}"]`
    );

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Return to the dashboard
function openDashboard() {
    dashboardView.hidden = false;
    passwordToolView.hidden = true;

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    const dashboardLink = document.querySelector(
        '.nav-link[href="#dashboard"]'
    );

    if (dashboardLink) {
        dashboardLink.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Connect sidebar navigation
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (href === "#dashboard") {
            event.preventDefault();
            openDashboard();
        } else if (href === "#password" || href === "#password-tool") {
            event.preventDefault();
            openTool("password");
        }
    });
});

// Connect the Password Analyzer dashboard card
document.querySelectorAll(
    '#password .tool-link, a[href="#password"]'
).forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        openTool("password");
    });
});
