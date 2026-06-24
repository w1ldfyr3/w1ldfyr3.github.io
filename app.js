// ── CONFIG ──
const GITHUB_URL = "https://github.com/w1ldfyr3";

// ── BLOCK RIGHT-CLICK ──
document.addEventListener("contextmenu", e => e.preventDefault());

// ── BLOCK DRAG-SELECT ──
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("dragstart",   e => e.preventDefault());

// ── MUSIC ──
// Change the src path when ready. Loops forever at low volume.
const bgMusic = new Audio();
bgMusic.src  = "/assets/theme.mp3"; // <-- change this path
bgMusic.loop = true;
bgMusic.volume = 0.4;

function startMusic() {
  bgMusic.play().catch(() => {}); // silently ignore if blocked
}

// ── BOOT ──
function startDesktop() {
  startMusic(); // user gesture = autoplay allowed
  const boot = document.getElementById("boot");
  const desktop = document.getElementById("desktop");
  if (boot) {
    boot.style.opacity = "0";
  }
  setTimeout(() => {
    if (boot) boot.style.display = "none";
    if (desktop) {
      desktop.style.display = "block";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          desktop.classList.add("visible");
        });
      });
    }
    // Stagger desktop icons entrance
    const icons = document.querySelectorAll(".desk-icon");
    icons.forEach((icon, i) => {
      setTimeout(() => icon.classList.add("appeared"), 120 + i * 80);
    });
    // Open main window with spring animation after short delay
    setTimeout(() => {
      const win = document.getElementById("win");
      if (win) {
        win.style.display = "flex";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => win.classList.add("open"));
        });
      }
    }, 300);
  }, 550);
}

// Press Enter on boot screen to continue
document.addEventListener("keydown", e => {
  const boot = document.getElementById("boot");
  if (e.key === "Enter" && boot && boot.style.display !== "none" && boot.style.opacity !== "0") {
    startDesktop();
  }
});

// ── CLOCK ──
function tick() {
  const n = new Date();
  const clock = document.getElementById("clock-tb");
  if (clock) {
    clock.textContent =
      String(n.getHours()).padStart(2, "0") + ":" +
      String(n.getMinutes()).padStart(2, "0");
  }
}
setInterval(tick, 1000);
tick();

// ── WINDOW DRAG ──
const win = document.getElementById("win");
const titlebar = document.getElementById("titlebar");
let drag = false;
let ox = 0, oy = 0;

if (titlebar) {
  titlebar.addEventListener("mousedown", e => {
    if (e.target.classList.contains("win-btn")) return;
    if (win.classList.contains("maximized")) return; // don't drag when maximized
    drag = true;
    const r = win.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    win.style.transform = "none";
    win.style.transition = "box-shadow 0.15s";
    win.style.boxShadow = "0 16px 64px rgba(0,0,0,0.95), 0 0 0 1px #06060e, 0 0 40px rgba(144,144,255,0.08)";
  });
}

// ── RESIZE ──
const RESIZE_DIRS = ['n','s','e','w','ne','nw','se','sw'];
RESIZE_DIRS.forEach(dir => {
  const h = document.createElement('div');
  h.className = `resize-handle resize-${dir}`;
  h.dataset.dir = dir;
  win.appendChild(h);
});

let resizing = false;
let resizeDir = '';
let rsX, rsY, rsW, rsH, rsL, rsT;
const MIN_W = 320, MIN_H = 220;

win.addEventListener('mousedown', e => {
  const handle = e.target.closest('.resize-handle');
  if (!handle || win.classList.contains('maximized')) return;
  e.preventDefault();
  e.stopPropagation();
  resizing = true;
  resizeDir = handle.dataset.dir;
  const r = win.getBoundingClientRect();
  rsX = e.clientX; rsY = e.clientY;
  rsW = r.width;   rsH = r.height;
  rsL = r.left;    rsT = r.top;
  win.style.transform  = 'none';
  win.style.transition = 'none';
  win.style.maxHeight  = 'none';
});

