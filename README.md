# GuardianEye 🛡️
### Your Everyday Security & Privacy Toolkit

GuardianEye is a web-based security and privacy toolkit that brings together three practical tools to help users identify common digital risks, improve password awareness, and protect image privacy through a simple interface.

🌐 **Live Demo:** https://nyaabnaveed.pythonanywhere.com  
💻 **Source Code:** https://github.com/nyaabnaveed/GuardianEye-Web

## ✨ Features

### 🔐 1. Password Analyzer
- Evaluates password strength using multiple checks.
- Identifies potential weaknesses and common password patterns.
- Provides security warnings and suggestions for improvement.
- Includes a show/hide password option.

### 🖼️ 2. Metadata Scrubber
- Accepts JPEG images for EXIF metadata inspection.
- Processes images to remove EXIF metadata from the cleaned output.
- Allows users to download the cleaned image.
- Helps reduce unintended exposure of image-related information.

**Scope:** The current implementation focuses on JPEG EXIF metadata removal.

### 🔎 3. Phishing Checker
- Analyzes submitted URLs using rule-based checks.
- Flags potentially suspicious indicators, including unusual URL structures, IP-based hosts, insecure HTTP connections, and other recognizable patterns.
- Displays a risk assessment with relevant warnings.
- Helps users recognize links that may require further investigation.

**Important:** The Phishing Checker does not use a live threat-intelligence database. A low-risk result does not guarantee that a URL or website is safe.

## 🛠️ Tech Stack

- **Backend:** Python, Flask
- **Frontend:** HTML, CSS, JavaScript
- **Image Processing:** Pillow
- **Development Tools:** Visual Studio Code, Git, GitHub

## 🚀 Getting Started

### Prerequisites
- Python 3.12 or a compatible Python version
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/nyaabnaveed/GuardianEye-Web.git
cd GuardianEye-Web
```

**2. Create a virtual environment**

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Run the application**

```bash
python app.py
```

Open the local URL displayed in your terminal, usually:

`http://127.0.0.1:5000`

## 🎯 Project Goal

Everyday digital interactions can expose users to weak passwords, suspicious links, and unintended image metadata sharing. GuardianEye brings practical checks for these concerns into one accessible web application.

The goal is to make basic security and privacy awareness easier to understand and use.

## 🔮 Future Improvements

Potential future enhancements include:

- User authentication and personalized settings.
- Expanded threat intelligence for URL analysis.
- Support for additional image formats and metadata types.
- More advanced password-security checks.
- Additional security and privacy tools.

These are planned improvements and are not part of the current implementation.

## 👩‍💻 Built For

GuardianEye was developed as a hands-on project to explore web development, security awareness, image processing, and practical software engineering.

## ⚠️ Disclaimer

GuardianEye is an educational security-awareness toolkit. Its results are intended to support user awareness and should not be treated as a guarantee of security or as a substitute for professional security analysis.

---

**GuardianEye — Make everyday digital security more accessible.**
