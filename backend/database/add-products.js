
const db = require("./db");

const products = [
    {
        name: "Turbocharger për veturë",
        category: "Motor",
        description: "Turbo për përmirësimin e performancës së motorit.",
        price: 180,
        stock: 8,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Alternator 12V",
        category: "Elektrike",
        description: "Alternator për furnizimin elektrik dhe karikimin e baterisë.",
        price: 110,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Starter për motor",
        category: "Elektrike",
        description: "Motorino për ndezjen e motorit të veturës.",
        price: 85,
        stock: 9,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Radiator për ftohje",
        category: "Ftohje",
        description: "Radiator për sistemin e ftohjes së motorit.",
        price: 95,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Pompë uji",
        category: "Ftohje",
        description: "Pompë për qarkullimin e lëngut ftohës.",
        price: 42,
        stock: 12,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Termostat motori",
        category: "Ftohje",
        description: "Termostat për kontrollin e temperaturës së motorit.",
        price: 19,
        stock: 15,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Rrip dhëmbëzor",
        category: "Motor",
        description: "Rrip për sinkronizimin e pjesëve të motorit.",
        price: 35,
        stock: 14,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Set kuplungu",
        category: "Transmision",
        description: "Set kuplungu për ndërrimin e shpejtësive.",
        price: 145,
        stock: 6,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Kandelë ndezjeje",
        category: "Motor",
        description: "Kandelë për ndezjen e përzierjes në motorët benzinë.",
        price: 8,
        stock: 30,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Bobinë ndezjeje",
        category: "Elektrike",
        description: "Bobinë për sistemin e ndezjes së motorit.",
        price: 28,
        stock: 12,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Pompa e karburantit",
        category: "Motor",
        description: "Pompë për furnizimin e motorit me karburant.",
        price: 65,
        stock: 8,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Injektor karburanti",
        category: "Motor",
        description: "Injektor për sistemin e furnizimit të motorit.",
        price: 55,
        stock: 12,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Sensor oksigjeni",
        category: "Elektrike",
        description: "Sensor për matjen e oksigjenit në gazrat e shkarkimit.",
        price: 32,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Sensor ABS",
        category: "Siguri",
        description: "Sensor për sistemin kundër bllokimit të frenave.",
        price: 24,
        stock: 15,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Set amortizatorësh",
        category: "Pezullimi",
        description: "Amortizatorë për stabilitet dhe rehati gjatë vozitjes.",
        price: 130,
        stock: 8,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Krah i suspensionit",
        category: "Pezullimi",
        description: "Krah për sistemin e suspensionit të veturës.",
        price: 48,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Kushinetë rrote",
        category: "Pezullimi",
        description: "Kushinetë për rrotullimin e lirshëm të rrotës.",
        price: 27,
        stock: 16,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Pasqyrë anësore",
        category: "Karroceri",
        description: "Pasqyrë anësore për dukshmëri më të mirë.",
        price: 45,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700"
    },
    {
        name: "Fener i përparmë",
        category: "Ndriçim",
        description: "Fener për ndriçimin e pjesës së përparme të veturës.",
        price: 75,
        stock: 8,
        image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700"
    },
    {
        name: "Dritë e pasme",
        category: "Ndriçim",
        description: "Dritë e pasme për sinjalizim dhe siguri.",
        price: 52,
        stock: 9,
        image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700"
    },
    {
        name: "Kompresor i klimës",
        category: "Klima",
        description: "Kompresor për sistemin e klimës së veturës.",
        price: 160,
        stock: 5,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Filtër kabine",
        category: "Filtra",
        description: "Filtër për ajrin që hyn në kabinën e veturës.",
        price: 13,
        stock: 20,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Filtër karburanti",
        category: "Filtra",
        description: "Filtër për pastrimin e karburantit.",
        price: 17,
        stock: 18,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Disk freni i pasëm",
        category: "Frena",
        description: "Disk frenimi për boshtin e pasëm.",
        price: 48,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700"
    },
    {
        name: "Lëng frenash DOT 4",
        category: "Frena",
        description: "Lëng frenash për sistemin hidraulik të frenimit.",
        price: 9,
        stock: 25,
        image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=700"
    },
    {
        name: "Gomë 195/65 R15",
        category: "Goma",
        description: "Gomë për vetura me madhësi 195/65 R15.",
        price: 58,
        stock: 20,
        image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700"
    },
    {
        name: "Gomë 225/45 R17",
        category: "Goma",
        description: "Gomë për vetura me madhësi 225/45 R17.",
        price: 82,
        stock: 12,
        image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700"
    },
    {
        name: "Mbajtëse telefoni për veturë",
        category: "Aksesorë",
        description: "Mbajtëse praktike për telefon në veturë.",
        price: 12,
        stock: 25,
        image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700"
    },
    {
        name: "Kamerë parkimi",
        category: "Aksesorë",
        description: "Kamerë ndihmëse për parkim më të lehtë.",
        price: 38,
        stock: 10,
        image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700"
    }
];

const insert = db.prepare(`
    INSERT INTO products
    (name, category, description, price, stock, image_url)
    SELECT ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
        SELECT 1 FROM products WHERE name = ?
    )
`);

const addProducts = db.transaction(() => {
    let added = 0;

    for (const product of products) {
        const result = insert.run(
            product.name,
            product.category,
            product.description,
            product.price,
            product.stock,
            product.image_url,
            product.name
        );

        added += result.changes;
    }

    return added;
});

const added = addProducts();

console.log(`U shtuan ${added} produkte të reja.`);
console.log(`Në listë ishin ${products.length} produkte.`);
