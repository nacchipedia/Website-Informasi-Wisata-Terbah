require("reflect-metadata");
const express = require("express");
const { AppDataSource } = require("./data-source");
require("dotenv").config();
const Gallery = require("./entity/Gallery");
const History = require("./entity/History"); // Panggil tabel History
const multer = require("multer");
const path = require("path");
const Saran = require("./entity/Saran");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'public/Assets/') },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Keamanan Login
const SECRET_TOKEN = "terbah-admin-2026";
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") res.json({ success: true, token: SECRET_TOKEN });
    else res.status(401).json({ success: false, message: "Gagal!" });
});

const cekAuth = (req, res, next) => {
    if (req.headers['authorization'] === SECRET_TOKEN) next();
    else res.status(403).json({ message: "Akses Ditolak!" });
};

// ==========================================
// API ENDPOINTS (GALERI & RIWAYAT)
// ==========================================

// 1. Ambil Data Galeri (Publik)
app.get("/api/galleries", async (req, res) => {
    try {
        const galleryRepository = AppDataSource.getRepository(Gallery);
        const galleries = await galleryRepository.find({ order: { id: "ASC" } });
        res.json(galleries);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 2. Tambah Data (Catat Riwayat)
app.post("/api/galleries", cekAuth, upload.single('imageFile'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = "./Assets/" + req.file.filename;

        const galleryRepository = AppDataSource.getRepository(Gallery);
        const newGallery = galleryRepository.create({ title, description, imageUrl });
        const result = await galleryRepository.save(newGallery);

        // PENCATATAN RIWAYAT
        await AppDataSource.getRepository(History).save({ action: "Tambah Data", itemTitle: title, username: "admin" });

        res.status(201).json(result);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 3. Edit Data (Catat Riwayat)
app.post("/api/galleries/:id", cekAuth, upload.single('imageFile'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const galleryRepository = AppDataSource.getRepository(Gallery);

        const galleryToUpdate = await galleryRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!galleryToUpdate) return res.status(404).json({ message: "Tidak ditemukan" });

        galleryToUpdate.title = title;
        galleryToUpdate.description = description;
        if (req.file) galleryToUpdate.imageUrl = "./Assets/" + req.file.filename;
        const result = await galleryRepository.save(galleryToUpdate);

        // PENCATATAN RIWAYAT
        await AppDataSource.getRepository(History).save({ action: "Edit Data", itemTitle: title, username: "admin" });

        res.json(result);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 4. Hapus Data (Catat Riwayat)
app.delete("/api/galleries/:id", cekAuth, async (req, res) => {
    try {
        const galleryRepository = AppDataSource.getRepository(Gallery);

        // Cari datanya dulu sebelum dihapus untuk tahu apa judul fotonya
        const itemToDelete = await galleryRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!itemToDelete) return res.status(404).json({ message: "Tidak ditemukan" });

        await galleryRepository.delete(req.params.id);

        // PENCATATAN RIWAYAT
        await AppDataSource.getRepository(History).save({ action: "Hapus Data", itemTitle: itemToDelete.title, username: "admin" });

        res.json({ message: "Berhasil dihapus" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// 5. API Ambil Data Riwayat (Untuk Modal)
app.get("/api/history", cekAuth, async (req, res) => {
    try {
        const historyRepo = AppDataSource.getRepository(History);
        // Urutkan riwayat dari yang paling baru (waktu terakhir) ke paling lama
        const logs = await historyRepo.find({ order: { createdAt: "DESC" } });
        res.json(logs);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// ==========================================
// API KOTAK SARAN & MASUKAN (DATABASE)
// ==========================================
app.post("/api/saran", async (req, res) => {
    try {
        const { nama, email, pesan } = req.body;
        const saranRepository = AppDataSource.getRepository(Saran);

        // Simpan ke database PostgreSQL
        const newSaran = saranRepository.create({ nama, email, pesan });
        await saranRepository.save(newSaran);

        res.status(201).json({ success: true, message: "Saran berhasil disimpan!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
    }
});

// Mulai Server
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database terhubung!");
        app.listen(port, () => console.log(`🚀 Server berjalan di http://localhost:${port}`));
    })
    .catch((err) => console.error(err));