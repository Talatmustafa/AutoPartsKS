
const db = require("./db");

// Fotografitë e pjesëve të verifikuara sipas kategorisë
const images = {
    "Turbocharger për veturë":
        "https://scdn.autodoc.de/catalog/categories/100x100/10972.png",

    "Alternator 12V":
        "https://scdn.autodoc.de/catalog/categories/100x100/10450.png",

    "Starter për motor":
        "https://scdn.autodoc.de/catalog/categories/100x100/10459.png",

    "Pompë uji":
        "https://scdn.autodoc.de/catalog/categories/100x100/10191.png",

    "Termostat motori":
        "https://scdn.autodoc.de/catalog/categories/100x100/10195.png",

    "Rrip dhëmbëzor":
        "https://scdn.autodoc.de/catalog/categories/100x100/10504.png",

    "Kandelë ndezjeje":
        "https://scdn.autodoc.de/catalog/categories/100x100/10251.png",

    "Disk freni i pasëm":
        "https://scdn.autodoc.de/catalog/categories/100x100/10132.png",

    "Fener i përparmë":
        "https://scdn.autodoc.de/catalog/categories/100x100/10533.png",

    "Filtër kabine":
        "https://scdn.autodoc.de/catalog/categories/100x100/10363.png",

    "Filter ajri Mann":
        "https://scdn.autodoc.de/catalog/categories/100x100/10360.png",

    "Filtër ajri Mann":
        "https://scdn.autodoc.de/catalog/categories/100x100/10360.png",

    "Bateri 12V":
        "https://scdn.autodoc.de/catalog/categories/100x100/10142.png",

    "Fshirëse xhami":
        "https://scdn.autodoc.de/catalog/categories/100x100/10233.png",

    "Frena Brembo":
        "https://scdn.autodoc.de/catalog/categories/100x100/10130.png",

    "Kushinetë rrote":
        "https://scdn.autodoc.de/catalog/categories/100x100/10679.png",

    "Goma 205/55 R16":
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700",

    "Gomë 195/65 R15":
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700",

    "Gomë 225/45 R17":
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700"
};

const update = db.prepare(`
    UPDATE products
    SET image_url = ?
    WHERE name = ?
`);

let updated = 0;

for (const [name, url] of Object.entries(images)) {
    const result = update.run(url, name);
    updated += result.changes;
    console.log(
        result.changes
            ? `Fotografia u vendos: ${name}`
            : `Produkti nuk u gjet: ${name}`
    );
}

console.log(`U përditësuan ${updated} produkte.`);
