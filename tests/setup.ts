/**
 * FGPrint setup tests
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

if (!window.crypto.subtle) {
    Object.defineProperty(window.crypto, 'subtle', {
        value: {
            digest: vi.fn().mockResolvedValue(new Uint8Array(32).buffer),
        },
    });
}

class MockAudioContext {
    createOscillator() { return {
        type: '',
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        disconnect: vi.fn(),
    }; }
    createAnalyser() { return { fftSize: 0, connect: vi.fn() }; }
    createGain() { return { gain: { value: 0 }, connect: vi.fn() }; }
    createScriptProcessor() { return { connect: vi.fn(), onaudioprocess: null }; }
    close() { return Promise.resolve(); }
    destination: any;
}

window.AudioContext = MockAudioContext as any;

const mockMeasureText = vi.fn((text: string) => {
    const ctx = mockContextInstance as any;
    const font = ctx.font || '';

    // Парсим название шрифта из строки типа: '72px "Arial", monospace'
    const fontMatch = font.match(/"([^"]+)"/);
    const primaryFont = fontMatch ? fontMatch[1].toLowerCase() : '';

    // Базовые семейства
    if (font.includes('monospace')) return { width: 720 };
    if (font.includes('sans-serif')) return { width: 624 };
    if (font.includes('serif')) return { width: 649.8 };

    const widths: Record<string, number> = {
        'arial': 600,
        'verdana': 650,
        'times new roman': 670,
        'courier new': 710,
        'comic sans ms': 580,
        'georgia': 690,
        'tahoma': 620,
        'helvetica': 610,
    };

    if (primaryFont && widths[primaryFont]) {
        return { width: widths[primaryFont] };
    }

    return { width: 650 };
});

const mockContextInstance = {
    font: '',
    fillStyle: '',
    textBaseline: 'alphabetic',
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    measureText: mockMeasureText,
};

const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    contextType: string,
    ...args: any[]
) {
    if (contextType === '2d') {
        return { ...mockContextInstance };
    }
    return originalGetContext.call(this, contextType, ...args);
} as typeof originalGetContext;