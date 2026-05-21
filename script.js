// Custom Word Bank & Quotes for Typing Master Pro
const wordBank = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const comprehensiveQuotes = [
    "The art of programming is the art of organizing complexity, of mastering multitude and avoiding its millions of monstrous bugs.",
    "Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make things worse: complexity sells better.",
    "Modern UI design isn't just about beautiful color palettes; it is fundamentally about removing unnecessary friction between the user and the system.",
    "Asynchronous systems allow workflows to operate efficiently, making applications fast and responsive even under a heavy load of structural tasks.",
    "Clean code always looks like it was written by someone who cares. There is nothing obvious you can do to make it any better than it already is.",
    "In the world of software development, the only constant is change, and the ability to adapt is the ultimate developer superpower.",
    "A computer is like a violin. You can play a beautiful tune on it, but you have to know how to play it, and that takes absolute practice and persistence.",
    "Success in typing is built upon consistency and accuracy. Do not rush to make speed; instead, let speed find you naturally as muscle memory takes hold."
];

// Web Audio API Synthesizer for Mechanical Keyboard Sound Effects
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Generate synthesizer clicking sounds programmatically
function playMechanicalClick(type, isSpace = false) {
    if (type === 'mute') return;
    initAudio();
    if (!audioCtx) return;

    const time = audioCtx.currentTime;
    
    // Gain Node for general volume envelope
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    if (type === 'blue') {
        // MX Blue: High frequency metallic click + sharp transient
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isSpace ? 900 : 1500, time);
        osc.frequency.exponentialRampToValueAtTime(isSpace ? 200 : 300, time + 0.05);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isSpace ? 1500 : 3000, time);
        filter.Q.setValueAtTime(5, time);

        gainNode.gain.setValueAtTime(0.08, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.start(time);
        osc.stop(time + 0.05);

        // Secondary metallic pin click
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.connect(clickGain);
        clickGain.connect(audioCtx.destination);
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(4500, time);
        clickGain.gain.setValueAtTime(0.04, time);
        clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.008);
        clickOsc.start(time);
        clickOsc.stop(time + 0.01);

    } else if (type === 'brown') {
        // MX Brown: Soft tactile bump, medium low thud
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isSpace ? 350 : 580, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.06);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, time);

        gainNode.gain.setValueAtTime(0.12, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.start(time);
        osc.stop(time + 0.06);

    } else if (type === 'cream') {
        // Linear Cream: Damped deep thocky sound
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isSpace ? 180 : 250, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, time);

        gainNode.gain.setValueAtTime(0.16, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.start(time);
        osc.stop(time + 0.09);

    } else if (type === 'typewriter') {
        // Retro Typewriter: Heavy mechanical clack + dynamic metallic ring for space bar
        const osc = audioCtx.createOscillator();
        const noise = createNoiseBuffer();
        
        if (noise) {
            const noiseSource = audioCtx.createBufferSource();
            const noiseFilter = audioCtx.createBiquadFilter();
            const noiseGain = audioCtx.createGain();
            
            noiseSource.buffer = noise;
            noiseSource.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(isSpace ? 600 : 1200, time);
            noiseFilter.Q.setValueAtTime(3, time);
            
            noiseGain.gain.setValueAtTime(0.05, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
            
            noiseSource.start(time);
            noiseSource.stop(time + 0.08);
        }

        osc.connect(gainNode);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isSpace ? 180 : 400, time);
        osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);

        gainNode.gain.setValueAtTime(0.14, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

        osc.start(time);
        osc.stop(time + 0.1);

        // Add carriage return ding on spaces occasionally
        if (isSpace) {
            const bellOsc = audioCtx.createOscillator();
            const bellGain = audioCtx.createGain();
            bellOsc.connect(bellGain);
            bellGain.connect(audioCtx.destination);
            bellOsc.type = 'sine';
            bellOsc.frequency.setValueAtTime(2200, time);
            bellGain.gain.setValueAtTime(0.06, time);
            bellGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
            bellOsc.start(time);
            bellOsc.stop(time + 0.4);
        }
    }
}

