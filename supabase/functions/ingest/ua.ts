// Lightweight, dependency-free User-Agent parser for the ingest function.
//
// Deliberately NOT using ua-parser-js: a ~90-line regex parser covers the
// device_type / browser / os breakdown the dashboard needs, with zero
// supply-chain risk and no npm resolution in the Deno runtime. It is
// intentionally coarse — good enough for "desktop vs mobile" + "Chrome 126" +
// "macOS", not for exhaustive fingerprinting.

export interface ParsedUA {
  device_type: "desktop" | "mobile" | "tablet";
  browser: string | null; // e.g. "Chrome 126"
  os: string | null; // e.g. "macOS 14"
}

function deviceType(ua: string): ParsedUA["device_type"] {
  const s = ua.toLowerCase();
  // Tablets first (an iPad UA also contains neither "mobile" nor "iphone").
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|bb10/.test(s)) return "mobile";
  return "desktop";
}

function browser(ua: string): string | null {
  // Order matters: more specific engines before generic ones.
  const tests: Array<[RegExp, string]> = [
    [/Edg(?:A|iOS)?\/(\d+)/, "Edge"],
    [/OPR\/(\d+)/, "Opera"],
    [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
    [/Firefox\/(\d+)/, "Firefox"],
    [/FxiOS\/(\d+)/, "Firefox"],
    [/CriOS\/(\d+)/, "Chrome"],
    [/Chrome\/(\d+)/, "Chrome"],
    // Safari must come after Chrome/CriOS (Chrome UA also contains "Safari").
    [/Version\/(\d+).*Safari/, "Safari"],
    [/Safari\/(\d+)/, "Safari"],
  ];
  for (const [re, name] of tests) {
    const m = ua.match(re);
    if (m) return m[1] ? `${name} ${m[1]}` : name;
  }
  return null;
}

function os(ua: string): string | null {
  let m: RegExpMatchArray | null;
  if ((m = ua.match(/Windows NT (\d+\.\d+)/))) {
    const map: Record<string, string> = { "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7" };
    return `Windows ${map[m[1]] ?? m[1]}`;
  }
  if ((m = ua.match(/Mac OS X (\d+[._]\d+)/))) return `macOS ${m[1].replace(/_/g, ".")}`;
  if (/iPhone|iPad|iPod/.test(ua)) {
    m = ua.match(/OS (\d+[._]\d+)/);
    return m ? `iOS ${m[1].replace(/_/g, ".")}` : "iOS";
  }
  if ((m = ua.match(/Android (\d+(?:\.\d+)?)/))) return `Android ${m[1]}`;
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return null;
}

export function parseUA(ua: string | null): ParsedUA {
  if (!ua) return { device_type: "desktop", browser: null, os: null };
  return { device_type: deviceType(ua), browser: browser(ua), os: os(ua) };
}
