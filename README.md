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
- No backend required  

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
├── index.html
├── styles.css
├── app.js
├── models/
│   ├── tiny_face_detector_model-weights_manifest.json
│   ├── face_landmark_68_model-weights_manifest.json
│   ├── face_recognition_model-weights_manifest.json
│   └── (model shard files)
│
└── README.md
```

---

## 🛠 Installation & Setup (Windows)

### 1️⃣ Install Node.js (LTS)

Download and install from:  
https://nodejs.org/

### 2️⃣ Navigate to project folder

```bash
cd path\to\face-demo
```

### 3️⃣ Start local HTTP server

```bash
npx http-server .
```

Open in browser:

```
http://127.0.0.1:8080
```

⚠️ Important: Do NOT open `index.html` directly.  
Models must be loaded via HTTP.

---

## 🎯 Usage

### Enroll a Person

1. Enter a name in the input field.  
2. Click **Enroll**.  
3. Keep your face steady in front of the camera.  
4. Multiple samples will be captured automatically.  

### Start Scan

1. Click **Start Scan**.  
2. Detected faces will be matched against enrolled profiles.  
3. Matches are highlighted and logged.  

### Stop Scan

Stops the scanning loop.

### Clear Enrollments

Deletes all stored face data from browser localStorage.

---

## ⚙️ Configuration

### Recognition Threshold

Default: `0.45`

Lower value → stricter matching  
Higher value → more tolerant matching (may increase false positives)

You can adjust this directly in the UI.

### Enrollment Samples

Default: `5`

Increasing samples improves recognition stability.

---

## 🔐 Data Storage

- All face data is stored locally in browser `localStorage`.  
- No data is sent to any server.  
- Clearing browser storage will remove all enrollments.  

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
