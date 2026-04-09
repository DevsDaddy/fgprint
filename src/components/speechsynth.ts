/**
 * FGPrint Component: Speech Synthesis
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
import {FingerprintComponent} from "../core/component";

/**
 * Speech Synthesis Fingerprint
 */
export class SpeechSynthesisFingerprint extends FingerprintComponent {
    name = 'speechSynthesis';

    public override getData() {
        if (!('speechSynthesis' in window)) return { supported: false };

        const voices = window.speechSynthesis.getVoices();
        return {
            supported: true,
            count: voices.length,
            voices: voices.map(v => `${v.name} (${v.lang}) ${v.default ? '[default]' : ''}`).join('|'),
        };
    }
}