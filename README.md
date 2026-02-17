# Face Recognition Demo (Enroll & Scan)

A browser-based face recognition system built using **face-api.js**, pure **HTML, CSS, and JavaScript**.

This project demonstrates a simple biometric workflow:

1. Enroll a person using webcam capture  
2. Store multiple facial descriptors locally  
3. Scan live video feed  
4. Match detected faces against enrolled profiles  
5. Highlight matches and log events in real time  

⚠️ This project is intended strictly for **educational and demonstration purposes**.

---

## 🌐 Live Demo

This project is deployed using **GitHub Pages**.

🔗 Access it here:

```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

(Replace with your actual link.)

---

## 🚀 Features

- Live webcam streaming  
- Face detection (TinyFaceDetector)  
- Face landmark detection  
- Face recognition using 128D descriptors  
- Adjustable recognition threshold  
- Multi-sample enrollment for improved accuracy  
- Real-time bounding boxes  
- Match highlighting  
- Alert log panel  
- LocalStorage-based persistence  
- Fully static deployment (no backend required)

---

## 🧠 How It Works

### Models Used

The project loads the following face-api.js models:

- Tiny Face Detector  
- 68 Face Landmark Model  
- Face Recognition Model  

### Enrollment Phase

- User enters a name.  
- The system captures multiple face descriptors.  
- Descriptors are stored in browser localStorage.  
- Each person can have multiple samples.  

### Scan Phase

- Webcam frames are analyzed continuously.  
- Each detected face generates a descriptor.  
- The descriptor is compared using FaceMatcher.  
- If the match distance is below threshold, the face is flagged.  
- The system logs the match with timestamp and confidence score.  

---

## 📁 Project Structure

```
face-demo/
│
├── docs/                # Deployed via GitHub Pages
│   ├── index.html
│   ├── style.css
│   ├── scripts.js
│   ├── face-api.min.js
│   └── models/
│       ├── tiny_face_detector_model-weights_manifest.json
│       ├── face_landmark_68_model-weights_manifest.json
│       ├── face_recognition_model-weights_manifest.json
│       └── (model shard files)
│
├── server.js            # Optional (for local Express development)
├── package.json
├── README.md
└── .gitignore
```

---

## 🛠 Local Development

Although the live version is hosted via GitHub Pages, you can still run it locally.

### Option 1 — Static Server (Recommended)

```bash
npx http-server docs
```

Then open:

```
http://127.0.0.1:8080
```

### Option 2 — Express (Optional)

If you want to use your local Express server:

```bash
node server.js
```

Note: GitHub Pages does **not** run Express.  
The hosted version is purely static.

---

## 🌍 Deployment (GitHub Pages)

This project is deployed from the `/docs` folder.

To enable deployment:

1. Go to **Repository → Settings → Pages**
2. Under **Source**, select:
   - Branch: `main`
   - Folder: `/docs`
3. Save

GitHub will automatically generate a public URL.

---

## ⚙️ Configuration

### Recognition Threshold

Default: `0.45`

Lower value → stricter matching  
Higher value → more tolerant matching (may increase false positives)

Adjustable directly in the UI.

### Enrollment Samples

Default: `5`

Increasing samples improves recognition stability.

---

## 🔐 Data Storage

- All face data is stored locally in browser `localStorage`.
- No data is sent to any server.
- Clearing browser storage removes all enrollments.

---

## ⚠️ Ethical Notice

This is a technical prototype and educational demo.

It should only be used with:

- Your own face  
- Consenting volunteers  
- Controlled classroom environments  

This system:

- Does NOT predict behavior  
- Does NOT determine intent  
- Is NOT a law enforcement tool  
- Is NOT production-grade biometric security  

It is strictly a UI and recognition demonstration.

---

## 📉 Limitations

- Accuracy depends heavily on lighting conditions.  
- Works best with front-facing, well-lit faces.  
- Browser performance varies by device.  
- No liveness detection (photo spoofing possible).  
- Not suitable for real-world surveillance use.  

---

## 📈 Possible Improvements

- Backend database integration  
- User authentication system  
- Liveness / anti-spoof detection  
- Multi-camera support  
- Analytics dashboard  
- Exportable match reports  
- Role-based access control  

---

## 📜 License

For educational and demonstration purposes only.

---

## 👤 Author

Developed as a school project prototype.
