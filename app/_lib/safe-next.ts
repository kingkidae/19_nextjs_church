// Returns a same-site path for post-login redirects, or "/".
// Parsing with URL catches tricks like "/\evil.com" that browsers read as "//evil.com".
export function safeNext(v: unknown) {
  const s = typeof v === "string" ? v : "/";
  if (!s.startsWith("/") || /[\\\x00-\x1f]/.test(s)) return "/";
  try {
    const u = new URL(s, "http://local.invalid");
    const out = u.pathname + u.search + u.hash;
    // URL normalizes "/.//evil.com" to "//evil.com", so check the result too
    return u.origin === "http://local.invalid" && !out.startsWith("//") ? out : "/";
  } catch {
    return "/";
  }
}

// self-check: node --experimental-strip-types app/_lib/safe-next.ts
if (typeof process !== "undefined" && process.argv[1]?.endsWith("safe-next.ts")) {
  const cases: [unknown, string][] = [
    ["/news/new", "/news/new"],
    ["/news?page=2", "/news?page=2"],
    ["//evil.com", "/"],
    ["/\\evil.com", "/"],
    ["https://evil.com", "/"],
    ["/\tevil", "/"],
    ["/.//evil.com", "/"],
    ["/..//evil.com", "/"],
    ["/a/..//evil.com", "/"],
    [null, "/"],
  ];
  for (const [input, want] of cases) console.assert(safeNext(input) === want, `safeNext(${String(input)})`);
  console.log("safe-next ok");
}
