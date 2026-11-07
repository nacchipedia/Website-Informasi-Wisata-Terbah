const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Saran",
    tableName: "saran_masukan",
    columns: {
        id: { primary: true, type: "int", generated: true },
        nama: { type: "varchar", nullable: true },
        email: { type: "varchar", nullable: true },
        pesan: { type: "text" },
        createdAt: { type: "timestamp", createDate: true } // Otomatis mencatat waktu
    }
});