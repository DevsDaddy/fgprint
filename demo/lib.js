"use strict";
var fgprint = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    AudioFingerprint: () => AudioFingerprint,
    CSSFeaturesFingerprint: () => CSSFeaturesFingerprint,
    CanvasFingerprint: () => CanvasFingerprint,
    Fingerprint: () => Fingerprint,
    FingerprintComponent: () => FingerprintComponent,
    FontsFingerprint: () => FontsFingerprint,
    GamepadFingerprint: () => GamepadFingerprint,
    HashUtil: () => HashUtil,
    Helpers: () => Helpers,
    MathPrecisionFingerprint: () => MathPrecisionFingerprint,
    MediaDevicesFingerprint: () => MediaDevicesFingerprint,
    MiscFingerprint: () => MiscFingerprint,
    NavigatorFingerprint: () => NavigatorFingerprint,
    NetworkFingerprint: () => NetworkFingerprint,
    PerformanceFingerprint: () => PerformanceFingerprint,
    PluginsFingerprint: () => PluginsFingerprint,
    SHA512: () => SHA512,
    ScreenFingerprint: () => ScreenFingerprint,
    SensorFingerprint: () => SensorFingerprint,
    SpeechSynthesisFingerprint: () => SpeechSynthesisFingerprint,
    TimezoneFingerprint: () => TimezoneFingerprint,
    VirtualKeyboardFingerprint: () => VirtualKeyboardFingerprint,
    WebCodecsFingerprint: () => WebCodecsFingerprint,
    WebGLFingerprint: () => WebGLFingerprint,
    WebGPUFingerprint: () => WebGPUFingerprint
  });

  // src/utils/hash.ts
  var HashUtil = class {
    /**
     * Hash sync
     * @param input {string} Input string
     * @returns {string} Hash HEX string
     */
    static hashSync(input) {
      return SHA512.hash(input, false);
    }
    /**
     * Hash Async
     * @param input {string} Input string
     * @returns {string} Hash HEX string
     */
    static async hashAsync(input) {
      return SHA512.hash(input, false);
    }
  };
  var SHA512 = class {
    /**
     * Bitint right rotate
     * @param value {number} Value
     * @param amount {number} Rotate amount
     * @private
     */
    static rightRotate(value, amount) {
      return value >> BigInt(amount) | value << 64n - BigInt(amount);
    }
    /**
     * Get SHA512 Hash
     * @param data {string|Uint8Array} Raw string or bytes array
     * @param returnBytes {boolean} Returns HEX String or Uint8Array
     * @returns {string|Uint8Array} HEX String or Uint8Array
     */
    static hash(data, returnBytes = false) {
      const msgBytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
      let h0 = 0x6a09e667f3bcc908n;
      let h1 = 0xbb67ae8584caa73bn;
      let h2 = 0x3c6ef372fe94f82bn;
      let h3 = 0xa54ff53a5f1d36f1n;
      let h4 = 0x510e527fade682d1n;
      let h5 = 0x9b05688c2b3e6c1fn;
      let h6 = 0x1f83d9abfb41bd6bn;
      let h7 = 0x5be0cd19137e2179n;
      const ml = BigInt(msgBytes.length * 8);
      const padded = new Uint8Array((Number(ml) + 128 + 1023 & ~1023) / 8);
      padded.set(msgBytes);
      padded[msgBytes.length] = 128;
      const dv = new DataView(padded.buffer);
      dv.setBigUint64(padded.length - 8, ml, false);
      for (let i = 0; i < padded.length; i += 128) {
        const w = new Array(80).fill(0n);
        for (let j = 0; j < 16; j++) {
          w[j] = dv.getBigUint64(i + j * 8, false);
        }
        for (let j = 16; j < 80; j++) {
          const s0 = this.rightRotate(w[j - 15], 1) ^ this.rightRotate(w[j - 15], 8) ^ w[j - 15] >> 7n;
          const s1 = this.rightRotate(w[j - 2], 19) ^ this.rightRotate(w[j - 2], 61) ^ w[j - 2] >> 6n;
          w[j] = w[j - 16] + s0 + w[j - 7] + s1 & 0xffffffffffffffffn;
        }
        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;
        let f = h5;
        let g = h6;
        let h = h7;
        for (let j = 0; j < 80; j++) {
          const S1 = this.rightRotate(e, 14) ^ this.rightRotate(e, 18) ^ this.rightRotate(e, 41);
          const ch = e & f ^ ~e & g;
          const temp1 = h + S1 + ch + this.K[j] + w[j] & 0xffffffffffffffffn;
          const S0 = this.rightRotate(a, 28) ^ this.rightRotate(a, 34) ^ this.rightRotate(a, 39);
          const maj = a & b ^ a & c ^ b & c;
          const temp2 = S0 + maj & 0xffffffffffffffffn;
          h = g;
          g = f;
          f = e;
          e = d + temp1 & 0xffffffffffffffffn;
          d = c;
          c = b;
          b = a;
          a = temp1 + temp2 & 0xffffffffffffffffn;
        }
        h0 = h0 + a & 0xffffffffffffffffn;
        h1 = h1 + b & 0xffffffffffffffffn;
        h2 = h2 + c & 0xffffffffffffffffn;
        h3 = h3 + d & 0xffffffffffffffffn;
        h4 = h4 + e & 0xffffffffffffffffn;
        h5 = h5 + f & 0xffffffffffffffffn;
        h6 = h6 + g & 0xffffffffffffffffn;
        h7 = h7 + h & 0xffffffffffffffffn;
      }
      const result = new Uint8Array(64);
      const resultView = new DataView(result.buffer);
      resultView.setBigUint64(0, h0, false);
      resultView.setBigUint64(8, h1, false);
      resultView.setBigUint64(16, h2, false);
      resultView.setBigUint64(24, h3, false);
      resultView.setBigUint64(32, h4, false);
      resultView.setBigUint64(40, h5, false);
      resultView.setBigUint64(48, h6, false);
      resultView.setBigUint64(56, h7, false);
      return returnBytes ? result : Array.from(result).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  };
  // Constants
  SHA512.K = [
    0x428a2f98d728ae22n,
    0x7137449123ef65cdn,
    0xb5c0fbcfec4d3b2fn,
    0xe9b5dba58189dbbcn,
    0x3956c25bf348b538n,
    0x59f111f1b605d019n,
    0x923f82a4af194f9bn,
    0xab1c5ed5da6d8118n,
    0xd807aa98a3030242n,
    0x12835b0145706fben,
    0x243185be4ee4b28cn,
    0x550c7dc3d5ffb4e2n,
    0x72be5d74f27b896fn,
    0x80deb1fe3b1696b1n,
    0x9bdc06a725c71235n,
    0xc19bf174cf692694n,
    0xe49b69c19ef14ad2n,
    0xefbe4786384f25e3n,
    0x0fc19dc68b8cd5b5n,
    0x240ca1cc77ac9c65n,
    0x2de92c6f592b0275n,
    0x4a7484aa6ea6e483n,
    0x5cb0a9dcbd41fbd4n,
    0x76f988da831153b5n,
    0x983e5152ee66dfabn,
    0xa831c66d2db43210n,
    0xb00327c898fb213fn,
    0xbf597fc7beef0ee4n,
    0xc6e00bf33da88fc2n,
    0xd5a79147930aa725n,
    0x06ca6351e003826fn,
    0x142929670a0e6e70n,
    0x27b70a8546d22ffcn,
    0x2e1b21385c26c926n,
    0x4d2c6dfc5ac42aedn,
    0x53380d139d95b3dfn,
    0x650a73548baf63den,
    0x766a0abb3c77b2a8n,
    0x81c2c92e47edaee6n,
    0x92722c851482353bn,
    0xa2bfe8a14cf10364n,
    0xa81a664bbc423001n,
    0xc24b8b70d0f89791n,
    0xc76c51a30654be30n,
    0xd192e819d6ef5218n,
    0xd69906245565a910n,
    0xf40e35855771202an,
    0x106aa07032bbd1b8n,
    0x19a4c116b8d2d0c8n,
    0x1e376c085141ab53n,
    0x2748774cdf8eeb99n,
    0x34b0bcb5e19b48a8n,
    0x391c0cb3c5c95a63n,
    0x4ed8aa4ae3418acbn,
    0x5b9cca4f7763e373n,
    0x682e6ff3d6b2b8a3n,
    0x748f82ee5defb2fcn,
    0x78a5636f43172f60n,
    0x84c87814a1f0ab72n,
    0x8cc702081a6439ecn,
    0x90befffa23631e28n,
    0xa4506cebde82bde9n,
    0xbef9a3f7b2c67915n,
    0xc67178f2e372532bn,
    0xca273eceea26619cn,
    0xd186b8c721c0c207n,
    0xeada7dd6cde0eb1en,
    0xf57d4f7fee6ed178n,
    0x06f067aa72176fban,
    0x0a637dc5a2c898a6n,
    0x113f9804bef90daen,
    0x1b710b35131c471bn,
    0x28db77f523047d84n,
    0x32caab7b40c72493n,
    0x3c9ebe0a15c9bebcn,
    0x431d67c49c100d4cn,
    0x4cc5d4becb3e42b6n,
    0x597f299cfc657e2an,
    0x5fcb6fab3ad6faecn,
    0x6c44198c4a475817n
  ];

  // src/utils/helpers.ts
  var Helpers = class {
    /**
     * Get Safe
     * @param fn {Function} Function
     * @param fallback {any} Fallback
     */
    static getSafe(fn, fallback = "") {
      try {
        return fn();
      } catch {
        return fallback;
      }
    }
    /**
     * Round for stable screen
     * @param value {number} Initial value
     * @returns {number} Rounded safe screen
     */
    static stableScreen(value) {
      return Math.floor(value / 10) * 10;
    }
    /**
     * Check API is supported
     * @param api {string} API name in window
     * @returns {boolean}
     */
    static isSupported(api) {
      return this.getSafe(() => api in window, false);
    }
  };

  // src/core/component.ts
  var FingerprintComponent = class {
  };

  // src/components/audio.ts
  var AudioFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "audio";
    }
    async getData() {
      if (!Helpers.isSupported("AudioContext") && !Helpers.isSupported("webkitAudioContext")) return "";
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const analyser = ctx.createAnalyser();
        const gain = ctx.createGain();
        const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);
        oscillator.type = "triangle";
        oscillator.frequency.value = 1e3;
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
            resolve("");
          }, 500);
          scriptProcessor.onaudioprocess = (event) => {
            clearTimeout(timeout);
            const output = event.inputBuffer.getChannelData(0);
            const hashInput = Array.from(output.slice(0, 100)).map((v) => v.toFixed(6)).join(",");
            oscillator.disconnect();
            ctx.close();
            resolve(hashInput);
          };
          oscillator.start(0);
        });
      } catch {
        return "";
      }
    }
  };

  // src/components/canvas.ts
  var CanvasFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "canvas";
    }
    getData() {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 240;
        canvas.height = 60;
        const ctx = canvas.getContext("2d");
        if (!ctx) return "";
        ctx.textBaseline = "top";
        ctx.font = '14px "Arial"';
        ctx.fillStyle = "#f60";
        ctx.fillRect(10, 5, 50, 20);
        ctx.fillStyle = "#069";
        ctx.font = 'italic 16px "Times New Roman"';
        ctx.fillText("Fingerprint \u{1F464}", 2, 15);
        ctx.font = 'bold 12px "Courier New"';
        ctx.fillStyle = "#0a0";
        ctx.fillText("Canvas", 100, 30);
        ctx.beginPath();
        ctx.arc(160, 20, 10, 0, 2 * Math.PI);
        const gradient = ctx.createLinearGradient(0, 0, 240, 60);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1, "red");
        ctx.fillStyle = gradient;
        ctx.fill();
        return canvas.toDataURL();
      } catch {
        return "";
      }
    }
  };

  // src/components/fonts.ts
  var FontsFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "fonts";
    }
    getData() {
      const baseFonts = ["monospace", "sans-serif", "serif"];
      const testString = "abcdefghijklmnopqrstuvwxyz\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F";
      const testSize = "72px";
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return {};
      const getWidth = (font) => {
        ctx.font = `${testSize} "${font}"`;
        return ctx.measureText(testString).width;
      };
      const baseWidths = baseFonts.reduce((acc, font) => {
        acc[font] = getWidth(font);
        return acc;
      }, {});
      const fontsToCheck = [
        "Arial",
        "Verdana",
        "Times New Roman",
        "Courier New",
        "Helvetica",
        "Comic Sans MS",
        "Georgia",
        "Impact",
        "Trebuchet MS",
        "Lucida Console",
        "Palatino Linotype",
        "Tahoma",
        "MS Sans Serif",
        "MS Serif",
        "Symbol",
        "Webdings",
        "Wingdings",
        "Arial Black",
        "Calibri",
        "Cambria",
        "Candara",
        "Consolas",
        "Constantia",
        "Corbel",
        "Franklin Gothic Medium",
        "Segoe UI"
      ];
      const availableFonts = fontsToCheck.filter((font) => {
        for (const base of baseFonts) {
          ctx.font = `${testSize} "${font}", ${base}`;
          if (ctx.measureText(testString).width !== baseWidths[base]) {
            return true;
          }
        }
        return false;
      });
      return {
        baseWidths,
        availableFonts: availableFonts.join(",")
      };
    }
  };

  // src/components/navigator.ts
  var NavigatorFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "navigator";
    }
    getData() {
      const nav = navigator;
      return {
        userAgent: nav.userAgent,
        platform: nav.platform,
        language: nav.language,
        languages: [...nav.languages || []].join(","),
        cookieEnabled: nav.cookieEnabled,
        doNotTrack: nav.doNotTrack || "unspecified",
        hardwareConcurrency: nav.hardwareConcurrency || "unknown",
        deviceMemory: nav.deviceMemory || "unknown",
        productSub: nav.productSub || "",
        vendor: nav.vendor || "",
        vendorSub: nav.vendorSub || "",
        webdriver: nav.webdriver || false,
        maxTouchPoints: nav.maxTouchPoints || 0,
        pdfViewerEnabled: Helpers.getSafe(() => nav.pdfViewerEnabled, false)
      };
    }
  };

  // src/components/plugins.ts
  var PluginsFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "plugins";
    }
    getData() {
      return {
        plugins: Array.from(navigator.plugins || []).map((p) => `${p.name}::${p.filename}`).join("|"),
        mimeTypes: Array.from(navigator.mimeTypes || []).map((m) => m.type).join("|")
      };
    }
  };

  // src/components/screen.ts
  var ScreenFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "screen";
    }
    getData() {
      const s = screen;
      return {
        width: Helpers.stableScreen(s.width),
        height: Helpers.stableScreen(s.height),
        availWidth: Helpers.stableScreen(s.availWidth),
        availHeight: Helpers.stableScreen(s.availHeight),
        colorDepth: s.colorDepth,
        pixelDepth: s.pixelDepth,
        availLeft: Helpers.stableScreen(s?.availLeft || 0),
        availTop: Helpers.stableScreen(s?.availTop || 0),
        orientation: Helpers.getSafe(() => s.orientation?.type, "")
      };
    }
  };

  // src/components/timezone.ts
  var TimezoneFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "timezone";
    }
    getData() {
      return {
        timezoneOffset: (/* @__PURE__ */ new Date()).getTimezoneOffset(),
        timezone: Helpers.getSafe(() => Intl.DateTimeFormat().resolvedOptions().timeZone, "")
      };
    }
  };

  // src/components/webgl.ts
  var WebGLFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "webgl";
    }
    getData() {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return {};
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        return {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER),
          unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "",
          unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "",
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
          extensions: gl.getSupportedExtensions()?.join(",") || "",
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
          maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS).join("x")
        };
      } catch {
        return {};
      }
    }
  };

  // src/components/misc.ts
  var MiscFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "misc";
    }
    getData() {
      return {
        touchSupport: "ontouchstart" in window,
        pointerSupport: !!window.PointerEvent,
        passiveSupported: (() => {
          let supports = false;
          try {
            const opts = Object.defineProperty({}, "passive", {
              get: () => supports = true
            });
            window.addEventListener("test", () => {
            }, opts);
          } catch {
          }
          return supports;
        })(),
        colorGamut: Helpers.getSafe(() => matchMedia("(color-gamut: p3)").matches ? "p3" : "srgb", "srgb"),
        reducedMotion: Helpers.getSafe(() => matchMedia("(prefers-reduced-motion: reduce)").matches, false),
        darkMode: Helpers.getSafe(() => matchMedia("(prefers-color-scheme: dark)").matches, false)
      };
    }
  };

  // src/components/performance.ts
  var PerformanceFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "performance";
    }
    getData() {
      return {
        jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit ?? null,
        totalJSHeapSize: performance.memory?.totalJSHeapSize ?? null,
        usedJSHeapSize: performance.memory?.usedJSHeapSize ?? null,
        mathLoopSpeed: this.measureMathSpeed()
      };
    }
    measureMathSpeed() {
      const start = performance.now();
      for (let i = 0; i < 1e5; i++) {
        Math.sqrt(Math.random());
      }
      return performance.now() - start;
    }
  };

  // src/components/webgpu.ts
  var WebGPUFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "webgpu";
    }
    /**
     * WebGPU Version
     */
    async getData() {
      if (!("gpu" in navigator)) return { supported: false };
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) return { supported: true, adapter: null };
        const info = await adapter.requestAdapterInfo();
        return {
          supported: true,
          vendor: info.vendor,
          architecture: info.architecture,
          device: info.device,
          description: info.description,
          limits: {
            maxTextureDimension2D: adapter.limits.maxTextureDimension2D,
            maxBufferSize: adapter.limits.maxBufferSize,
            maxComputeWorkgroupSizeX: adapter.limits.maxComputeWorkgroupSizeX
          },
          features: Array.from(adapter.features).sort()
        };
      } catch {
        return { supported: true, error: "Unable to retrieve WebGPU info" };
      }
    }
  };

  // src/components/network.ts
  var NetworkFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "network";
    }
    getData() {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!conn) return { supported: false };
      return {
        supported: true,
        effectiveType: conn.effectiveType,
        rtt: conn.rtt,
        downlink: conn.downlink,
        saveData: conn.saveData,
        type: conn.type
      };
    }
  };

  // src/components/math.ts
  var MathPrecisionFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "mathPrecision";
    }
    getData() {
      return {
        tanMinus1e16: Math.tan(-1e16),
        cos1e20: Math.cos(1e20),
        sin1e30: Math.sin(1e30),
        atan2Zero: Math.atan2(0, -0),
        powSpecial: Math.pow(0.9999999999999999, 1e20)
      };
    }
  };

  // src/components/speechsynth.ts
  var SpeechSynthesisFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "speechSynthesis";
    }
    getData() {
      if (!("speechSynthesis" in window)) return { supported: false };
      const voices = window.speechSynthesis.getVoices();
      return {
        supported: true,
        count: voices.length,
        voices: voices.map((v) => `${v.name} (${v.lang}) ${v.default ? "[default]" : ""}`).join("|")
      };
    }
  };

  // src/components/css.ts
  var CSSFeaturesFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "cssFeatures";
    }
    getData() {
      const properties = [
        "display",
        "grid",
        "flex",
        "subgrid",
        "gap",
        "container-type",
        "container",
        "container-query",
        "color",
        "lab()",
        "lch()",
        "oklab()",
        "color-mix",
        "accent-color",
        "color-scheme",
        "backdrop-filter",
        "animation-timeline",
        "view-timeline",
        "scroll-timeline",
        "offset-path",
        "offset-distance",
        "offset-rotate",
        "font-palette",
        "font-variant-alternates",
        "size-adjust"
      ];
      const supportMap = {};
      properties.forEach((prop) => {
        supportMap[prop] = CSS?.supports(prop, "initial") ?? null;
      });
      return supportMap;
    }
  };

  // src/components/gamepad.ts
  var GamepadFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "gamepad";
    }
    getData() {
      if (!("getGamepads" in navigator)) return { supported: false };
      const gamepads = navigator.getGamepads();
      const info = [];
      for (const gp of gamepads) {
        if (gp) info.push(`${gp.id}::${gp.mapping}`);
      }
      return {
        supported: true,
        count: info.length,
        list: info.join("|")
      };
    }
  };

  // src/components/vkey.ts
  var VirtualKeyboardFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "virtualKeyboard";
    }
    getData() {
      const vk = navigator.virtualKeyboard;
      if (!vk) return { supported: false };
      return {
        supported: true,
        overlaysContent: vk.overlaysContent,
        boundingRect: vk.boundingRect ? {
          width: vk.boundingRect.width,
          height: vk.boundingRect.height,
          x: vk.boundingRect.x,
          y: vk.boundingRect.y
        } : null
      };
    }
  };

  // src/components/webcodecs.ts
  var WebCodecsFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "webCodecs";
    }
    async getData() {
      if (!("VideoDecoder" in window)) return { supported: false };
      try {
        const configs = [
          { codec: "avc1.42001E", hardwareAcceleration: "prefer-hardware" },
          { codec: "avc1.640028", hardwareAcceleration: "prefer-hardware" },
          { codec: "vp8", hardwareAcceleration: "prefer-hardware" },
          { codec: "vp09.00.10.08", hardwareAcceleration: "prefer-hardware" },
          { codec: "av01.0.04M.08", hardwareAcceleration: "prefer-hardware" },
          { codec: "hvc1.1.6.L93.90", hardwareAcceleration: "prefer-hardware" }
        ];
        const support = await Promise.all(configs.map(async (cfg) => {
          try {
            const support2 = await VideoDecoder.isConfigSupported(cfg);
            return { codec: cfg.codec, supported: support2.supported, config: support2.config };
          } catch {
            return { codec: cfg.codec, supported: false };
          }
        }));
        return {
          supported: true,
          videoDecoder: support
        };
      } catch {
        return { supported: false };
      }
    }
  };

  // src/components/sensor.ts
  var SensorFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "sensors";
    }
    getData() {
      const sensors = [
        "Accelerometer",
        "Gyroscope",
        "Magnetometer",
        "AmbientLightSensor",
        "ProximitySensor",
        "AbsoluteOrientationSensor",
        "RelativeOrientationSensor"
      ];
      const result = {};
      sensors.forEach((sensor) => {
        result[sensor] = sensor in window;
      });
      if ("Accelerometer" in window) {
        try {
          const acc = new Accelerometer();
          result["accelerometerPrecision"] = acc.constructor?.frequencyHint || "unknown";
        } catch {
        }
      }
      return result;
    }
  };

  // src/core/fingerprint.ts
  var DEFAULT_TIMEOUT = 2e3;
  var Fingerprint = class _Fingerprint {
    /**
     * Create fingerprint class
     * @param options
     */
    constructor(options = {}) {
      // Fingerprint fields
      this.components = /* @__PURE__ */ new Map();
      this.cache = /* @__PURE__ */ new Map();
      this.options = {
        exclude: options.exclude || [],
        asyncHash: options.asyncHash ?? false,
        timeout: options.timeout ?? DEFAULT_TIMEOUT,
        debug: options.debug ?? false,
        customHash: options.customHash ?? ((data) => HashUtil.hashSync(data))
      };
      if (options.components) {
        for (const comp of options.components) {
          this.components.set(comp.name, comp);
        }
      }
    }
    /**
     * Get component as type by name
     * @param name {string} component name
     */
    getComponent(name) {
      return this.components.get(name);
    }
    /**
     * Get All Components
     */
    getAllComponents() {
      return Array.from(this.components.values());
    }
    /**
     * Get Component Data Typed
     * @param name {string} component name
     */
    async getComponentDataTyped(name) {
      if (this.components.has(name)) {
        return await this.getComponentData(name);
      }
      return void 0;
    }
    /**
     * Register component
     * @param component {FingerprintComponent} Fingerprint Component
     */
    registerComponent(component) {
      this.components.set(component.name, component);
    }
    /**
     * Clear fingerprint cache
     */
    clearCache() {
      this.cache.clear();
    }
    /**
     * Get component data
     * @param name {string} Name of component
     * @returns {Promise<any>} Component data
     */
    async getComponentData(name) {
      if (this.cache.has(name)) return this.cache.get(name);
      const component = this.components.get(name);
      if (!component) throw new Error(`Component "${name}" not registered`);
      let data = component.getData();
      if (data instanceof Promise) {
        data = await this.withTimeout(data, this.options.timeout);
      }
      this.cache.set(name, data);
      return data;
    }
    /**
     * Get all components data
     * @returns {Promise<Record<string, any>>} Returns all components data
     */
    async getAllData() {
      const activeComponents = Array.from(this.components.keys()).filter((name) => !this.options.exclude.includes(name));
      const result = {};
      await Promise.all(
        activeComponents.map(async (name) => {
          result[name] = await this.getComponentData(name);
        })
      );
      return result;
    }
    /**
     * Get fingerprint async
     * @returns {Promise<string>} Fingerprint HEX string
     */
    async getFingerprint() {
      const data = await this.getAllData();
      const serialized = JSON.stringify(data);
      if (this.options.debug) return serialized;
      const hash = await this.options.customHash(serialized);
      if (typeof hash === "string") return hash;
      return this.options.asyncHash ? await HashUtil.hashAsync(serialized) : HashUtil.hashSync(serialized);
    }
    /**
     * Create Basic Fingerprint
     */
    static createBasic() {
      return new _Fingerprint({
        components: [
          new AudioFingerprint(),
          new CanvasFingerprint(),
          new FontsFingerprint(),
          new NavigatorFingerprint(),
          new PluginsFingerprint(),
          new ScreenFingerprint(),
          new WebGPUFingerprint()
        ]
      });
    }
    /**
     * Create Default Fingerprint
     */
    static createDefault() {
      return new _Fingerprint({
        components: [
          new AudioFingerprint(),
          new CanvasFingerprint(),
          new FontsFingerprint(),
          new NavigatorFingerprint(),
          new PluginsFingerprint(),
          new ScreenFingerprint(),
          new TimezoneFingerprint(),
          new WebGLFingerprint(),
          new MiscFingerprint(),
          new WebGPUFingerprint(),
          new MathPrecisionFingerprint(),
          new CSSFeaturesFingerprint(),
          new WebCodecsFingerprint()
        ]
      });
    }
    /**
     * Create Full Fingerprint
     */
    static createFull() {
      return new _Fingerprint({
        components: [
          new AudioFingerprint(),
          new CanvasFingerprint(),
          new FontsFingerprint(),
          new NavigatorFingerprint(),
          new PluginsFingerprint(),
          new ScreenFingerprint(),
          new TimezoneFingerprint(),
          new WebGLFingerprint(),
          new MiscFingerprint(),
          new PerformanceFingerprint(),
          new WebGPUFingerprint(),
          new NetworkFingerprint(),
          new MathPrecisionFingerprint(),
          new SpeechSynthesisFingerprint(),
          new CSSFeaturesFingerprint(),
          new GamepadFingerprint(),
          new VirtualKeyboardFingerprint(),
          new WebCodecsFingerprint(),
          new SensorFingerprint()
        ]
      });
    }
    /**
     * Get fingerprint sync
     * @returns {string} Fingerprint HEX string
     */
    getFingerprintSync() {
      const syncComponents = Array.from(this.components.entries()).filter(([name, comp]) => {
        if (this.options.exclude.includes(name)) return false;
        const data2 = comp.getData();
        return !(data2 instanceof Promise);
      }).map(([name]) => name);
      const data = {};
      for (const name of syncComponents) {
        data[name] = this.getComponentDataSync(name);
      }
      const serialized = JSON.stringify(data);
      if (this.options.debug) return serialized;
      return HashUtil.hashSync(serialized);
    }
    getComponentDataSync(name) {
      if (this.cache.has(name)) return this.cache.get(name);
      const component = this.components.get(name);
      if (!component) throw new Error(`Component "${name}" not registered`);
      const data = component.getData();
      if (data instanceof Promise) {
        throw new Error(`Component "${name}" is async and cannot be used synchronously`);
      }
      this.cache.set(name, data);
      return data;
    }
    withTimeout(promise, ms) {
      return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(null), ms);
        promise.then(
          (val) => {
            clearTimeout(timer);
            resolve(val);
          },
          () => {
            clearTimeout(timer);
            resolve(null);
          }
        );
      });
    }
  };

  // src/components/mediadevices.ts
  var MediaDevicesFingerprint = class extends FingerprintComponent {
    constructor() {
      super(...arguments);
      this.name = "mediaDevices";
    }
    async getData() {
      if (!navigator.mediaDevices?.enumerateDevices) return {};
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return {
          audioInputs: devices.filter((d) => d.kind === "audioinput").map((d) => d.label).join("|"),
          audioOutputs: devices.filter((d) => d.kind === "audiooutput").map((d) => d.label).join("|"),
          videoInputs: devices.filter((d) => d.kind === "videoinput").map((d) => d.label).join("|"),
          deviceIds: devices.map((d) => d.deviceId).join("|")
        };
      } catch {
        return {};
      }
    }
  };
  return __toCommonJS(index_exports);
})();
