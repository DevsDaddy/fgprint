(async function() {
    const lib = window.fgprint;
    if (!lib) {
        alert('fgprint not loaded! Make sure lib.js is present.');
        return;
    }

    // Создаём экземпляр с полным набором компонентов
    const fp = lib.Fingerprint.createDefault();

    // DOM элементы
    const hashEl = document.getElementById('fingerprintHash');
    const syncHashEl = document.getElementById('syncHash');
    const componentsGrid = document.getElementById('componentsGrid');
    const refreshBtn = document.getElementById('refreshBtn');
    const copyHashBtn = document.getElementById('copyHashBtn');
    const debugCheckbox = document.getElementById('debugMode');
    const rawSection = document.getElementById('rawDataSection');
    const rawPre = document.getElementById('rawData');

    // Иконки для компонентов (просто для красоты)
    const componentIcons = {
        navigator: '🌐',
        screen: '🖥️',
        canvas: '🎨',
        webgl: '🎮',
        audio: '🎵',
        fonts: '🔤',
        mediaDevices: '📷',
        timezone: '⏰',
        plugins: '🧩',
        misc: '🔧'
    };

    // Функция для отображения данных компонента
    function renderComponentData(name, data) {
        const displayValue = typeof data === 'object'
            ? JSON.stringify(data, null, 2)
            : String(data);
        return displayValue;
    }

    // Обновление UI
    async function refreshUI() {
        hashEl.textContent = 'Calculating...';
        syncHashEl.textContent = 'Calculating...';
        componentsGrid.innerHTML = '';

        const debugMode = debugCheckbox.checked;

        const currentFp = lib.Fingerprint.createDefault();
        const fpWithOptions = new lib.Fingerprint({
            components: Array.from(currentFp.components.values()),
            debug: debugMode,
            asyncHash: false,
        });

        try {
            const allData = await fpWithOptions.getAllData();

            // Render components
            for (const [name, data] of Object.entries(allData)) {
                const card = document.createElement('div');
                card.className = 'component-card';
                const icon = componentIcons[name] || '📦';
                const displayStr = renderComponentData(name, data);
                card.innerHTML = `
          <div class="component-header">
            <span class="component-icon">${icon}</span>
            <span class="component-name">${name}</span>
          </div>
          <div class="component-data">${escapeHtml(displayStr)}</div>
        `;
                componentsGrid.appendChild(card);
            }

            // Get hashes
            const fingerprint = await fpWithOptions.getFingerprint();
            hashEl.textContent = debugMode ? '[DEBUG MODE] See raw data below' : fingerprint;
            syncHashEl.textContent = fpWithOptions.getFingerprintSync();
            if (debugMode) {
                rawSection.style.display = 'block';
                rawPre.textContent = fingerprint;
            } else {
                rawSection.style.display = 'none';
            }

        } catch (error) {
            hashEl.textContent = 'Error: ' + error.message;
            console.error(error);
        }
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add Buttons Handlers
    copyHashBtn.addEventListener('click', async () => {
        const hash = hashEl.textContent;
        if (hash && !hash.includes('Calculating') && !hash.includes('DEBUG')) {
            try {
                await navigator.clipboard.writeText(hash);
                copyHashBtn.textContent = 'Copied!';
                setTimeout(() => copyHashBtn.textContent = 'Copy Hash', 1500);
            } catch (err) {
                alert('Failed to copy');
            }
        } else {
            alert('No hash to copy');
        }
    });
    refreshBtn.addEventListener('click', () => {
        refreshUI();
    });
    debugCheckbox.addEventListener('change', () => {
        refreshUI();
    });

    // Initial loading
    await refreshUI();
    console.log('Fingerprinter Demo loaded', lib);
})();