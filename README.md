# TepebabesLab

**TepebabesLab** adalah media pembelajaran interaktif berbasis web yang dirancang sebagai **virtual lab untuk mata kuliah TPB ITB**.

Project ini dibuat menggunakan **HTML, CSS, dan JavaScript** secara penuh di sisi browser tanpa backend.

Berbeda dengan LMS biasa yang hanya menampilkan materi dan quiz, TepebabesLab berfokus pada **learning by doing** melalui simulasi, manipulasi parameter, drag-and-drop, visualisasi, challenge, dan feedback langsung.

**Repository:**
https://github.com/sirojulfirdaus/tepebabeslab-tugas-pawm-virtuallab

---

## Deskripsi

TepebabesLab menyediakan kumpulan mini virtual lab untuk beberapa mata kuliah TPB ITB:

* Matematika
* Fisika
* Kimia
* Berpikir Komputasional
* Literasi Digital dan AI
* Olahraga
* Pancasila
* Bahasa Indonesia
* Bahasa Inggris

Setiap mata kuliah memiliki bentuk interaksi yang berbeda agar pengguna tidak hanya membaca materi, tetapi dapat mencoba, mengubah parameter, mengamati hasil, dan mendapatkan feedback secara langsung.

> **Explore. Experiment. Understand.**

---

## Fitur Utama

### Simulation Library

Halaman utama menampilkan seluruh virtual lab yang tersedia dalam bentuk katalog interaktif.

Fitur:

* 9 kategori mata kuliah TPB
* Subject filter
* Featured experiment
* Daftar seluruh lab
* Navigasi langsung menuju workspace
* Responsive layout

---

## Virtual Lab

### 1. Matematika — Function Playground

Mempelajari pengaruh parameter terhadap fungsi kuadrat:

```text
y = ax² + bx + c
```

Fitur:

* Slider untuk parameter `a`, `b`, dan `c`
* Grafik interaktif menggunakan HTML5 Canvas
* Update grafik secara real-time
* Informasi vertex
* Deteksi fungsi kuadrat dan linear
* Mini challenge
* Reset eksperimen

---

### 2. Fisika — Projectile Motion Lab

Simulasi gerak parabola ideal tanpa hambatan udara.

Fitur:

* Pengaturan kecepatan awal
* Pengaturan sudut peluncuran
* Animasi projectile menggunakan `requestAnimationFrame`
* Lintasan pada HTML5 Canvas
* Perhitungan:

  * Range
  * Maximum height
  * Flight time
* Target challenge
* Feedback berdasarkan posisi landing
* Reset simulation

---

### 3. Kimia — pH Mixer Lab

Simulasi sederhana untuk memahami konsep asam, netral, dan basa.

Fitur:

* Drag-and-drop zat ke dalam beaker
* Click/tap fallback untuk perangkat mobile
* Perubahan warna cairan
* Nilai pH
* Klasifikasi:

  * Acidic
  * Neutral
  * Basic
* Riwayat campuran
* Challenge pH
* Reset mixture

> Simulasi ini menggunakan model edukasi sederhana dan tidak merepresentasikan perhitungan kimia laboratorium secara penuh.

---

### 4. Berpikir Komputasional — Sorting Lab

Melatih pemahaman pengurutan dan algoritma sederhana.

Fitur:

* Draggable number blocks
* Click-based swap fallback
* Move counter
* Deteksi urutan ascending
* Feedback ketika berhasil
* Reset

---

### 5. Literasi Digital & AI — AI Decision Lab

Mendemonstrasikan bagaimana sebuah keputusan otomatis dapat dipengaruhi oleh input dan bobot.

Faktor yang digunakan:

* Relevance
* Reliability
* Engagement

Fitur:

* Slider interaktif
* Weighted scoring
* Visual contribution bars
* Classification:

  * Recommend
  * Review
  * Do Not Recommend
* Live feedback
* Challenge

> Model ini hanya merupakan simulasi edukasi sederhana, bukan sistem AI sebenarnya.

---

### 6. Olahraga — Pacing Lab

Mendemonstrasikan hubungan antara durasi, intensitas, dan istirahat terhadap tingkat effort.

Fitur:

* Duration slider
* Intensity slider
* Rest interval
* Relative effort score
* Effort zone
* Visualisasi session composition
* Challenge
* Reset

> Simulasi ini bersifat edukatif dan bukan alat diagnosis atau rekomendasi medis.

---

### 7. Pancasila — Civic Decision Lab

Simulasi reflektif berbasis studi kasus sehari-hari.

Fitur:

* Beberapa skenario
* Pilihan respons
* Feedback reflektif
* Nilai Pancasila yang terkait
* Progress antar skenario
* Restart setelah seluruh skenario selesai

---

### 8. Bahasa Indonesia — Sentence Structure Lab

Melatih penyusunan struktur kalimat:

```text
S - P - O - K
```

Fitur:

* Draggable sentence fragments
* Target slot S/P/O/K
* Click/tap fallback
* Validasi jawaban
* Feedback
* Beberapa latihan
* Reset dan next exercise

---

### 9. Bahasa Inggris — Sentence Builder Lab

Melatih penyusunan kalimat bahasa Inggris.

Fitur:

