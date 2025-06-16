// Caracteres posibles
const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.<>?/|'
};

function generarContraseña(longitud, opciones) {
    let chars = '';
    if (opciones.uppercase) chars += CHAR_SETS.uppercase;
    if (opciones.lowercase) chars += CHAR_SETS.lowercase;
    if (opciones.numbers) chars += CHAR_SETS.numbers;
    if (opciones.symbols) chars += CHAR_SETS.symbols;
    if (!chars) return '';
    let password = '';
    for (let i = 0; i < longitud; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function evaluarFortaleza(password) {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return {text: 'Débil', color: 'text-danger', bar: 'weak', width: 33, emoji: '😕'};
    if (score === 3 || score === 4) return {text: 'Media', color: 'text-warning', bar: 'medium', width: 66, emoji: '😐'};
    return {text: 'Fuerte', color: 'text-success', bar: 'strong', width: 100, emoji: '😎'};
}

// Inicializar tooltips de Bootstrap
function initTooltips() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
}
initTooltips();

const passwordInput = document.getElementById('generatedPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
let passwordVisible = false;

togglePasswordBtn.addEventListener('click', function() {
    passwordVisible = !passwordVisible;
    passwordInput.type = passwordVisible ? 'text' : 'password';
    togglePasswordBtn.innerHTML = passwordVisible ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
});

document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const longitud = parseInt(document.getElementById('length').value);
    const opciones = {
        uppercase: document.getElementById('uppercase').checked,
        lowercase: document.getElementById('lowercase').checked,
        numbers: document.getElementById('numbers').checked,
        symbols: document.getElementById('symbols').checked
    };
    const password = generarContraseña(longitud, opciones);
    passwordInput.value = password;
    // Evaluar fortaleza
    const fortaleza = evaluarFortaleza(password);
    const indicator = document.getElementById('strengthIndicator');
    indicator.textContent = 'Fortaleza: ' + fortaleza.text;
    indicator.className = fortaleza.color;
    // Barra de progreso
    const bar = document.getElementById('strengthBar');
    bar.style.width = fortaleza.width + '%';
    bar.className = 'progress-bar ' + fortaleza.bar;
    bar.textContent = fortaleza.text;
    // Emoji
    const emojiSpan = bar.querySelector('.emoji');
    if (emojiSpan) emojiSpan.textContent = fortaleza.emoji;
});

document.getElementById('copyBtn').addEventListener('click', function() {
    const password = passwordInput.value;
    if (password) {
        navigator.clipboard.writeText(password).then(() => {
            showToast('¡Contraseña copiada al portapapeles!', 'success');
        });
    }
});

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Modo oscuro/claro
const themeBtn = document.getElementById('toggleTheme');
const htmlTag = document.documentElement;
let darkMode = false;

themeBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    htmlTag.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    themeBtn.classList.toggle('btn-outline-dark', !darkMode);
    themeBtn.classList.toggle('btn-outline-light', darkMode);
    themeBtn.innerHTML = darkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}); 