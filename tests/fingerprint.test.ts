/**
 * FGPrint general tests
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {Fingerprint, HashUtil} from '../src';

describe('Fingerprinter', () => {
    let fp: Fingerprint;

    beforeEach(() => {
        fp = Fingerprint.createDefault();
    });

    it('should generate fingerprint hash', async () => {
        const hash = await fp.getFingerprint();
        expect(hash).toMatch(/^[a-f0-9]{16}$/);
    });

    it('should return same fingerprint on subsequent calls (cached)', async () => {
        const stableFp = new Fingerprint({
            components: Array.from(fp['components'].values()),
            exclude: ['audio', 'mediaDevices'],
        });
        const hash1 = await stableFp.getFingerprint();
        const hash2 = await stableFp.getFingerprint();
        expect(hash1).toBe(hash2);
    });

    it('should exclude specified components', async () => {
        const fpExclude = new Fingerprint({
            components: Array.from(fp['components'].values()),
            exclude: ['canvas', 'webgl'],
            debug: true,
        });
        const dataRaw = await fpExclude.getFingerprint();
        const data = JSON.parse(dataRaw);
        expect(data).not.toHaveProperty('canvas');
        expect(data).not.toHaveProperty('webgl');
        expect(data).toHaveProperty('navigator');
    });

    it('should generate sync fingerprint', () => {
        const syncHash = fp.getFingerprintSync();
        expect(syncHash).toMatch(/^[a-f0-9]{16}$/);
    });

    it('should use custom hash function', async () => {
        const customHash = vi.fn((data: string) => 'custom-' + HashUtil.hashSync(data));
        const fpCustom = new Fingerprint({
            components: Array.from(fp['components'].values()),
            customHash,
        });
        const result = await fpCustom.getFingerprint();
        expect(result).toMatch(/^custom-[a-f0-9]{16}$/);
        expect(customHash).toHaveBeenCalled();
    });

    it('should clear cache and regenerate fingerprint', async () => {
        const hash1 = await fp.getFingerprint();
        fp.clearCache();
        const hash2 = await fp.getFingerprint();
        expect(hash1).toBe(hash2);
    });
});