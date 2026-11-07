const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Gallery",
    tableName: "galleries",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar"
        },
        description: {
            type: "text"
        },
        imageUrl: {
            type: "varchar"
        }
    }
});