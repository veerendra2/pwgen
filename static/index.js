const passphraseToggle = document.getElementById('passphraseToggle');
const capitalizeWords = document.getElementById('capitalizeWords');
const wordCountSlider = document.getElementById('wordCountSlider');
const wordCountValue = document.getElementById('wordCountValue');
const separator = document.getElementById('separator');
const customSeparator = document.getElementById('customSeparator');
const maxWordLength = document.getElementById('maxWordLength');
const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeDigits = document.getElementById('includeDigits');
const includeSpecial = document.getElementById('includeSpecial');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecialChars = document.getElementById('includeSpecialChars');
const excludeHomoglyphs = document.getElementById('excludeHomoglyphs');
const refreshpw = document.getElementById('refreshpw');
const languageSelect = document.getElementById('languageSelect');

separator.onchange = () => customSeparator.style.display = separator.value === 'custom' ? 'block' : 'none';

passphraseToggle.onchange = togglePassphraseOptions;

function togglePassphraseOptions() {
    document.getElementById('passwordOptions').style.display = passphraseToggle.checked ? 'none' : 'block';
    document.getElementById('passphraseOptions').style.display = passphraseToggle.checked ? 'block' : 'none';
    customSeparator.style.display = 'none';
    generatePassword();
}

document.querySelectorAll('input, select').forEach(element => {
    if (element.id !== 'passphraseToggle') {
        element.addEventListener('change', generatePassword);
    }
});


async function generatePassword() {
    const formData = new FormData();
    formData.append('length', lengthSlider.value);
    formData.append('include_uppercase', includeUppercase.checked);
    formData.append('include_digits', includeDigits.checked);
    formData.append('include_special', includeSpecial.checked);
    formData.append('exclude_homoglyphs', excludeHomoglyphs.checked);

    formData.append('include_numbers', includeNumbers.checked);
    formData.append('include_special_chars', includeSpecialChars.checked);
    formData.append('capitalize', capitalizeWords.checked);
    formData.append('word_count', wordCountSlider.value);

    formData.append('separator_type', separator.value === 'custom' ? 'single_character' : separator.value);
    if (separator.value === 'custom') {
        formData.append('user_defined_separator', customSeparator.value);
    }
    formData.append('max_word_length', maxWordLength.value);
    formData.append('type', passphraseToggle.checked ? 'passphrase' : 'password');
    formData.append('language', languageSelect.value);

    fetch('/generate-password', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok.');
            return response.json();
        })
        .then(data => {
            scrambleAnimation(data.password);
        })
        .catch(error => {
            console.error('Error generating password:', error);
        });
}

function scrambleAnimation(finalPassword) {
    let scrambled = Array.from({ length: finalPassword.length }, () => getRandomCharacter());
    passwordInput.value = scrambled.join('');
    const maxDelay = 300;
    let indexes = Array.from({ length: finalPassword.length }, (_, i) => i);

    finalPassword.split('').forEach((char, index) => {
        let delay = Math.random() * maxDelay;

        setTimeout(() => {
            scrambled[index] = char;
            passwordInput.value = scrambled.join('');
        }, delay);
    });
}

function getRandomCharacter() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{ }|;:\'",.<>/?';
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

refreshpw.addEventListener("click", async function () {
    refreshpw.classList.add('loading');

    await generatePassword();

    setTimeout(() => {
        refreshpw.classList.remove('loading');
    }, 690);
}, false);

wordCountSlider.oninput = function () {
    wordCountValue.innerText = this.value;
}

lengthSlider.oninput = function () {
    lengthValue.innerText = this.value;
}
function copyPassword() {
    const password = document.getElementById('password').value;
    copyToClipboard(password)
        .then(() => {
            console.log('Password copied to clipboard');
            onCopy();
        })
        .catch((err) => {
            console.error('Error copying password to clipboard, using fallback:', err);
            fallbackCopyTextToClipboard(password);
        });
}


function copyToClipboard(str) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(str);
    }
    return Promise.reject('The Clipboard API is not available.');
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Fallback: Copying text command was ${msg}`);
        onCopy();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function onCopy() {
    const button = document.getElementById("copypwd");
    button.innerHTML = `copied!`;

    setTimeout(() => {
        button.innerHTML = `copy password`;
    }, 1500);
}
generatePassword();