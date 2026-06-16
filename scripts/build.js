const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const headerHTML = fs.readFileSync(path.join(ROOT, "header.html"), "utf8");
const footerHTML = fs.readFileSync(path.join(ROOT, "footer.html"), "utf8");

const PAGES = [
  "index.html",
  "about.html",
  "timetable.html",
  "cca.html",
  "achievements.html",
  "znotes.html",
  "zportal.html",
  "404.html",
  "502.html",
];

// Ensure dist exists
fs.mkdirSync(DIST, { recursive: true });

// Copy static assets
copyIfExists("robots.txt");
copyIfExists("sitemap.xml");
copyIfExists("vercel.json");

// Copy assets directory
const assetsSrc = path.join(ROOT, "dist", "assets");
const assetsDst = path.join(DIST, "assets");
if (fs.existsSync(assetsSrc)) {
  copyDirSync(assetsSrc, assetsDst);
}

PAGES.forEach((filename) => {
  const src = path.join(ROOT, filename);
  if (!fs.existsSync(src)) {
    console.warn(`  SKIP ${filename} — file not found`);
    return;
  }

  let html = fs.readFileSync(src, "utf8");

  // Replace Tailwind CDN <script> + global.css <link> with a single built stylesheet
  html = html.replace(
    /<link rel="preconnect" href="https:\/\/cdn\.tailwindcss\.com">\s*/g,
    ""
  );
  html = html.replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g,
    ""
  );
  html = html.replace(
    /<link rel="stylesheet" href="global\.css">\s*/g,
    ""
  );

  // Insert the built stylesheet after the last <link> or right before </head>
  const headCloseIdx = html.indexOf("</head>");
  if (headCloseIdx !== -1) {
    html =
      html.slice(0, headCloseIdx) +
      '  <link rel="stylesheet" href="/assets/styles.css">\n' +
      html.slice(headCloseIdx);
  }

  // Inline header
  html = html.replace(
    /<div id="header-placeholder"><\/div>\s*<script src="header\.js"><\/script>/g,
    headerHTML.trim()
  );

  // Inline footer — two patterns: the placeholder+script, and the noscript version
  html = html.replace(
    /<div id="footer-placeholder"><\/div>\s*<script src="footer\.js"><\/script>/g,
    footerHTML.trim()
  );

  // Remove the standalone mobile menu toggle script (header.js handled it)
  // The footer.js created the back-to-top button — inline that functionality
  html = html.replace(
    /  <script src="header\.js"><\/script>\s*/g,
    ""
  );
  html = html.replace(
    /  <script src="footer\.js"><\/script>\s*/g,
    ""
  );

  // Inject header.js inline (for active nav + mobile menu toggle)
  const headerJS = fs.readFileSync(path.join(ROOT, "header.js"), "utf8");
  // Wrap in script tag, remove the fetch() since header is now inlined
  const headerJSWrapped = headerJS
    .replace(
      /document\.addEventListener\('DOMContentLoaded',\s*function\s*\(\)\s*\{\s*fetch\('header\.html'\)[\s\S]*?\.catch[\s\S]*?\}\);?\s*/m,
      ""
    )
    .trim();

  let inlineHeaderJS = "";
  if (headerJSWrapped) {
    // The remaining code handles active nav + mobile menu, but now the HTML
    // is already in the DOM so we just need to run it directly
    inlineHeaderJS =
      "<script>\n" +
      "document.addEventListener('DOMContentLoaded', function() {\n" +
      "  var currentPath = window.location.pathname.split('/').pop();\n" +
      "  if (currentPath === '' || currentPath === '/') currentPath = 'index.html';\n" +
      "  document.querySelectorAll('.nav-link').forEach(function(link) {\n" +
      "    if (link.getAttribute('href') === currentPath) link.classList.add('active');\n" +
      "  });\n" +
      "  document.querySelectorAll('#mobile-menu a').forEach(function(link) {\n" +
      "    if (link.getAttribute('href') === currentPath) {\n" +
      "      link.className = 'block py-3 text-base font-bold text-emerald-700 bg-emerald-50 rounded-lg px-3 transition-colors';\n" +
      "    }\n" +
      "  });\n" +
      "  var menuBtn = document.getElementById('mobile-menu-btn');\n" +
      "  var mobileMenu = document.getElementById('mobile-menu');\n" +
      "  if (menuBtn && mobileMenu) {\n" +
      "    menuBtn.addEventListener('click', function() { mobileMenu.classList.toggle('open'); });\n" +
      "    mobileMenu.querySelectorAll('a').forEach(function(link) {\n" +
      "      link.addEventListener('click', function() { mobileMenu.classList.remove('open'); });\n" +
      "    });\n" +
      "  }\n" +
      "});\n" +
      "</script>\n";
  }

  // Inject footer.js inline (for back-to-top button)
  let inlineFooterJS =
    "<script>\n" +
    "document.addEventListener('DOMContentLoaded', function() {\n" +
    "  var btn = document.createElement('button');\n" +
    "  btn.innerHTML = '\\u2191';\n" +
    "  btn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold opacity-0 pointer-events-none transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-1 z-50 cursor-pointer border-2 border-white/20';\n" +
    "  btn.setAttribute('aria-label', 'Back to top');\n" +
    "  btn.style.bottom = '2rem';\n" +
    "  btn.style.right = '2rem';\n" +
    "  document.body.appendChild(btn);\n" +
    "  window.addEventListener('scroll', function() {\n" +
    "    if (window.scrollY > 300) {\n" +
    "      btn.classList.remove('opacity-0', 'pointer-events-none');\n" +
    "      btn.classList.add('opacity-100');\n" +
    "    } else {\n" +
    "      btn.classList.remove('opacity-100');\n" +
    "      btn.classList.add('opacity-0', 'pointer-events-none');\n" +
    "    }\n" +
    "  });\n" +
    "  btn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });\n" +
    "});\n" +
    "</script>\n";

  // Insert the JS scripts before </body>
  const bodyCloseIdx = html.lastIndexOf("</body>");
  if (bodyCloseIdx !== -1) {
    html =
      html.slice(0, bodyCloseIdx) +
      inlineHeaderJS +
      inlineFooterJS +
      html.slice(bodyCloseIdx);
  }

  // Remove blank-line clusters (3+ consecutive blank lines → 1 blank line)
  html = html.replace(/\n{3,}/g, "\n\n");

  fs.writeFileSync(path.join(DIST, filename), html, "utf8");
  console.log(`  OK   ${filename}`);
});

console.log("\nBuild complete. Output: dist/");

// --- helpers ---

function copyIfExists(filename) {
  const src = path.join(ROOT, filename);
  const dst = path.join(DIST, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`  COPY ${filename}`);
  }
}

function copyDirSync(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