// Support function to generate random click friction noise
function createNoiseBuffer() {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 0.1;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

// Elements Grabber
const wordsContainer = document.getElementById('words-container');
const hiddenInput = document.getElementById('hidden-input');
const typingCard = document.getElementById('typing-card');
const btnRestart = document.getElementById('btn-restart');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const soundLabel = document.getElementById('sound-label');
const btnHistory = document.getElementById('btn-history');
const btnCloseDrawer = document.getElementById('btn-close-drawer');
const historyDrawer = document.getElementById('history-drawer');
const drawerBackdrop = document.getElementById('drawer-backdrop');
const historyList = document.getElementById('history-list');
const btnClearHistory = document.getElementById('btn-clear-history');
const themeSelector = document.getElementById('theme-selector');

// Config and Metrics elements
const liveWpm = document.getElementById('live-wpm');
const liveAccuracy = document.getElementById('live-accuracy');
const liveProgress = document.getElementById('live-progress');
const progressLabel = document.getElementById('progress-label');
const subConfigGroup = document.getElementById('sub-config-group');
const resultsPanel = document.getElementById('results-panel');
const resWpm = document.getElementById('res-wpm');
const resAccuracy = document.getElementById('res-accuracy');
const resRaw = document.getElementById('res-raw');
const resMistakes = document.getElementById('res-mistakes');
const badgesContainer = document.getElementById('badges-container');

// Custom Text Modal elements
const customTextModal = document.getElementById('custom-text-modal');
const customTextInput = document.getElementById('custom-text-input');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalSave = document.getElementById('btn-modal-save');

// Toast notifications
const toastContainer = document.getElementById('toast-container');

// Application Game State
let appMode = 'time'; // time, words, zen, custom
let subConfigValue = 30; // seconds or words depending on appMode
let isTestRunning = false;
let testTime = 30; // total duration
let timeLeft = 30;
let timerInterval = null;
let customParagraph = "";

// Typing metrics variables
let rawKeystrokes = 0;
let correctCharactersCount = 0;
let totalTypedCharacters = 0;
let errorsCount = 0;
let charSpans = [];
let chartInstance = null;
let soundPreset = 'blue'; // blue, brown, cream, typewriter, mute
let metricsOverTime = []; // list of {sec, wpm, raw}

// Sounds presets cycle
const soundPresets = ['blue', 'brown', 'cream', 'typewriter', 'mute'];
const soundPresetLabels = {
    'blue': 'MX Blue',
    'brown': 'MX Brown',
    'cream': 'Linear Cream',
    'typewriter': 'Typewriter',
    'mute': 'Muted'
};

// Initial Setup triggers
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    setupEventListeners();
    initTest();
});

// Load preferences from local storage
function loadPreferences() {
    const savedTheme = localStorage.getItem('sleektype-theme') || 'default';
    themeSelector.value = savedTheme;
    if (savedTheme !== 'default') {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const savedSound = localStorage.getItem('sleektype-sound') || 'blue';
    if (soundPresets.includes(savedSound)) {
        soundPreset = savedSound;
        soundLabel.textContent = soundPresetLabels[soundPreset];
    }
}

// Save specific preference setting
function savePreference(key, val) {
    localStorage.setItem(key, val);
}

// Setup all click / keystroke listeners
function setupEventListeners() {
    // Mode switcher buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            const selectedMode = btn.getAttribute('data-mode');
            btn.classList.add('active');
            changeMode(selectedMode);
        });
    });

    // Theme selector
    themeSelector.addEventListener('change', (e) => {
        const theme = e.target.value;
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        savePreference('sleektype-theme', theme);
        showToast("Theme changed to " + themeSelector.options[themeSelector.selectedIndex].text);
    });

    // Sound cycling
    btnSoundToggle.addEventListener('click', () => {
        const currIndex = soundPresets.indexOf(soundPreset);
        const nextIndex = (currIndex + 1) % soundPresets.length;
        soundPreset = soundPresets[nextIndex];
        soundLabel.textContent = soundPresetLabels[soundPreset];
        savePreference('sleektype-sound', soundPreset);
        
        // play verification click
        if (soundPreset !== 'mute') {
            playMechanicalClick(soundPreset);
        }
        showToast(`Sound profile set to ${soundPresetLabels[soundPreset]}`);
    });

    // Virtual Keyboard interaction handlers
    window.addEventListener('keydown', handleGlobalKeydown);
    window.addEventListener('keyup', handleGlobalKeyup);

    // Typing field trigger Focus
    typingCard.addEventListener('click', () => {
        hiddenInput.focus();
    });
    hiddenInput.addEventListener('focus', () => {
        typingCard.classList.add('focused');
    });
    hiddenInput.addEventListener('blur', () => {
        typingCard.classList.remove('focused');
    });

    // Live typing processor
    hiddenInput.addEventListener('input', handleTypingInput);

    // Buttons
    btnRestart.addEventListener('click', () => {
        initTest();
        showToast("Test restarted");
    });
    
    btnHistory.addEventListener('click', openHistoryDrawer);
    btnCloseDrawer.addEventListener('click', closeHistoryDrawer);
    drawerBackdrop.addEventListener('click', closeHistoryDrawer);
    btnClearHistory.addEventListener('click', clearHistory);

    // Custom Paragraph Modal handlers
    btnModalCancel.addEventListener('click', () => {
        customTextModal.classList.remove('active');
        hiddenInput.focus();
    });
    btnModalSave.addEventListener('click', () => {
        const text = customTextInput.value.trim();
        if (text.length > 5) {
            customParagraph = text;
            customTextModal.classList.remove('active');
            initTest();
            showToast("Custom text loaded!");
        } else {
            showToast("Text too short! Enter at least 5 characters.");
        }
    });
}

