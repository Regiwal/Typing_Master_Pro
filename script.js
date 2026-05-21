 const sampleQuotes = [
            "The art of programming is the art of organizing complexity, of mastering multitude and avoiding its millions of monstrous bugs.",
            "Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make things worse: complexity sells better.",
            "Modern UI design isn't just about beautiful color palettes; it is fundamentally about removing unnecessary friction between the user and the system.",
            "Asynchronous systems allow workflows to operate efficiently, making applications fast and responsive even under a heavy load of structural tasks.",
            "Clean code always looks like it was written by someone who cares. There is nothing obvious you can do to make it any better than it already is."
        ];

        const wordsContainer = document.getElementById('words-container');
        const hiddenInput = document.getElementById('hidden-input');
        const typingCard = document.getElementById('typing-card');
        const timerDisplay = document.getElementById('timer');
        const wpmDisplay = document.getElementById('wpm');
        const accuracyDisplay = document.getElementById('accuracy');
        const restartBtn = document.getElementById('btn-restart');

        let testTime = 30;
        let timeLeft = testTime;
        let timerInterval = null;
        let isTestRunning = false;
        let characterSpans = [];
        let totalTyped = 0;
        let correctTyped = 0;

        // Initialize Application
        function initTest() {
            clearInterval(timerInterval);
            timeLeft = testTime;
            isTestRunning = false;
            totalTyped = 0;
            correctTyped = 0;

            timerDisplay.textContent = timeLeft;
            wpmDisplay.textContent = '0';
            accuracyDisplay.textContent = '100';
            hiddenInput.value = '';

            // Fetch random quote and construct individual character spans
            const randomQuote = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
            wordsContainer.innerHTML = '';

            characterSpans = randomQuote.split('').map(char => {
                const span = document.createElement('span');
                span.classList.add('char');
                span.innerText = char;
                wordsContainer.appendChild(span);
                return span;
            });

            if (characterSpans.length > 0) {
                characterSpans[0].classList.add('current');
            }

            hiddenInput.focus();
            typingCard.classList.add('focused');
        }

        // Timer Execution
        function startTimer() {
            isTestRunning = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;

                calculateMetrics();

                if (timeLeft <= 0) {
                    endTest();
                }
            }, 1000);
        }

        function endTest() {
            clearInterval(timerInterval);
            hiddenInput.disabled = true;
            typingCard.classList.remove('focused');
            // Final metrics check
            calculateMetrics();
        }

        // Formulaic Processing for Performance Tracking
        function calculateMetrics() {
            if (totalTyped === 0) return;

            // Standard WPM definition uses 5 typed characters as 1 word
            const timeElapsedInMinutes = (testTime - timeLeft) / 60;
            if (timeElapsedInMinutes > 0) {
                const wpm = Math.round((correctTyped / 5) / timeElapsedInMinutes);
                wpmDisplay.textContent = Math.max(0, wpm);
            }

            const accuracy = Math.round((correctTyped / totalTyped) * 100);
            accuracyDisplay.textContent = isNaN(accuracy) ? 100 : accuracy;
        }

        // Input Management Logic
        hiddenInput.addEventListener('input', (e) => {
            if (!isTestRunning && timeLeft > 0) {
                startTimer();
            }

            const inputValue = hiddenInput.value;
            const inputLength = inputValue.length;
            totalTyped = inputLength;

            // Handle backspacing or current tracking
            characterSpans.forEach((span, index) => {
                span.classList.remove('current', 'correct', 'incorrect');

                if (index < inputLength) {
                    if (inputValue[index] === span.innerText) {
                        span.classList.add('correct');
                    } else {
                        span.classList.add('incorrect');
                    }
                }
            });

            // Re-evaluate total correct items
            correctTyped = wordsContainer.querySelectorAll('.char.correct').length;

            // Highlight the exact active index cursor location
            if (inputLength < characterSpans.length) {
                characterSpans[inputLength].classList.add('current');
            } else {
                endTest(); // Finished early
            }

            calculateMetrics();
        });

        // App Focus / Blur management for cleaner UI interaction
        typingCard.addEventListener('click', () => {
            if (timeLeft > 0) hiddenInput.focus();
        });
        hiddenInput.addEventListener('focus', () => typingCard.classList.add('focused'));
        hiddenInput.addEventListener('blur', () => typingCard.classList.remove('focused'));

        // Listen globally to let users start typing instantly
        window.addEventListener('keydown', (e) => {
            if (document.activeElement !== hiddenInput && timeLeft > 0 && e.key.length === 1) {
                hiddenInput.focus();
            }
        });

        restartBtn.addEventListener('click', () => {
            hiddenInput.disabled = false;
            initTest();
        });

        // Fire on Load
        initTest();