const { DataSource } = require("typeorm");
require("dotenv").config();
const Gallery = require("./entity/Gallery");
const History = require("./entity/History");
const Saran = require("./entity/Saran"); // 1. Panggil tabel Saran

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Gallery, History, Saran], // 2. Tambahkan Saran ke dalam array ini
});



module.exports = { AppDataSource };