// Change overall typing test type
function changeMode(mode) {
    appMode = mode;
    resultsPanel.classList.remove('active');
    
    // Set UI configuration items
    if (mode === 'time') {
        subConfigValue = 30;
        renderSubConfigs([15, 30, 60, 120], 's');
    } else if (mode === 'words') {
        subConfigValue = 25;
        renderSubConfigs([10, 25, 50, 100], ' words');
    } else if (mode === 'zen') {
        subConfigValue = Infinity;
        subConfigGroup.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">Infinite practice canvas</span>`;
    } else if (mode === 'custom') {
        subConfigValue = 'custom';
        subConfigGroup.innerHTML = `
            <button class="btn-control" id="btn-open-custom-modal" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                Set Custom Text
            </button>
        `;
        document.getElementById('btn-open-custom-modal').addEventListener('click', () => {
            customTextInput.value = customParagraph;
            customTextModal.classList.add('active');
            customTextInput.focus();
        });
        
        if (!customParagraph) {
            // Trigger auto opening of modal
            customTextModal.classList.add('active');
            customTextInput.focus();
            return;
        }
    }
    
    initTest();
}

// Render dynamic time/word configurations buttons
function renderSubConfigs(options, suffix) {
    subConfigGroup.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.classList.add('sub-btn');
        if (opt === subConfigValue) btn.classList.add('active');
        btn.textContent = opt + suffix;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            subConfigValue = opt;
            initTest();
        });
        subConfigGroup.appendChild(btn);
    });
}

// Toast System
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 50);

    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Core Initializer
function initTest() {
    clearInterval(timerInterval);
    isTestRunning = false;
    rawKeystrokes = 0;
    correctCharactersCount = 0;
    totalTypedCharacters = 0;
    errorsCount = 0;
    metricsOverTime = [];

    // Hide results panel if displayed
    resultsPanel.classList.remove('active');

    // UI Reset
    liveWpm.textContent = '0';
    liveAccuracy.textContent = '100%';
    
    hiddenInput.disabled = false;
    hiddenInput.value = '';

    // Load dynamic words
    generateTextToType();
    
    // Set standard timer setups
    if (appMode === 'time') {
        timeLeft = subConfigValue;
        testTime = subConfigValue;
        progressLabel.textContent = 'time';
        liveProgress.textContent = timeLeft + 's';
    } else if (appMode === 'words') {
        progressLabel.textContent = 'progress';
        liveProgress.textContent = '0/' + subConfigValue;
    } else if (appMode === 'zen') {
        progressLabel.textContent = 'zen';
        liveProgress.textContent = '∞';
    } else if (appMode === 'custom') {
        progressLabel.textContent = 'words';
        // count words in custom paragraph
        const wordCount = customParagraph.split(/\s+/).filter(w => w.length > 0).length;
        liveProgress.textContent = '0/' + wordCount;
    }

    // Scroll container back to top
    wordsContainer.style.transform = 'translateY(0px)';
    
    hiddenInput.focus();
}

