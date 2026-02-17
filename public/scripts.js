// Face Demo — Enroll & Scan (vanilla)
// Requires /models with:
// - tiny_face_detector_model-weights_manifest.json (+ shard files)
// - face_landmark_68_model-weights_manifest.json (+ shard files)
// - face_recognition_model-weights_manifest.json (+ shard files)

const MODEL_URL = "./models";
const STORAGE_KEY = "face_demo_enrollments_v1";

// UI
const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

const modelStatus = document.getElementById("modelStatus");
const camStatus = document.getElementById("camStatus");

const enrollNameEl = document.getElementById("enrollName");
const thresholdEl = document.getElementById("threshold");
const samplesEl = document.getElementById("samples");

const btnEnroll = document.getElementById("btnEnroll");
const btnScan = document.getElementById("btnScan");
const btnStop = document.getElementById("btnStop");
const btnClear = document.getElementById("btnClear");

const enrolledListEl = document.getElementById("enrolledList");
const lastMatchEl = document.getElementById("lastMatch");
const alertsEl = document.getElementById("alerts");

// State
let scanning = false;
let scanTimer = null;

let enrollments = loadEnrollments(); // { name: string, descriptors: number[][] }
let matcher = null;

function nowTime() {
  return new Date().toLocaleTimeString();
}

function setPill(el, text) {
  el.textContent = text;
}

function addAlert(text) {
  const div = document.createElement("div");
  div.className = "alert";
  div.innerHTML = `<div class="t">${nowTime()}</div><div class="m">${escapeHtml(text)}</div>`;
  alertsEl.prepend(div);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderEnrolled() {
  enrolledListEl.innerHTML = "";
  const list = Object.values(enrollments);

  if (list.length === 0) {
    enrolledListEl.innerHTML = `<div class="mono">No enrollments yet.</div>`;
    return;
  }

  list.forEach((e) => {
    const row = document.createElement("div");
    row.className = "badge";
    row.innerHTML = `
      <div class="name">${escapeHtml(e.name)}</div>
      <div class="meta">${e.descriptors.length} samples</div>
    `;
    enrolledListEl.appendChild(row);
  });
}

function saveEnrollments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));
}

function loadEnrollments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    // basic validation
    if (typeof obj !== "object" || obj === null) return {};
    return obj;
  } catch {
    return {};
  }
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;

  await new Promise((resolve) => {
    video.onplaying = () => resolve();
  });

  // Match canvas to actual video pixels
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  setPill(camStatus, "Camera: on");
}

async function loadModels() {
  setPill(modelStatus, "Loading models…");
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  setPill(modelStatus, "Models: ready");
}

function buildMatcher() {
  const threshold = Number(thresholdEl.value || 0.45);

  const labeled = Object.values(enrollments).map((e) => {
    const desc = e.descriptors.map((arr) => new Float32Array(arr));
    return new faceapi.LabeledFaceDescriptors(e.name, desc);
  });

  matcher = new faceapi.FaceMatcher(labeled, threshold);
}

function ensureReady() {
  const hasEnrollments = Object.keys(enrollments).length > 0;
  btnEnroll.disabled = false;
  btnScan.disabled = !hasEnrollments;
  btnStop.disabled = true;
}

function setButtonsWhileScanning(isScanning) {
  btnEnroll.disabled = isScanning;
  btnScan.disabled = isScanning || Object.keys(enrollments).length === 0;
  btnStop.disabled = !isScanning;
  btnClear.disabled = isScanning;
  enrollNameEl.disabled = isScanning;
  thresholdEl.disabled = isScanning;
  samplesEl.disabled = isScanning;
}

async function captureSingleDescriptor() {
  // Try to capture one face descriptor from current video frame
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection ? detection.descriptor : null;
}

