
const db = require("./db");

const products = [
    {
        name: "Filter vaji Bosch",
        category: "Filtra",
        description: "Filter vaji për mirëmbajtjen e motorit.",
        price: 12.99,
        stock: 25
    },
    {
        name: "Filter ajri Mann",
        category: "Filtra",
        description: "Filter ajri për motorin e veturës.",
        price: 15.50,
        stock: 20
    },
    {
        name: "Frena Brembo",
        category: "Frena",
        description: "Set jastëkësh frenash për veturë.",
        price: 45.00,
        stock: 12
    },
    {
        name: "Disk frenash",
        category: "Frena",
        description: "Disk frenash për sistemin e frenimit.",
        price: 55.00,
        stock: 10
    },
    {
        name: "Vaj motori 5W-30",
        category: "Mirëmbajtje",
        description: "Vaj motori për mirëmbajtje të rregullt.",
        price: 38.00,
        stock: 30
    },
    {
        name: "Bateri 12V",
        category: "Elektrike",
        description: "Bateri për sistemin elektrik të veturës.",
        price: 95.00,
        stock: 8
    },
    {
        name: "Fshirëse xhami",
        category: "Aksesorë",
        description: "Fshirëse për xhamin e përparmë.",
        price: 18.00,
        stock: 20
    },
    {
        name: "Goma 205/55 R16",
        category: "Goma",
        description: "Gomë për vetura me madhësi 205/55 R16.",
        price: 65.00,
        stock: 16
    },
    {
        name: "Llambë LED H7",
        category: "Ndriçim",
        description: "Llambë LED për ndriçimin e veturës.",
        price: 22.00,
        stock: 25
    },
    {
        name: "Antifriz 1L",
        category: "Mirëmbajtje",
        description: "Lëng për sistemin e ftohjes së motorit.",
        price: 7.50,
        stock: 40
    },
    {
        name: "Set pastrimi për veturë",
        category: "Pastrimi",
        description: "Produkte për pastrimin e jashtëm të veturës.",
        price: 19.99,
        stock: 15
    },
    {
        name: "Amortizator",
        category: "Pezullimi",
        description: "Amortizator për sistemin e pezullimit.",
        price: 75.00,
        stock: 10
    }
];

const insert = db.prepare(`
    INSERT INTO products
    (name, category, description, price, stock)
    VALUES (?, ?, ?, ?, ?)
`);

const seedProducts = db.transaction(() => {
    const count = db.prepare(
        "SELECT COUNT(*) AS total FROM products"
    ).get().total;

    if (count > 0) {
        console.log("Produktet ekzistojnë tashmë.");
        return;
    }

    for (const product of products) {
        insert.run(
            product.name,
            product.category,
            product.description,
            product.price,
            product.stock
        );
    }

    console.log(`${products.length} produkte u shtuan!`);
});

seedProducts();
db.close();
