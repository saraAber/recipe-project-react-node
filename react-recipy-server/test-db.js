const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./recipe.sqlite');

db.all("SELECT * FROM Ingridents WHERE recipeId = 3", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log("📌 רשימת המרכיבים:", rows);
});

db.all("SELECT * FROM Instructions WHERE recipeId = 3", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log("📌 רשימת ההוראות:", rows);
});

db.close();
