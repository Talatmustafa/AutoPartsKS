
import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";

const categories = [
    "Të gjitha", "Filtra", "Frena", "Mirëmbajtje",
    "Motor", "Transmision", "Ftohje", "Elektrike",
    "Siguri", "Goma", "Aksesorë", "Ndriçim",
    "Pastrimi", "Pezullimi", "Karroceri", "Klima"
];

function App() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Të gjitha");
    const [sort, setSort] = useState("");
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // LLOGARIA
    const [token, setToken] = useState(
        () => localStorage.getItem("autoparts_token") || ""
    );

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("autoparts_user")) || null;
        } catch {
            return null;
        }
    });

    const [showAccount, setShowAccount] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [authForm, setAuthForm] = useState({
        full_name: "",
        email: "",
        password: ""
    });
    const [authMessage, setAuthMessage] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    // POROSITE
    const [orders, setOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [orderMessage, setOrderMessage] = useState("");
    const [orderLoading, setOrderLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(
    "cash_on_delivery"
);

    // NGARKIMI I PRODUKTEVE
    async function loadProducts() {
        try {
            const response = await fetch(`${API}/products`);

            if (!response.ok) {
                throw new Error("Nuk mund të ngarkohen produktet.");
            }

            const data = await response.json();
            setProducts(data);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    // FILTRIMI I PRODUKTEVE
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const name = (product.name || "").toLowerCase();
            const description = (product.description || "").toLowerCase();

            const matchesCategory =
                category === "Të gjitha" ||
                product.category === category;

            const matchesSearch =
                name.includes(search.toLowerCase()) ||
                description.includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });

        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, category, search, sort]);

    // SHTIMI NË SHPORTË
    function addToCart(product) {
        setCart(current => {
            const existing = current.find(item => item.id === product.id);

            if (existing) {
                if (existing.quantity >= product.stock) return current;

                return current.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            if (product.stock < 1) return current;

            return [...current, { ...product, quantity: 1 }];
        });
    }

    function changeQuantity(id, amount) {
        setCart(current =>
            current
                .map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + amount }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    }

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    // HYRJA DHE REGJISTRIMI
    async function handleAuth(event) {
        event.preventDefault();
        setAuthLoading(true);
        setAuthMessage("");

        try {
            const endpoint =
                authMode === "register" ? "register" : "login";

            const body = authMode === "register"
                ? authForm
                : {
                    email: authForm.email,
                    password: authForm.password
                };

            const response = await fetch(`${API}/auth/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Ndodhi një gabim!");
            }

            // Pas regjistrimit, bëjmë hyrjen automatike
            if (authMode === "register") {
                setAuthMode("login");
                setAuthMessage("Llogaria u krijua! Tani po kyçemi...");

                const loginResponse = await fetch(`${API}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: authForm.email,
                        password: authForm.password
                    })
                });

                const loginData = await loginResponse.json();

                if (!loginResponse.ok) {
                    throw new Error(loginData.message || "Hyrja dështoi!");
                }

                saveLogin(loginData);
            } else {
                saveLogin(data);
            }

        } catch (err) {
            setAuthMessage(err.message);
        } finally {
            setAuthLoading(false);
        }
    }

    function saveLogin(data) {
        localStorage.setItem("autoparts_token", data.token);
        localStorage.setItem("autoparts_user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setAuthMessage("U kyçët me sukses!");
        setAuthForm({
            full_name: "",
            email: "",
            password: ""
        });
    }

    function logout() {
        localStorage.removeItem("autoparts_token");
        localStorage.removeItem("autoparts_user");

        setToken("");
        setUser(null);
        setOrders([]);
        setShowOrders(false);
        setAuthMessage("Ke dalë nga llogaria.");
    }

    // HISTORIKU I POROSIVE
    async function loadOrders() {
        if (!token) return;

        try {
            const response = await fetch(`${API}/orders/my`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nuk u ngarkuan porositë.");
            }

            setOrders(data);
            setShowOrders(true);
            setOrderMessage("");
        } catch (err) {
            setOrderMessage(err.message);
        }
    }

    // KRIJIMI I POROSISE
    async function placeOrder() {
        if (!token || !user) {
            setShowCart(false);
            setShowAccount(true);
            setAuthMessage("Kyçu në llogari për të vazhduar me porosinë.");
            return;
        }

        if (cart.length === 0) return;

        setOrderLoading(true);
        setOrderMessage("");

        try {
            const response = await fetch(`${API}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
               body: JSON.stringify({
    payment_method: paymentMethod,
    items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }))
})
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Porosia dështoi!");
            }

            setCart([]);
            setShowCart(false);
            setOrderMessage(
                `Porosia #${data.orderId} u regjistrua me sukses! Totali: ${Number(data.total).toFixed(2)} €`
            );

            await loadProducts();
            await loadOrders();

        } catch (err) {
            setOrderMessage(err.message);
        } finally {
            setOrderLoading(false);
        }
    }

    return (
        <div className="store">

            <div className="topbar">
                <span>AutoParts KS – Gjithçka për veturën tuaj</span>
                <span>Dyqani juaj online për pjesë veturash</span>
            </div>

            <header className="store-header">
                <a className="store-logo" href="#">
                    <span>AUTO</span>PARTS KS
                </a>

                <div className="search-box">
                    <span>⌕</span>
                    <input
                        type="search"
                        placeholder="Kërko pjesë, produkte..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="header-actions">
                    <button
                        className="account-button"
                        onClick={() => {
                            setShowAccount(true);
                            setAuthMessage("");
                        }}
                    >
                        👤 {user ? user.full_name : "Llogaria"}
                    </button>

                    <button
                        className="cart-button"
                        onClick={() => setShowCart(true)}
                    >
                        🛒 Shporta
                        <span className="cart-count">{cartCount}</span>
                    </button>
                </div>
            </header>

            <nav className="category-nav">
                {categories.map(item => (
                    <button
                        key={item}
                        className={category === item ? "selected" : ""}
                        onClick={() => setCategory(item)}
                    >
                        {item}
                    </button>
                ))}
            </nav>

            <main>
                <section className="store-hero">
                    <div className="hero-content">
                        <span className="hero-tag">AUTOPARTS KS</span>
                        <h1>Gjithçka që i nevojitet veturës suaj.</h1>
                        <p>
                            Zbuloni pjesë këmbimi, goma, produkte
                            mirëmbajtjeje dhe aksesorë për veturën tuaj.
                        </p>
                        <button
                            onClick={() =>
                                document.getElementById("products")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Shiko produktet →
                        </button>
                    </div>
                </section>

                <section className="features">
                    <div>🚗 <strong>Pjesë për vetura</strong><small>Produkte për nevojat tuaja</small></div>
                    <div>🔧 <strong>Mirëmbajtje</strong><small>Kujdesuni për veturën</small></div>
                    <div>📦 <strong>Porosi online</strong><small>Porositni nga shtëpia</small></div>
                    <div>🛒 <strong>Shportë blerjesh</strong><small>Mbani produktet tuaja</small></div>
                </section>

                <section className="products-section" id="products">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">KATALOGU YNË</span>
                            <h2>Produktet tona</h2>
                            <p>Gjeni pjesët dhe pajisjet për veturën tuaj.</p>
                        </div>

                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            <option value="">Renditja standarde</option>
                            <option value="low">Çmimi: nga më i ulëti</option>
                            <option value="high">Çmimi: nga më i larti</option>
                        </select>
                    </div>

                    {loading && <p className="status">Duke ngarkuar produktet...</p>}
                    {error && <p className="status error">{error}</p>}

                    {!loading && !error && (
                        <>
                            <p className="result-count">
                                U gjetën {filteredProducts.length} produkte
                            </p>

                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <article className="product-card" key={product.id}>
                                        <div className="product-image">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <span>🚘</span>
                                                    <small>{product.category}</small>
                                                </div>
                                            )}

                                            <span className="category-badge">
                                                {product.category}
                                            </span>
                                        </div>

                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>

                                            <div className="product-bottom">
                                                <div>
                                                    <strong>
                                                        {Number(product.price).toFixed(2)} €
                                                    </strong>
                                                    <small>
                                                        {product.stock > 0
                                                            ? `${product.stock} në stok`
                                                            : "Nuk ka stok"}
                                                    </small>
                                                </div>

                                                <button
                                                    disabled={product.stock < 1}
                                                    onClick={() => addToCart(product)}
                                                >
                                                    + Shto
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <p className="status">
                                    Nuk u gjet asnjë produkt për kërkimin tuaj.
                                </p>
                            )}
                        </>
                    )}
                </section>
            </main>

            <footer className="store-footer">
                <a className="store-logo" href="#">
                    <span>AUTO</span>PARTS KS
                </a>
                <p>Gjithçka që i nevojitet veturës suaj.</p>
                <small>© 2026 AutoParts KS. Të gjitha të drejtat e rezervuara.</small>
            </footer>

            {/* LLOGARIA */}
            {showAccount && (
                <div
                    className="account-overlay"
                    onClick={() => setShowAccount(false)}
                >
                    <section
                        className="account-panel"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="cart-heading">
                            <h2>Llogaria ime</h2>
                            <button onClick={() => setShowAccount(false)}>✕</button>
                        </div>

                        {user ? (
                            <div className="account-content">
                                <h3>Përshëndetje, {user.full_name}!</h3>
                                <p>{user.email}</p>

                                <button
                                    className="checkout-button"
                                    onClick={loadOrders}
                                >
                                    Shiko historikun e porosive
                                </button>

                                {orderMessage && (
                                    <p className="status">{orderMessage}</p>
                                )}

                                {showOrders && (
                                    <div className="orders-list">
                                        <h3>Porositë e mia</h3>

                                        {orders.length === 0 ? (
                                            <p>Ende nuk keni bërë porosi.</p>
                                        ) : (
                                            orders.map(order => (
                                                <div
                                                    className="order-card"
                                                    key={order.id}
                                                >
                                                    <strong>
                                                        Porosia #{order.id}
                                                    </strong>
                                                    <p>
                                                        Data: {order.created_at}
                                                    </p>
                                                    <p>
                                                        Statusi: {order.status}
                                                    </p>
                                                    <strong>
                                                        {Number(order.total).toFixed(2)} €
                                                    </strong>

                                                    {order.items?.map((item, index) => (
                                                        <p key={index}>
                                                            {item.name} × {item.quantity}
                                                            {" – "}
                                                            {(item.unit_price * item.quantity).toFixed(2)} €
                                                        </p>
                                                    ))}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                <button
                                    className="logout-button"
                                    onClick={logout}
                                >
                                    Dil nga llogaria
                                </button>
                            </div>
                        ) : (
                            <div className="account-content">
                                <div className="auth-tabs">
                                    <button
                                        className={authMode === "login" ? "active" : ""}
                                        onClick={() => {
                                            setAuthMode("login");
                                            setAuthMessage("");
                                        }}
                                    >
                                        Hyr në llogari
                                    </button>

                                    <button
                                        className={authMode === "register" ? "active" : ""}
                                        onClick={() => {
                                            setAuthMode("register");
                                            setAuthMessage("");
                                        }}
                                    >
                                        Regjistrohu
                                    </button>
                                </div>

                                <form onSubmit={handleAuth}>
                                    {authMode === "register" && (
                                        <label>
                                            Emri dhe mbiemri
                                            <input
                                                type="text"
                                                required
                                                value={authForm.full_name}
                                                onChange={e =>
                                                    setAuthForm({
                                                        ...authForm,
                                                        full_name: e.target.value
                                                    })
                                                }
                                                placeholder="Shkruaj emrin dhe mbiemrin"
                                            />
                                        </label>
                                    )}

                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            required
                                            value={authForm.email}
                                            onChange={e =>
                                                setAuthForm({
                                                    ...authForm,
                                                    email: e.target.value
                                                })
                                            }
                                            placeholder="email@example.com"
                                        />
                                    </label>

                                    <label>
                                        Fjalëkalimi
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={authForm.password}
                                            onChange={e =>
                                                setAuthForm({
                                                    ...authForm,
                                                    password: e.target.value
                                                })
                                            }
                                            placeholder="Së paku 8 karaktere"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        className="checkout-button"
                                        disabled={authLoading}
                                    >
                                        {authLoading
                                            ? "Duke u procesuar..."
                                            : authMode === "login"
                                                ? "Hyr në llogari"
                                                : "Krijo llogari"}
                                    </button>
                                </form>

                                {authMessage && (
                                    <p className="status">{authMessage}</p>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* SHPORTA */}
            {showCart && (
                <div
                    className="cart-overlay"
                    onClick={() => setShowCart(false)}
                >
                    <aside
                        className="cart-panel"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="cart-heading">
                            <h2>Shporta ime ({cartCount})</h2>
                            <button onClick={() => setShowCart(false)}>✕</button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="empty-cart">
                                Shporta juaj është bosh.
                            </p>
                        ) : (
                            <>
                                {cart.map(item => (
                                    <div className="cart-item" key={item.id}>
                                        <div>
                                            <strong>{item.name}</strong>
                                            <small>
                                                {Number(item.price).toFixed(2)} € / copë
                                            </small>

                                            <div className="quantity">
                                                <button
                                                    onClick={() => changeQuantity(item.id, -1)}
                                                >
                                                    −
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    disabled={item.quantity >= item.stock}
                                                    onClick={() => changeQuantity(item.id, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <strong>
                                            {(item.price * item.quantity).toFixed(2)} €
                                        </strong>
                                    </div>
                                ))}

                                <div className="cart-total">
                                    <span>Totali</span>
                                    <strong>{cartTotal.toFixed(2)} €</strong>
                                </div>
                                <div className="payment-options">
    <h3>Mënyra e pagesës</h3>

    <label className="payment-option">
        <input
            type="radio"
            name="payment"
            value="cash_on_delivery"
            checked={paymentMethod === "cash_on_delivery"}
            onChange={() =>
                setPaymentMethod("cash_on_delivery")
            }
        />

        <span>💵 Pagesë në dorëzim</span>
    </label>

    <label className="payment-option disabled">
        <input
            type="radio"
            name="payment"
            disabled
        />

        <span>💳 Visa / Mastercard</span>
        <small>Së shpejti</small>
    </label>
</div>

                                <button
                                    className="checkout-button"
                                    onClick={placeOrder}
                                    disabled={orderLoading}
                                >
                                    {orderLoading
                                        ? "Duke regjistruar..."
                                        : "Konfirmo porosinë"}
                                </button>

                                <small className="checkout-note">
                                    Porosia regjistrohet në llogarinë tuaj.
                                    Pagesa me kartelë nuk është aktivizuar ende.
                                </small>
                            </>
                        )}
                    </aside>
                </div>
            )}

            {orderMessage && !showAccount && (
                <div className="order-notification">
                    {orderMessage}
                </div>
            )}
        </div>
    );
}

export default App;
