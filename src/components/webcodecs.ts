/**
 * FGPrint Component: Web Codecs
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Web Codecs Fingerprint
 */
export class WebCodecsFingerprint extends FingerprintComponent {
    name = 'webCodecs';

    public override async getData(): Promise<Record<string, any>> {
        if (!('VideoDecoder' in window)) return { supported: false };

        try {
            const configs = [
                { codec: 'avc1.42001E', hardwareAcceleration: 'prefer-hardware' },
                { codec: 'avc1.640028', hardwareAcceleration: 'prefer-hardware' },
                { codec: 'vp8', hardwareAcceleration: 'prefer-hardware' },
                { codec: 'vp09.00.10.08', hardwareAcceleration: 'prefer-hardware' },
                { codec: 'av01.0.04M.08', hardwareAcceleration: 'prefer-hardware' },
                { codec: 'hvc1.1.6.L93.90', hardwareAcceleration: 'prefer-hardware' },
            ];

            const support = await Promise.all(configs.map(async (cfg) => {
                try {
                    // @ts-ignore
                    const support = await VideoDecoder.isConfigSupported(cfg);
                    return { codec: cfg.codec, supported: support.supported, config: support.config };
                } catch {
                    return { codec: cfg.codec, supported: false };
                }
            }));

            return {
                supported: true,
                videoDecoder: support,
            };
        } catch {
            return { supported: false };
        }
    }
}