// Generate the text block matching the configurations
function generateTextToType() {
    wordsContainer.innerHTML = '';
    charSpans = [];
    let text = "";

    if (appMode === 'time' || appMode === 'zen') {
        // Generate a random pool of ~120 words to make sure we don't run out
        const selectedWords = [];
        for (let i = 0; i < 150; i++) {
            selectedWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
        }
        text = selectedWords.join(' ');
    } else if (appMode === 'words') {
        // strictly generate exactly subConfigValue words
        const selectedWords = [];
        for (let i = 0; i < subConfigValue; i++) {
            selectedWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
        }
        text = selectedWords.join(' ');
    } else if (appMode === 'custom') {
        text = customParagraph || "Please set your custom text inside the configuration dashboard to begin practicing!";
    }

    // Render individual character spans inside container
    text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.classList.add('char');
        // Handle space rendering nicely
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
            span.setAttribute('data-char', ' ');
        } else {
            span.innerText = char;
            span.setAttribute('data-char', char);
        }
        wordsContainer.appendChild(span);
        charSpans.push(span);
    });

    if (charSpans.length > 0) {
        charSpans[0].classList.add('current');
    }
}

// Active dynamic typing input engine
function handleTypingInput(e) {
    const value = hiddenInput.value;
    const currentLength = value.length;
    
    if (!isTestRunning) {
        startTypingTest();
    }

    // Play click sound synthesizers
    if (e.inputType !== 'deleteContentBackward') {
        const lastCharTyped = value.charAt(currentLength - 1);
        playMechanicalClick(soundPreset, lastCharTyped === ' ');
        rawKeystrokes++;
    }

    // Process all visual statuses
    correctCharactersCount = 0;
    errorsCount = 0;
    
    charSpans.forEach((span, idx) => {
        span.classList.remove('current', 'correct', 'incorrect');
        
        if (idx < currentLength) {
            const typedVal = value.charAt(idx);
            const expectedVal = span.getAttribute('data-char');
            
            if (typedVal === expectedVal) {
                span.classList.add('correct');
                correctCharactersCount++;
            } else {
                span.classList.add('incorrect');
                errorsCount++;
            }
        }
    });

    totalTypedCharacters = currentLength;

    // Apply scrolling or wrap view management to stay on the correct line
    manageContainerScrolling(currentLength);

    // Apply caret/cursor on current index
    if (currentLength < charSpans.length) {
        charSpans[currentLength].classList.add('current');
    }

    calculateLiveMetrics();

    // Check if test ends
    if (appMode === 'words' && currentLength >= charSpans.length) {
        endTypingTest();
    } else if (appMode === 'custom' && currentLength >= charSpans.length) {
        endTypingTest();
    } else if (appMode === 'zen' && currentLength >= charSpans.length - 20) {
        // Zen mode append more words seamlessly before hitting the end
        appendMoreZenWords();
    }
}

// Smooth typing viewport scrolling wrapper
function manageContainerScrolling(currentIndex) {
    if (currentIndex === 0) {
        wordsContainer.style.transform = 'translateY(0px)';
        return;
    }
    
    const activeChar = charSpans[currentIndex];
    if (!activeChar) return;
    
    const containerTop = wordsContainer.getBoundingClientRect().top;
    const charTop = activeChar.getBoundingClientRect().top;
    
    // If the active character wraps to the next line (greater than 40px offset)
    const relativeOffset = charTop - containerTop;
    if (relativeOffset > 60) {
        // Shift container upwards to bring line into focus
        const scrollShift = Math.floor(relativeOffset / 40) * 35;
        wordsContainer.style.transform = `translateY(-${scrollShift}px)`;
        wordsContainer.style.transition = 'transform 0.25s ease';
    }
}

