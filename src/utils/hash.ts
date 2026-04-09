/**
 * FGPrint hashing utils
 *
 * @developer                   Elijah Rastorguev
 * @version                     1.0.0
 * @build                       1000
 * @git                         https://github.com/DevsDaddy/fgprint
 */
/**
 * Hash Util
 */
export class HashUtil {
    /**
     * Fast non-crypto string hash (cyrb53)
     * @param str {string} String to hash
     * @param seed {number} Seed
     * @returns {number} Cyrb53 hash
     */
    public static cyrb53(str: string, seed = 0): number {
        let h1 = 0xdeadbeef ^ seed;
        let h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    /**
     * Convert number to hex
     * @param num {number} Value
     * @returns {string} HEX string
     */
    public static numToHex(num: number): string {
        return (num >>> 0).toString(16).padStart(8, '0');
    }

    /**
     * Hash sync
     * @param input {string} Input string
     * @returns {string} Hash HEX string
     */
    public static hashSync(input: string): string {
        const h = this.cyrb53(input);
        return this.numToHex(h) + this.numToHex(Math.imul(h, 2654435761));
    }

    /**
     * Hash Async
     * @param input {string} Input string
     * @returns {string} Hash HEX string
     */
    public static async hashAsync(input: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}