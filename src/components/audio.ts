/**
 * FGPrint Component: Audio
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";
import {Helpers} from "../utils/helpers";

/**
 * Audio Fingerprint
 */
export class AudioFingerprint extends FingerprintComponent<string> {
    name = 'audio';

    public override async getData(): Promise<string> {
        if (!Helpers.isSupported('AudioContext') && !Helpers.isSupported('webkitAudioContext')) return '';

        try {
            const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioCtx();
            const oscillator = ctx.createOscillator();
            const analyser = ctx.createAnalyser();
            const gain = ctx.createGain();
            const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);

            oscillator.type = 'triangle';
            oscillator.frequency.value = 1000;
            analyser.fftSize = 256;
            gain.gain.value = 0;

            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gain);
            gain.connect(ctx.destination);

            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    oscillator.disconnect();
                    ctx.close();
                    resolve('');
                }, 500);

                scriptProcessor.onaudioprocess = (event: any) => {
                    clearTimeout(timeout);
                    const output = event.inputBuffer.getChannelData(0);
                    const hashInput = Array.from(output.slice(0, 100))
                        // @ts-ignore
                        .map(v => v.toFixed(6))
                        .join(',');
                    oscillator.disconnect();
                    ctx.close();
                    resolve(hashInput);
                };

                oscillator.start(0);
            });
        } catch {
            return '';
        }
    }
}