// Seamless word appending for Zen infinite practice
function appendMoreZenWords() {
    const additionalWords = [];
    for (let i = 0; i < 40; i++) {
        additionalWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
    }
    const newText = " " + additionalWords.join(' ');
    
    newText.split('').forEach((char) => {
        const span = document.createElement('span');
        span.classList.add('char');
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
            span.setAttribute('data-char', ' ');
        } else {
            span.innerText = char;
            span.setAttribute('data-char', char);
        }
        wordsContainer.appendChild(span);
        charSpans.push(span);
    });
}

// Begin active timers
function startTypingTest() {
    isTestRunning = true;
    const startTime = Date.now();
    let elapsedSeconds = 0;
    
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        
        if (appMode === 'time') {
            timeLeft--;
            liveProgress.textContent = timeLeft + 's';
            
            // Record seconds snapshots for high fidelity Chart.js plots
            recordMetricSnapshot(elapsedSeconds);

            if (timeLeft <= 0) {
                endTypingTest();
            }
        } else {
            // non-time modes count upwards
            liveProgress.textContent = getNonTimeProgressLabel();
            recordMetricSnapshot(elapsedSeconds);
        }

        calculateLiveMetrics();
    }, 1000);
}

// Snap second-by-second analytics for post-game reports
function recordMetricSnapshot(seconds) {
    const minutes = seconds / 60;
    const currentWpm = Math.round((correctCharactersCount / 5) / minutes) || 0;
    const currentRaw = Math.round((rawKeystrokes / 5) / minutes) || 0;
    
    metricsOverTime.push({
        second: seconds,
        wpm: currentWpm,
        raw: currentRaw
    });
}

// Helper to determine the non-timer labels
function getNonTimeProgressLabel() {
    if (appMode === 'words') {
        const typedWords = hiddenInput.value.split(/\s+/).length - 1;
        return `${Math.min(typedWords, subConfigValue)}/${subConfigValue}`;
    } else if (appMode === 'zen') {
        return '∞';
    } else if (appMode === 'custom') {
        const totalWords = customParagraph.split(/\s+/).filter(w => w.length > 0).length;
        const currentWords = hiddenInput.value.split(/\s+/).filter(w => w.length > 0).length;
        return `${Math.min(currentWords, totalWords)}/${totalWords}`;
    }
    return '';
}

// Instant math tracking calculators
function calculateLiveMetrics() {
    const elapsedMinutes = getElapsedMinutes();
    
    // WPM: Standard calculation maps 5 character slots to 1 word
    let wpm = 0;
    if (elapsedMinutes > 0) {
        wpm = Math.round((correctCharactersCount / 5) / elapsedMinutes);
    }
    liveWpm.textContent = Math.max(0, wpm);

    // Accuracy
    let acc = 100;
    if (totalTypedCharacters > 0) {
        acc = Math.round((correctCharactersCount / totalTypedCharacters) * 100);
    }
    liveAccuracy.textContent = acc + '%';
}

function getElapsedMinutes() {
    if (appMode === 'time') {
        return (testTime - timeLeft) / 60;
    } else {
        // custom or words modes: track elapsed seconds from snapshot logs
        return (metricsOverTime.length || 1) / 60;
    }
}