document.addEventListener('mousemove', e => {
  if (drag) {
    const taskbarH = 28;
    const maxX = window.innerWidth  - win.offsetWidth;
    const maxY = window.innerHeight - win.offsetHeight - taskbarH;
    const newX = Math.min(Math.max(0, e.clientX - ox), maxX);
    const newY = Math.min(Math.max(0, e.clientY - oy), maxY);
    win.style.left = newX + "px";
    win.style.top  = newY + "px";
    return;
  }
  if (!resizing) return;

  const dx = e.clientX - rsX;
  const dy = e.clientY - rsY;
  const d  = resizeDir;
  const taskbarH = 28;

  if (d.includes('e')) {
    const maxW = window.innerWidth - rsL;
    win.style.width = Math.min(maxW, Math.max(MIN_W, rsW + dx)) + 'px';
  }
  if (d.includes('s')) {
    const maxH = window.innerHeight - taskbarH - rsT;
    win.style.height = Math.min(maxH, Math.max(MIN_H, rsH + dy)) + 'px';
  }
  if (d.includes('w')) {
    const nw = Math.max(MIN_W, rsW - dx);
    const newL = Math.max(0, rsL + rsW - nw);
    win.style.width = (rsL + rsW - newL) + 'px';
    win.style.left  = newL + 'px';
  }
  if (d.includes('n')) {
    const nh = Math.max(MIN_H, rsH - dy);
    const newT = Math.max(0, rsT + rsH - nh);
    win.style.height = (rsT + rsH - newT) + 'px';
    win.style.top    = newT + 'px';
  }
});

document.addEventListener('mouseup', () => {
  if (drag) {
    drag = false;
    win.style.boxShadow = "";
    win.style.transition = "";
  }
  if (resizing) {
    resizing = false;
    win.style.transition = '';
  }
});

// ── WINDOW CONTROLS ──
function closeWin() {
  win.classList.add("minimizing");
  setTimeout(() => {
    win.classList.remove("minimizing", "open");
    win.style.display = "none";
    document.getElementById("task-main").classList.remove("active");
  }, 200);
}

function minimizeWin() {
  win.classList.add("minimizing");
  setTimeout(() => {
    win.classList.remove("minimizing", "open");
    win.style.display = "none";
  }, 200);
}

function restoreWin() {
  win.style.display = "flex";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      win.classList.remove("minimizing");
      win.classList.add("open");
    });
  });
  document.getElementById("task-main").classList.add("active");
}

let maximized = false;
function toggleMaximize() {
  maximized = !maximized;
  if (maximized) {
    // Save current size/pos before maximizing
    win.dataset.preMaxLeft   = win.style.left;
    win.dataset.preMaxTop    = win.style.top;
    win.dataset.preMaxWidth  = win.style.width;
    win.dataset.preMaxHeight = win.style.height;
    win.classList.add("maximized");
  } else {
    win.classList.remove("maximized");
    // Restore previous size/pos if available
    if (win.dataset.preMaxLeft)   win.style.left   = win.dataset.preMaxLeft;
    if (win.dataset.preMaxTop)    win.style.top    = win.dataset.preMaxTop;
    if (win.dataset.preMaxWidth)  win.style.width  = win.dataset.preMaxWidth;
    if (win.dataset.preMaxHeight) win.style.height = win.dataset.preMaxHeight;
    // Re-center if never been moved
    if (!win.dataset.preMaxLeft) {
      win.style.left      = '50%';
      win.style.transform = 'translateX(-50%)';
    }
  }
}

// ── APP & TAB SYSTEM ──
function openApp(name) {
  restoreWin();
  switchTab(name);
}

function switchTab(id) {
  const current = document.querySelector(".tab-pane.active");
  if (current) current.classList.remove("active");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const tabBtn = document.getElementById("tab-btn-" + id);
  if (tabBtn) tabBtn.classList.add("active");

  const target = document.getElementById("tab-" + id);
  if (target) target.classList.add("active");

  const addr = document.getElementById("addr-input");
  if (addr) {
    addr.classList.remove("updating");
    void addr.offsetWidth;
    addr.value = "C:\\" + id.toUpperCase();
    addr.classList.add("updating");
    setTimeout(() => addr.classList.remove("updating"), 400);
  }
  
  // Trigger writeup load when the Fuwiles tab is clicked
  if (id === 'fuwiles') loadWriteups();
}

