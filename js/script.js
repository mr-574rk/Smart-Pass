// Password Generator Application
class PasswordGenerator {
    constructor() {
        this.passwordHistory = [];
        this.maxHistorySize = 5;
        this.init();
    }

    init() {
        // DOM Elements
        this.passwordOutput = document.getElementById('passwordOutput');
        this.copyButton = document.getElementById('copyButton');
        this.generateButton = document.getElementById('generateButton');
        this.makeStrongerButton = document.getElementById('makeStronger');
        this.revealPassword = document.getElementById('revealPassword');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.strengthLabel = document.getElementById('strengthLabel');
        this.strengthFill = document.getElementById('strengthFill');
        this.entropyInfo = document.getElementById('entropyInfo');
        this.historyList = document.getElementById('historyList');
        this.historyDropdown = document.getElementById('historyDropdown');
        this.themeToggle = document.getElementById('themeToggle');
        this.copyToast = new bootstrap.Toast(document.getElementById('copyToast'));

        // Social panel elements
        this.floatingBtn = document.querySelector('.floating-btn');
        this.socialPanelContainer = document.querySelector('.social-panel-container');
        this.closeBtn = document.querySelector('.close-btn');

        // Character sets
        this.characterSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        // Event listeners
        this.setupEventListeners();

        // Initialize with a password
        this.generatePassword();
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generatePassword());
        this.copyButton.addEventListener('click', () => this.copyToClipboard());
        this.makeStrongerButton.addEventListener('click', () => this.makeStronger());
        this.revealPassword.addEventListener('change', () => this.togglePasswordVisibility());
        this.lengthSlider.addEventListener('input', () => this.updateLengthValue());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Social panel events
        this.floatingBtn.addEventListener('click', () => {
            this.socialPanelContainer.classList.toggle('visible');
        });

        this.closeBtn.addEventListener('click', () => {
            this.socialPanelContainer.classList.remove('visible');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Check if at least one character type is selected
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#revealPassword)');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateOptions());
        });