// End Game logic
function endTypingTest() {
    clearInterval(timerInterval);
    isTestRunning = false;
    hiddenInput.disabled = true;
    typingCard.classList.remove('focused');

    const totalDurationSeconds = metricsOverTime.length || 1;
    const elapsedMinutes = totalDurationSeconds / 60;

    // Final calculations
    const finalWpm = Math.round((correctCharactersCount / 5) / elapsedMinutes) || 0;
    const finalRaw = Math.round((rawKeystrokes / 5) / elapsedMinutes) || 0;
    const finalAcc = totalTypedCharacters > 0 ? Math.round((correctCharactersCount / totalTypedCharacters) * 100) : 0;
    
    // Show results values
    resWpm.textContent = finalWpm;
    resAccuracy.textContent = finalAcc + '%';
    resRaw.textContent = finalRaw;
    resMistakes.textContent = errorsCount;

    // Reveal Results UI dashboard
    resultsPanel.classList.add('active');
    
    // Smooth scroll down to analytics
    setTimeout(() => {
        resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);

    // Render visual Chart.js report graph
    renderResultChart();

    // Check Achievements & Badges triggers
    evaluateAchievements(finalWpm, finalAcc);

    // Save attempt to localStorage history logs
    saveRunToHistory(finalWpm, finalAcc, finalRaw);
}

// Chart.js Graph Render
function renderResultChart() {
    const ctx = document.getElementById('results-chart').getContext('2d');
    
    // Destroy previous Chart instance
    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = metricsOverTime.map(m => m.second + 's');
    const wpmData = metricsOverTime.map(m => m.wpm);
    const rawData = metricsOverTime.map(m => m.raw);

    // Fallback if test completed too quickly
    if (labels.length === 0) {
        labels.push('1s');
        wpmData.push(resWpm.textContent);
        rawData.push(resRaw.textContent);
    }

    // Fetch theme accent color to make chart responsive
    const computedAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#66fcf1';
    const computedTextSub = getComputedStyle(document.documentElement).getPropertyValue('--text-sub').trim() || '#c5c6c7';
    const computedGridColor = getComputedStyle(document.documentElement).getPropertyValue('--card-border').trim() || 'rgba(255,255,255,0.05)';

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Real WPM',
                    data: wpmData,
                    borderColor: computedAccentColor,
                    backgroundColor: 'rgba(102, 252, 241, 0.05)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: labels.length > 30 ? 0 : 3,
                    pointHoverRadius: 6
                },
                {
                    label: 'Raw WPM',
                    data: rawData,
                    borderColor: computedTextSub,
                    borderDash: [5, 5],
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    tension: 0.35,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: computedTextSub,
                        font: { family: 'Poppins', size: 11 }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(20, 22, 33, 0.95)',
                    titleColor: computedAccentColor,
                    bodyColor: '#fff',
                    borderColor: computedGridColor,
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: computedGridColor },
                    ticks: { color: computedTextSub, font: { family: 'JetBrains Mono', size: 10 } }
                },
                y: {
                    grid: { color: computedGridColor },
                    ticks: { color: computedTextSub, font: { family: 'JetBrains Mono', size: 10 } },
                    min: 0
                }
            }
        }
    });
}

// On-screen Virtual Keyboard visualizer handlers
const keyMap = {
    'q': 'key-q', 'w': 'key-w', 'e': 'key-e', 'r': 'key-r', 't': 'key-t', 'y': 'key-y', 'u': 'key-u', 'i': 'key-i', 'o': 'key-o', 'p': 'key-p', '[': 'key-[', ']': 'key-]',
    'a': 'key-a', 's': 'key-s', 'd': 'key-d', 'f': 'key-f', 'g': 'key-g', 'h': 'key-h', 'j': 'key-j', 'k': 'key-k', 'l': 'key-l', ';': 'key-;', "'": "key-'",
    'z': 'key-z', 'x': 'key-x', 'c': 'key-c', 'v': 'key-v', 'b': 'key-b', 'n': 'key-n', 'm': 'key-m', ',': 'key-,', '.': 'key-.', '/': 'key-/', ' ': 'key-space'
};

function handleGlobalKeydown(e) {
    // Focus capture: if input is disabled or active elements are modals, ignore
    if (document.activeElement === customTextInput) return;
    
    // Auto focus hidden inputs on keys
    if (document.activeElement !== hiddenInput && !hiddenInput.disabled) {
        hiddenInput.focus();
    }

    const key = e.key.toLowerCase();
    const targetId = keyMap[key];
    if (targetId) {
        const keyElement = document.getElementById(targetId);
        if (keyElement) {
            keyElement.classList.add('active');
        }
    }
}

