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
    HashUtil: () => HashUtil,
    Helpers: () => Helpers,
    MathPrecisionFingerprint: () => MathPrecisionFingerprint,
    MediaDevicesFingerprint: () => MediaDevicesFingerprint,
    MiscFingerprint: () => MiscFingerprint,
    NavigatorFingerprint: () => NavigatorFingerprint,
    NetworkFingerprint: () => NetworkFingerprint,
    PerformanceFingerprint: () => PerformanceFingerprint,
    PluginsFingerprint: () => PluginsFingerprint,
    ScreenFingerprint: () => ScreenFingerprint,
    SpeechSynthesisFingerprint: () => SpeechSynthesisFingerprint,
    TimezoneFingerprint: () => TimezoneFingerprint,
    WebGLFingerprint: () => WebGLFingerprint,
    WebGPUFingerprint: () => WebGPUFingerprint
  });

  // src/utils/hash.ts
  var HashUtil = class {
    /**
     * Fast non-crypto string hash (cyrb53)
     * @param str {string} String to hash
     * @param seed {number} Seed
     * @returns {number} Cyrb53 hash
     */
    static cyrb53(str, seed = 0) {
      let h1 = 3735928559 ^ seed;
      let h2 = 1103547991 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
      h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }
    /**
     * Convert number to hex
     * @param num {number} Value
     * @returns {string} HEX string
     */
    static numToHex(num) {
      return (num >>> 0).toString(16).padStart(8, "0");
    }
    /**
     * Hash sync
     * @param input {string} Input string
     * @returns {string} Hash HEX string
     */
    static hashSync(input) {
      const h = this.cyrb53(input);
      return this.numToHex(h) + this.numToHex(Math.imul(h, 2654435761));
    }
    /**
     * Hash Async
     * @param input {string} Input string
     * @returns {string} Hash HEX string
     */
    static async hashAsync(input) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  };

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
        supportMap[prop] = CSS.supports(prop, "initial");
      });
      return supportMap;
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
          new CSSFeaturesFingerprint()
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
          new CSSFeaturesFingerprint()
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
