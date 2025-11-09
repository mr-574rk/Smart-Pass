# 🔐 Smart Password Generator

> **Cryptographically Secure, User-Educative Password Builder**  
> *A modern, responsive password generator that creates strong passwords while teaching users about password security*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

<div align="center">

![Password Generator Demo](https://via.placeholder.com/800x400/4361ee/ffffff?text=Smart+Pass)

[Live Demo](https://smart-password-generator-red.vercel.app/) • [Report Bug](#) • [Request Feature](#)

</div>

## ✨ Features

### 🔒 Security-First
- **Cryptographic Randomness**: Uses `window.crypto.getRandomValues()` for true randomness
- **Entropy-Based Strength Meter**: Real-time password strength calculation using Shannon's formula
- **No Data Storage**: Passwords never leave your browser
- **Secure Character Distribution**: Ensures at least one character from each selected type

### 🎨 User Experience
- **Modern Glassmorphism UI**: Beautiful, responsive design with dark/light mode
- **Real-time Feedback**: Visual strength meter with color-coded indicators
- **Password History**: Track last 5 generated passwords
- **One-Click Copy**: Clipboard integration with toast notifications
- **Keyboard Shortcuts**: `Ctrl+G` Generate, `Ctrl+C` Copy, `Ctrl+?` Learn

### 📚 Educational
- **Strength Explanation**: Detailed modal explaining password entropy
- **Security Tips**: Password hygiene best practices and common myths
- **OWASP Guidelines**: Direct links to security standards
- **Smart Suggestions**: "Make Stronger" button with intelligent improvements

### ♿ Accessible
- **WCAG Compliant**: Proper ARIA labels and keyboard navigation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **High Contrast**: Accessible color schemes for all users

## 🚀 Quick Start

### Option 1: Use Online
Visit our [live demo](https://smart-password-generator-red.vercel.app/) to start generating secure passwords instantly.

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/mr-574rk/smart-pass.git

# Navigate to project directory
cd smart-pass

# Open in browser (no build process required!)
open index.html