/**
 * FGPrint component abstraction
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
/**
 * Fingerprint Component
 */
export abstract class FingerprintComponent<T = any> {
    public abstract readonly name: string;
    public abstract getData(): T | Promise<T>;
}