        // Initial validation
        this.validateOptions();
    }

    validateOptions() {
        const uppercase = document.getElementById('uppercase').checked;
        const lowercase = document.getElementById('lowercase').checked;
        const numbers = document.getElementById('numbers').checked;
        const symbols = document.getElementById('symbols').checked;

        const isValid = uppercase || lowercase || numbers || symbols;
        this.generateButton.disabled = !isValid;

        if (!isValid) {
            this.generateButton.title = 'Select at least one character type';
        } else {
            this.generateButton.title = 'Generate password';
        }
    }

    updateLengthValue() {
        this.lengthValue.textContent = this.lengthSlider.value;
    }

    getSelectedCharacterSets() {
        const sets = [];
        if (document.getElementById('uppercase').checked) sets.push(this.characterSets.uppercase);
        if (document.getElementById('lowercase').checked) sets.push(this.characterSets.lowercase);
        if (document.getElementById('numbers').checked) sets.push(this.characterSets.numbers);
        if (document.getElementById('symbols').checked) sets.push(this.characterSets.symbols);
        return sets;
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const characterSets = this.getSelectedCharacterSets();

        if (characterSets.length === 0) {
            this.showError('Please select at least one character type');
            return;
        }

        // Combine all character sets
        const allCharacters = characterSets.join('');

        // Ensure at least one character from each selected set
        let password = '';
        for (const set of characterSets) {
            password += this.getRandomCharacter(set);
        }

        // Fill the rest of the password
        const remainingLength = length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += this.getRandomCharacter(allCharacters);
        }

        // Shuffle the password to avoid predictable patterns
        password = this.shuffleString(password);

        this.passwordOutput.value = password;
        this.addToHistory(password);
        this.updateStrengthMeter(password);
        this.makeStrongerButton.disabled = false;
    }

    getRandomCharacter(charSet) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        return charSet[randomValues[0] % charSet.length];
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const randomValues = new Uint32Array(1);
            window.crypto.getRandomValues(randomValues);
            const j = randomValues[0] % (i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    calculateEntropy(password) {
        const length = password.length;

        // Determine character set size based on used characters
        let charsetSize = 0;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32; // Approximate symbol count

        // If we can't determine charset, use a conservative estimate
        if (charsetSize === 0) charsetSize = 26;

        return Math.round(length * Math.log2(charsetSize));
    }

    updateStrengthMeter(password) {
        const entropy = this.calculateEntropy(password);
        this.entropyInfo.textContent = `Entropy: ${entropy} bits`;

        let strength, percentage, badgeClass, fillClass;

        if (entropy < 40) {
            strength = "Weak";
            percentage = 25;
            badgeClass = "bg-danger";
            fillClass = "strength-weak";
        } else if (entropy < 60) {
            strength = "Fair";
            percentage = 50;
            badgeClass = "bg-warning";
            fillClass = "strength-fair";
        } else if (entropy < 80) {
            strength = "Good";
            percentage = 75;
            badgeClass = "bg-info";
            fillClass = "strength-good";
        } else if (entropy < 100) {
            strength = "Strong";
            percentage = 90;
            badgeClass = "bg-success";
            fillClass = "strength-strong";
        } else {
            strength = "Very Strong";
            percentage = 100;
            badgeClass = "bg-success";
            fillClass = "strength-very-strong";
        }

        this.strengthLabel.textContent = strength;
        this.strengthLabel.className = `badge ${badgeClass}`;
        this.strengthFill.style.width = `${percentage}%`;
        this.strengthFill.className = `strength-fill ${fillClass}`;
    }

    makeStronger() {
        const currentPassword = this.passwordOutput.value;
        if (!currentPassword) return;

        // Strategies to make password stronger
        let newPassword = currentPassword;

        // If password is short, increase length
        if (newPassword.length < 20) {
            newPassword += this.getRandomCharacter(this.characterSets.symbols + this.characterSets.numbers);
        }

        // Ensure it has symbols if it doesn't
        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            const randomIndex = Math.floor(Math.random() * newPassword.length);
            newPassword = newPassword.substring(0, randomIndex) +
                this.getRandomCharacter(this.characterSets.symbols) +
                newPassword.substring(randomIndex + 1);
        }

        // Ensure it has numbers if it doesn't
        if (!/\d/.test(newPassword)) {
            const randomIndex = Math.floor(Math.random() * newPassword.length);
            newPassword = newPassword.substring(0, randomIndex) +
                this.getRandomCharacter(this.characterSets.numbers) +
                newPassword.substring(randomIndex + 1);
        }

        // Add more entropy by adding a random character
        const allChars = Object.values(this.characterSets).join('');
        newPassword += this.getRandomCharacter(allChars);

        this.passwordOutput.value = newPassword;
        this.addToHistory(newPassword);
        this.updateStrengthMeter(newPassword);
    }

    addToHistory(password) {
        // Add to beginning of history
        this.passwordHistory.unshift(password);

        // Limit history size
        if (this.passwordHistory.length > this.maxHistorySize) {
            this.passwordHistory.pop();
        }

        this.updateHistoryDropdown();
    }

    updateHistoryDropdown() {
        this.historyList.innerHTML = '';

        if (this.passwordHistory.length === 0) {
            const item = document.createElement('li');
            item.innerHTML = '<a class="dropdown-item" href="#">No history yet</a>';
            this.historyList.appendChild(item);
            this.historyDropdown.disabled = true;
        } else {
            this.passwordHistory.forEach((password, index) => {
                const item = document.createElement('li');
                const truncatedPassword = password.length > 20 ?
                    password.substring(0, 20) + '...' : password;

                item.innerHTML = `
                            <a class="dropdown-item d-flex justify-content-between align-items-center" href="#" data-password="${password}">
                                <span>${truncatedPassword}</span>
                                <small class="text-muted">${password.length} chars</small>
                            </a>
                        `;

                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.passwordOutput.value = password;
                    this.updateStrengthMeter(password);
                });

                this.historyList.appendChild(item);
            });
            this.historyDropdown.disabled = false;
        }
    }

    togglePasswordVisibility() {
        if (this.revealPassword.checked) {
            this.passwordOutput.type = 'text';
        } else {
            this.passwordOutput.type = 'password';
        }
    }

    async copyToClipboard() {
        const password = this.passwordOutput.value;
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            this.copyToast.show();
        } catch (err) {
            // Fallback for browsers that don't support clipboard API
            this.passwordOutput.select();
            document.execCommand('copy');
            this.copyToast.show();
        }
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.setAttribute('data-theme', newTheme);
        this.themeToggle.innerHTML = newTheme === 'light' ?
            '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

        // Update modal theme
        this.updateModalTheme();

        // Save preference to localStorage
        localStorage.setItem('passwordGeneratorTheme', newTheme);
    }

    updateModalTheme() {
        const modal = document.getElementById('strengthModal');
        if (modal) {
            const currentTheme = document.body.getAttribute('data-theme');
            const modalContent = modal.querySelector('.modal-content');
            const modalHeader = modal.querySelector('.modal-header');
            const modalBody = modal.querySelector('.modal-body');
            const modalFooter = modal.querySelector('.modal-footer');

            if (currentTheme === 'light') {
                modalContent.style.backgroundColor = '#ffffff';
                modalContent.style.color = '#333333';
                modalHeader.style.borderBottomColor = '#dee2e6';
                modalFooter.style.borderTopColor = '#dee2e6';
            } else {
                modalContent.style.backgroundColor = '#23235B';
                modalContent.style.color = '#ffffff';
                modalHeader.style.borderBottomColor = '#40407a';
                modalFooter.style.borderTopColor = '#40407a';
            }
        }
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'g':
                    e.preventDefault();
                    this.generatePassword();
                    break;
                case 'c':
                    if (this.passwordOutput.value) {
                        e.preventDefault();
                        this.copyToClipboard();
                    }
                    break;
                case '?':
                    e.preventDefault();
                    const modal = new bootstrap.Modal(document.getElementById('strengthModal'));
                    modal.show();
                    break;
            }
        }
    }

    showError(message) {
        // In a real app, you'd show a proper error toast/modal
        alert(message);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const generator = new PasswordGenerator();

    // Load saved theme
    const savedTheme = localStorage.getItem('passwordGeneratorTheme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').innerHTML = savedTheme === 'light' ?
        '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

    // Update modal theme on load
    generator.updateModalTheme();
});