// ── DESKTOP ICONS ──
document.querySelectorAll(".desk-icon").forEach(icon => {
  icon.addEventListener("dblclick", () => {
    const app = icon.getAttribute("data-app");
    icon.style.transform = "scale(0.88)";
    setTimeout(() => { icon.style.transform = ""; }, 120);
    setTimeout(() => openApp(app), 80);
  });
});

// ── START MENU ──
let startMenuOpen = false;

function toggleStart() {
  const m = document.getElementById("start-menu");
  if (startMenuOpen) {
    closeStart();
  } else {
    startMenuOpen = true;
    m.classList.remove("closing");
    m.classList.add("opening");
    m.style.display = "block";
  }
}

function closeStart() {
  if (!startMenuOpen) return;
  startMenuOpen = false;
  const m = document.getElementById("start-menu");
  m.classList.remove("opening");
  m.classList.add("closing");
  setTimeout(() => {
    m.style.display = "none";
    m.classList.remove("closing");
  }, 140);
}

document.addEventListener("mousedown", e => {
  const m = document.getElementById("start-menu");
  const btn = document.getElementById("start-btn");
  if (startMenuOpen && !m.contains(e.target) && !btn.contains(e.target)) {
    closeStart();
  }
});

// ── UTILS ──
function openLink(url) { window.open(url, "_blank"); closeStart(); }

function shutdown() {
  bgMusic.pause();
  document.body.style.filter = "invert(1) hue-rotate(180deg)";
  setTimeout(() => { document.body.style.filter = ""; }, 80);
  setTimeout(() => { document.body.style.filter = "invert(1)"; }, 140);
  setTimeout(() => { document.body.style.filter = ""; }, 200);
  setTimeout(() => location.reload(), 350);
}

// ── WRITEUPS SYSTEM (FuWiles) ──
const GITHUB_USER = "w1ldfyr3";
const GITHUB_REPO = "w1ldfyr3.github.io"; // Make sure this matches your repo name exactly
let writeupsLoaded = false;

async function loadWriteups() {
  if (writeupsLoaded) return; // Only fetch once per session to save API limits
  const tbody = document.getElementById('writeup-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '<tr><td colspan="4" class="fuwiles-title">Fetching from GitHub...</td></tr>';

  try {
    // Fetch the contents of the /writeups folder via GitHub API
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/writeups`);
    if (!res.ok) throw new Error("API Error");
    
    const files = await res.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    if (mdFiles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="fuwiles-title">No writeups found. Drop .md files in /writeups folder.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    writeupsLoaded = true;

    mdFiles.forEach(file => {
      const title = file.name.replace('.md', '').replace(/-/g, ' ');
      const tr = document.createElement('tr');
      tr.onclick = () => openWriteupPost(file.name, title);
      
      tr.innerHTML = `
        <td class="fuwiles-icon"><img src="https://win98icons.alexmeub.com/icons/png/notepad-2.png" alt="file"></td>
        <td class="fuwiles-title">${title}</td>
        <td class="fuwiles-tags"><span class="tag">writeup</span></td>
        <td class="fuwiles-year"></td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" class="fuwiles-title">Failed to load writeups. Check repo name in app.js</td></tr>';
  }
}

async function openWriteupPost(filename, title) {
  document.getElementById('writeup-list-view').style.display = 'none';
  const postView = document.getElementById('post-view');
  postView.style.display = 'block';
  
  document.getElementById('writeup-title').innerText = title;
  document.getElementById('post-body').innerHTML = '<p>Loading markdown...</p>';

  try {
    // Fetch the clean markdown file content
    const res = await fetch(`writeups/${filename}`);
    const text = await res.text();
    
    // Render standard markdown to HTML
    document.getElementById('post-body').innerHTML = marked.parse(text);
    document.getElementById('win-content').scrollTop = 0;
  } catch (err) {
    document.getElementById('post-body').innerHTML = '<p>Error loading writeup.</p>';
  }
}

function hideWriteupPost() {
  document.getElementById('post-view').style.display = 'none';
  document.getElementById('writeup-list-view').style.display = 'block';
}
