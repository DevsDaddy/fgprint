/**
 * FGPrint components tests
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import { describe, it, expect } from 'vitest';
import {
    NavigatorFingerprint,
    ScreenFingerprint,
    CanvasFingerprint,
    WebGLFingerprint,
    FontsFingerprint
} from '../src/';

describe('Component tests', () => {
    it('NavigatorFingerprinter returns expected structure', () => {
        const comp = new NavigatorFingerprint();
        const data = comp.getData();
        expect(data).toHaveProperty('userAgent');
        expect(data).toHaveProperty('platform');
        expect(data).toHaveProperty('language');
    });

    it('ScreenFingerprinter returns stable screen dimensions', () => {
        const comp = new ScreenFingerprint();
        const data = comp.getData();
        expect(data.width).toBe(Math.floor(screen.width / 10) * 10);
        expect(data.height).toBe(Math.floor(screen.height / 10) * 10);
    });

    it('CanvasFingerprinter returns a string', () => {
        const comp = new CanvasFingerprint();
        const data = comp.getData();
        expect(typeof data).toBe('string');
    });

    it('WebGLFingerprinter returns object with renderer info', () => {
        const comp = new WebGLFingerprint();
        const data = comp.getData();
        expect(data).toBeDefined();
    });

    it('FontsFingerprinter returns available fonts list', () => {
        const comp = new FontsFingerprint();
        const data = comp.getData();

        expect(data).toHaveProperty('availableFonts');
        expect(typeof data.availableFonts).toBe('string');
    });
});