async function enrollPerson() {
  const name = enrollNameEl.value.trim();
  if (!name) {
    addAlert("Enter a name before enrolling.");
    return;
  }

  const samples = Math.max(3, Math.min(15, Number(samplesEl.value || 5)));
  addAlert(`Enrolling "${name}"… capture ${samples} samples. Keep your face steady.`);

  const collected = [];
  const maxAttempts = samples * 6; // allow misses
  let attempts = 0;

  while (collected.length < samples && attempts < maxAttempts) {
    attempts++;
    const d = await captureSingleDescriptor();
    if (d) {
      collected.push(Array.from(d));
      lastMatchEl.textContent = `Enrolling: ${name}\nCaptured: ${collected.length}/${samples}`;
    }
    await new Promise((r) => setTimeout(r, 180));
  }

  if (collected.length < Math.ceil(samples * 0.6)) {
    addAlert(`Enrollment failed: face not detected reliably. Improve lighting and try again.`);
    lastMatchEl.textContent = "—";
    return;
  }

  if (!enrollments[name]) {
    enrollments[name] = { name, descriptors: [] };
  }
  enrollments[name].descriptors.push(...collected);

  saveEnrollments();
  renderEnrolled();
  buildMatcher();

  addAlert(`Enrolled "${name}" with ${collected.length} samples.`);
  lastMatchEl.textContent = `Enrolled: ${name}\nTotal samples: ${enrollments[name].descriptors.length}`;
  enrollNameEl.value = "";
  ensureReady();
}

function drawLabelBox(box, label, isFlagged) {
  // manual draw for visible box color
  ctx.lineWidth = 3;
  ctx.strokeStyle = isFlagged ? "#ff4e4e" : "#4ea1ff";
  ctx.strokeRect(box.x, box.y, box.width, box.height);

  // label background
  const pad = 6;
  ctx.font = "14px Arial";
  const textW = ctx.measureText(label).width;
  const textH = 18;

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(box.x, Math.max(0, box.y - textH - pad), textW + pad * 2, textH + pad);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, box.x + pad, Math.max(14, box.y - 8));
}

async function scanTick() {
  if (!scanning || !matcher) return;

  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Debug face count (small)
  ctx.font = "14px Arial";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(`faces: ${detections.length}`, 10, 20);

  const resized = faceapi.resizeResults(detections, { width: canvas.width, height: canvas.height });

  resized.forEach(({ detection, descriptor }) => {
    const best = matcher.findBestMatch(descriptor);

    const isUnknown = best.label === "unknown";
    const label = isUnknown
      ? "Unknown"
      : `${best.label}  (d=${best.distance.toFixed(2)})`;

    // For demo: "flagged" means it matched someone enrolled
    const flagged = !isUnknown;

    drawLabelBox(detection.box, label, flagged);

    if (!isUnknown) {
      lastMatchEl.textContent = `Match: ${best.label}\nDistance: ${best.distance.toFixed(4)}\nTime: ${nowTime()}`;
      // Avoid spamming alerts: only log when distance is pretty confident
      if (best.distance < Number(thresholdEl.value || 0.45) - 0.03) {
        addAlert(`Flagged (demo): ${best.label}  (distance ${best.distance.toFixed(2)})`);
      }
    }
  });
}

function startScan() {
  if (Object.keys(enrollments).length === 0) {
    addAlert("Enroll at least one person first.");
    return;
  }
  buildMatcher();
  scanning = true;
  setButtonsWhileScanning(true);
  addAlert("Scan started.");
  lastMatchEl.textContent = "Scanning…";

  scanTimer = setInterval(scanTick, 200);
}

function stopScan() {
  scanning = false;
  if (scanTimer) clearInterval(scanTimer);
  scanTimer = null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setButtonsWhileScanning(false);
  ensureReady();
  addAlert("Scan stopped.");
  lastMatchEl.textContent = "—";
}

function clearEnrollments() {
  if (!confirm("Clear all enrollments?")) return;
  enrollments = {};
  saveEnrollments();
  renderEnrolled();
  matcher = null;
  addAlert("All enrollments cleared.");
  lastMatchEl.textContent = "—";
  ensureReady();
}

// UI events
btnEnroll.addEventListener("click", enrollPerson);
btnScan.addEventListener("click", startScan);
btnStop.addEventListener("click", stopScan);
btnClear.addEventListener("click", clearEnrollments);

thresholdEl.addEventListener("change", () => {
  if (Object.keys(enrollments).length) {
    buildMatcher();
    addAlert(`Threshold set to ${thresholdEl.value}`);
  }
});

// Boot
(async function boot() {
  renderEnrolled();
  try {
    await loadModels();
    await startCamera();

    // enable buttons
    ensureReady();
    buildMatcher(); // if there are saved enrollments

    addAlert("Ready. Enroll a person, then Start Scan.");
  } catch (err) {
    console.error(err);
    addAlert(`Error: ${err.message || String(err)}`);
    setPill(modelStatus, "Models: error");
  }
})();