* Shuffled word tokens
* Click-based sentence construction
* Drag reordering
* Answer validation
* Grammar hint
* Multiple exercises
* Reset dan progression

---

## Fitur HTML5 yang Digunakan

Project ini memanfaatkan beberapa fitur HTML5, antara lain:

* Semantic HTML
* `<canvas>`
* Native drag-and-drop
* `<dialog>`
* `<input type="range">`
* `<output>`
* Semantic sectioning elements
* Accessible form controls
* Responsive interaction

---

## Teknologi

Project dibuat **tanpa framework frontend**.

### Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* JavaScript ES Modules
* HTML5 Canvas API
* Drag and Drop API
* `requestAnimationFrame`
* `ResizeObserver`
* DOM API

### Tidak Menggunakan

* React
* Vue
* Bootstrap
* Tailwind
* Backend
* Database
* External API

---

## Struktur Project

```text
tepebabeslab-tugas-pawm-virtuallab/
│
├── index.html
├── README.md
│
├── css/
│   ├── variables.css
│   ├── main.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   │
│   ├── data/
│   │   ├── labs.js
│   │   └── labInstructions.js
│   │
│   ├── labs/
│   │   ├── mathLab.js
│   │   ├── physicsLab.js
│   │   ├── chemistryLab.js
│   │   ├── computationalLab.js
│   │   ├── aiLab.js
│   │   ├── sportsLab.js
│   │   ├── pancasilaLab.js
│   │   ├── indonesianLab.js
│   │   └── englishLab.js
│   │
│   ├── ui/
│   │   ├── library.js
│   │   ├── workspace.js
│   │   └── feedback.js
│   │
│   └── utils/
│       ├── canvas.js
│       ├── dragDrop.js
│       └── helpers.js
│
└── assets/
    ├── icons/
    └── images/
```

---

## Cara Menjalankan

Karena project menggunakan **ES Modules**, project sebaiknya dijalankan melalui **local HTTP server** dan tidak langsung melalui `file://`.

### 1. Clone Repository

```bash
git clone https://github.com/sirojulfirdaus/tepebabeslab-tugas-pawm-virtuallab.git
```

Masuk ke folder project:

```bash
cd tepebabeslab-tugas-pawm-virtuallab
```

### 2. Menggunakan Python

Jika Python tersedia:

```bash
python -m http.server 5500
```

atau pada Windows:

```bash
py -m http.server 5500
```

Kemudian buka:

```text
http://localhost:5500
```

### 3. Alternatif: VS Code Live Server

Jika menggunakan Visual Studio Code:

1. Buka folder project.
2. Install extension **Live Server**.
3. Klik kanan `index.html`.
4. Pilih **Open with Live Server**.

---

## Cara Menggunakan

1. Buka TepebabesLab.
2. Pilih kategori mata kuliah melalui **Subject Filter**.
3. Pilih salah satu virtual lab.
4. Klik **Start Lab**.
5. Baca objective dan instruksi pada workspace.
6. Gunakan kontrol yang tersedia seperti:

   * Slider
   * Drag-and-drop
   * Click/tap
   * Answer selection
7. Amati hasil yang berubah secara langsung.
8. Selesaikan challenge yang diberikan.
9. Gunakan tombol **Reset** untuk mengulang eksperimen.
10. Gunakan **Back to Labs** untuk kembali ke katalog.

Tombol **How to Use** tersedia pada workspace untuk melihat instruksi singkat setiap lab.

---

## Responsive Design

TepebabesLab dirancang agar dapat digunakan pada:

* Desktop
* Tablet
* Mobile

Pada layar besar, **simulation stage** dan **control panel** ditampilkan berdampingan.

Pada layar kecil, layout akan berubah menjadi satu kolom agar kontrol dan simulasi tetap mudah digunakan.

---

## Accessibility

Beberapa aspek accessibility yang diterapkan:

* Semantic HTML
* Visible keyboard focus
* Keyboard-operable controls
* Label untuk slider dan input
* `aria-live` untuk feedback
* Native dialog
* Feedback tidak hanya mengandalkan warna
* Click/tap fallback untuk interaksi drag-and-drop

---

## Arsitektur Singkat

Alur utama aplikasi:

```text
Simulation Library
        ↓
   Select Lab
        ↓
    Workspace
        ↓
    Lab Module
        ↓
 User Interaction
        ↓
    State Update
        ↓
Visual / Text Feedback
```

Setiap virtual lab memiliki module JavaScript sendiri agar logic antar lab tetap terpisah dan lebih mudah dipelihara.

---

## Catatan

Beberapa simulasi menggunakan model yang disederhanakan untuk tujuan pembelajaran.

Contohnya:

* **Projectile Motion** mengabaikan hambatan udara.
* **pH Mixer** menggunakan model pencampuran sederhana.
* **AI Decision Lab** menggunakan weighted scoring sederhana.
* **Pacing Lab** menggunakan relative effort model sederhana.

Model tersebut digunakan untuk membantu visualisasi konsep, bukan sebagai pengganti perhitungan ilmiah atau sistem profesional sebenarnya.

---

## Repository

https://github.com/sirojulfirdaus/tepebabeslab-tugas-pawm-virtuallab

---