function handleGlobalKeyup(e) {
    const key = e.key.toLowerCase();
    const targetId = keyMap[key];
    if (targetId) {
        const keyElement = document.getElementById(targetId);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
}

// local History Log Manager
function saveRunToHistory(wpm, acc, raw) {
    const history = JSON.parse(localStorage.getItem('sleektype-history')) || [];
    const run = {
        date: new Date().toLocaleString(),
        wpm: wpm,
        accuracy: acc,
        raw: raw,
        mode: appMode
    };
    history.unshift(run); // Keep newest on top
    localStorage.setItem('sleektype-history', JSON.stringify(history.slice(0, 50))); // Limit to 50 items
}

function openHistoryDrawer() {
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('sleektype-history')) || [];
    
    if (history.length === 0) {
        historyList.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 2rem;">No tests logged yet. Complete a test to see results!</div>`;
    } else {
        history.forEach(run => {
            const item = document.createElement('div');
            item.classList.add('history-item');
            item.innerHTML = `
                <div class="history-item-left">
                    <span class="history-wpm">${run.wpm} WPM</span>
                    <span class="history-date">${run.date}</span>
                </div>
                <div style="text-align: right;">
                    <div class="history-acc">Acc: ${run.accuracy}%</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Mode: ${run.mode}</div>
                </div>
            `;
            historyList.appendChild(item);
        });
    }

    historyDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
}

function closeHistoryDrawer() {
    historyDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    hiddenInput.focus();
}

function clearHistory() {
    if (confirm("Are you sure you want to clear all history records?")) {
        localStorage.removeItem('sleektype-history');
        openHistoryDrawer();
        showToast("History cleared successfully!");
    }
}

// Gamification & Badges Engine
const badgeDetails = [
    { id: 'first_steps', name: 'First Steps', desc: 'Complete your first speed test', icon: '🌱' },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Maintain 80+ WPM typing speed', icon: '⚡' },
    { id: 'sniper', name: 'Sniper Acc', desc: 'Achieve perfect 100% accuracy', icon: '🎯' },
    { id: 'hyper_sonic', name: 'Hypersonic', desc: 'Blast past 100+ WPM speed barrier', icon: '🚀' },
    { id: 'custom_pro', name: 'Custom Builder', desc: 'Complete a custom paragraph practice run', icon: '✍️' },
    { id: 'zen_master', name: 'Zen Master', desc: 'Focus completely and type in Zen mode', icon: '🧘' }
];

function evaluateAchievements(wpm, acc) {
    badgesContainer.innerHTML = '';
    const unlockedBadges = JSON.parse(localStorage.getItem('sleektype-badges')) || [];

    // Trigger evaluations
    if (!unlockedBadges.includes('first_steps')) {
        unlockedBadges.push('first_steps');
        showAchievementUnlockToast('First Steps 🌱');
    }

    if (wpm >= 80 && !unlockedBadges.includes('speed_demon')) {
        unlockedBadges.push('speed_demon');
        showAchievementUnlockToast('Speed Demon ⚡');
    }

    if (wpm >= 100 && !unlockedBadges.includes('hyper_sonic')) {
        unlockedBadges.push('hyper_sonic');
        showAchievementUnlockToast('Hypersonic 🚀');
    }

    if (acc === 100 && !unlockedBadges.includes('sniper')) {
        unlockedBadges.push('sniper');
        showAchievementUnlockToast('Sniper Acc 🎯');
    }

    if (appMode === 'custom' && !unlockedBadges.includes('custom_pro')) {
        unlockedBadges.push('custom_pro');
        showAchievementUnlockToast('Custom Builder ✍️');
    }

    if (appMode === 'zen' && !unlockedBadges.includes('zen_master')) {
        unlockedBadges.push('zen_master');
        showAchievementUnlockToast('Zen Master 🧘');
    }

    // Save and render all unlocked/locked items
    localStorage.setItem('sleektype-badges', JSON.stringify(unlockedBadges));

    badgeDetails.forEach(b => {
        const isUnlocked = unlockedBadges.includes(b.id);
        const badgeEl = document.createElement('div');
        badgeEl.classList.add('badge');
        if (isUnlocked) {
            badgeEl.classList.add('unlocked');
            badgeEl.setAttribute('title', b.desc);
        } else {
            badgeEl.setAttribute('title', `Locked: ${b.desc}`);
        }
        badgeEl.innerHTML = `<span>${b.icon}</span> <span>${b.name}</span>`;
        badgesContainer.appendChild(badgeEl);
    });
}

function showAchievementUnlockToast(badgeName) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.style.borderColor = 'var(--correct-color)';
    toast.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--correct-color)" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span>Achievement Unlocked: <strong>${badgeName}</strong>!</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 50);

    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}