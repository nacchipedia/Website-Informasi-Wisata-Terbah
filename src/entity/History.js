const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "History",
    tableName: "histories",
    columns: {
        id: { primary: true, type: "int", generated: true },
        action: { type: "varchar" },       // Mencatat: "Tambah", "Edit", atau "Hapus"
        itemTitle: { type: "varchar" },    // Mencatat judul foto yang diubah
        username: { type: "varchar" },     // Mencatat siapa yang mengubah
        createdAt: { type: "timestamp", createDate: true } // Otomatis mencatat hari & jam
    }
});