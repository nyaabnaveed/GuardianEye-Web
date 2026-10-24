
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

function runPasswordAnalysis() {
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
}

// Run analysis when the button is clicked.
if (analyzePassword) {
    analyzePassword.addEventListener("click", runPasswordAnalysis);
}

// Run analysis when Enter is pressed in the password field.
if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            runPasswordAnalysis();
        }
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
const metadataToolView = document.getElementById("metadata-tool");
const phishingToolView = document.getElementById("phishing-tool");

// Open the selected tool and hide the dashboard
function openTool(toolName, addHistory = true) {
    if (addHistory) {
        history.pushState({ view: toolName }, "", "#" + toolName);
    }    
    dashboardView.hidden = true;
    passwordToolView.hidden = true;
    metadataToolView.hidden = true;
    phishingToolView.hidden = true;

    if (toolName === "password") {
        passwordToolView.hidden = false;
    }

    if (toolName === "metadata") {
        metadataToolView.hidden = false;
    }

    if (toolName === "phishing") {
        phishingToolView.hidden = false;
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
function openDashboard(addHistory = true) {
    if (addHistory) {
        history.pushState({ view: "dashboard" }, "", "#dashboard");
    }    
    dashboardView.hidden = false;
    passwordToolView.hidden = true;
    metadataToolView.hidden = true;
    phishingToolView.hidden = true;

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
        } 
        else if (href === "#password" || href === "#password-tool") {
            event.preventDefault();
            openTool("password");
        } 
        else if (href === "#metadata" || href === "#metadata-tool") {
            event.preventDefault();
            openTool("metadata");
        }
        else if (href === "#phishing" || href === "#phishing-tool") {
            event.preventDefault();
            openTool("phishing");
        }
    });
});

// Connect the Password Analyzer dashboard card
document.querySelectorAll(
    '#dashboardView #password .tool-link, #dashboardView a[href="#password"]'
).forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        openTool("password");
    });
});

document.querySelectorAll(
    '#dashboardView #metadata .tool-link, #dashboardView a[href="#metadata"]'
).forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        openTool("metadata");
    });
});

const metadataImage = document.getElementById("metadataImage");
const inspectMetadataButton = document.getElementById("inspectMetadata");
const scrubMetadataButton = document.getElementById("scrubMetadata");
const metadataStatus = document.getElementById("metadataStatus");
const metadataResults = document.getElementById("metadataResults");
const metadataSummary = document.getElementById("metadataSummary");
const metadataList = document.getElementById("metadataList");

function getSelectedImage() {
    if (!metadataImage.files.length) {
        metadataStatus.textContent = "Please select a JPEG image first.";
        return null;
    }

    return metadataImage.files[0];
}

inspectMetadataButton.addEventListener("click", async () => {
    const image = getSelectedImage();

    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    metadataStatus.textContent = "Inspecting image metadata...";
    metadataResults.hidden = true;

    try {
        const response = await fetch("/inspect-metadata", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not inspect this image.");
        }

        metadataList.replaceChildren();

        const entries = Object.entries(result.metadata);

        metadataSummary.textContent =
            `${result.filename} — ${result.format} — ` +
            `${result.metadata_count} EXIF metadata fields found.`;

        if (entries.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No EXIF metadata was found.";
            metadataList.appendChild(item);
        } else {
            entries.forEach(([name, value]) => {
                const item = document.createElement("li");
                item.textContent = `${name}: ${value}`;
                metadataList.appendChild(item);
            });
        }

        metadataResults.hidden = false;
        metadataStatus.textContent = "Metadata inspection complete.";

    } catch (error) {
        metadataStatus.textContent = error.message;
    }
});

scrubMetadataButton.addEventListener("click", async () => {
    const image = getSelectedImage();

    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    metadataStatus.textContent = "Removing EXIF metadata...";

    try {
        const response = await fetch("/scrub-metadata", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Could not clean this image.");
        }

        const cleanedImage = await response.blob();
        const downloadUrl = URL.createObjectURL(cleanedImage);
        const downloadLink = document.createElement("a");

        downloadLink.href = downloadUrl;
        downloadLink.download = "cleaned_image.jpg";
        downloadLink.click();

        URL.revokeObjectURL(downloadUrl);

        metadataStatus.textContent =
            "Cleaned image downloaded successfully.";

    } catch (error) {
        metadataStatus.textContent = error.message;
    }
});


const phishingUrl = document.getElementById("phishingUrl");
const checkPhishingButton = document.getElementById("checkPhishing");
const phishingStatus = document.getElementById("phishingStatus");
const phishingResults = document.getElementById("phishingResults");
const phishingRisk = document.getElementById("phishingRisk");
const phishingSummary = document.getElementById("phishingSummary");
const phishingWarnings = document.getElementById("phishingWarnings");

async function analyzePhishingUrl() {
    const url = phishingUrl.value.trim();

    if (!url) {
        phishingStatus.textContent = "Please enter a website URL first.";
        phishingResults.hidden = true;
        return;
    }

    phishingStatus.textContent = "Analyzing URL...";
    phishingResults.hidden = true;

    try {
        const response = await fetch("/check-phishing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not analyze this URL.");
        }

        phishingRisk.textContent = result.risk_level;

        phishingResults.classList.remove(
            "risk-low",
            "risk-suspicious",
            "risk-high"
        );

        if (result.risk_level === "Low Risk") {
            phishingResults.classList.add("risk-low");
        } else if (result.risk_level === "Suspicious") {
            phishingResults.classList.add("risk-suspicious");
        } else {
            phishingResults.classList.add("risk-high");
        }

        phishingSummary.textContent = result.message;
        phishingWarnings.replaceChildren();

        if (result.warnings.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No suspicious patterns were detected.";
            phishingWarnings.appendChild(item);
        } else {
            result.warnings.forEach((warning) => {
                const item = document.createElement("li");
                item.textContent = warning;
                phishingWarnings.appendChild(item);
            });
        }

        phishingResults.hidden = false;
        phishingStatus.textContent = "URL analysis complete.";

    } catch (error) {
        phishingStatus.textContent = error.message;
    }
}

// Run the checker when the button is clicked.
checkPhishingButton.addEventListener("click", analyzePhishingUrl);

// Run the checker when Enter is pressed in the URL field.
phishingUrl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        analyzePhishingUrl();
    }
});


const phishingCardLink = document.querySelector(
    '#dashboardView #phishing .tool-link, #dashboardView a[href="#phishing"]'
);

if (phishingCardLink) {
    phishingCardLink.addEventListener("click", event => {
        event.preventDefault();
        openTool("phishing");
    });
}

// Support browser Back and Forward navigation
window.addEventListener("popstate", () => {
    const currentView = window.location.hash.replace("#", "");

    if (currentView === "password" || currentView === "password-tool") {
        openTool("password", false);
    } else if (currentView === "metadata" || currentView === "metadata-tool") {
        openTool("metadata", false);
    } else if (currentView === "phishing" || currentView === "phishing-tool") {
        openTool("phishing", false);
    } else {
        openDashboard(false);
    }
});

// Keep the Dashboard as the initial application history entry.
if (!window.location.hash) {
    history.replaceState(
        { view: "dashboard" },
        "",
        "#dashboard"
    );
}