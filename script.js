import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const path = window.location.pathname;


// ================================================================
// HOME PAGE — index.html
// Live stats + latest lost items from Firestore
// ================================================================

if (path.endsWith("index.html") || path === "/" || path.endsWith("/LOSTandFoundportal/")) {

    // ── Live stats counters ──────────────────────────────────
    const statsItems     = document.querySelector(".stats .card:nth-child(2) h2");
    const statsRecovered = document.querySelector(".stats .card:nth-child(3) h2");

    onSnapshot(collection(db, "items"), (snap) => {
        if (statsItems) statsItems.textContent = snap.size;
    });

    onSnapshot(
        query(collection(db, "items"), where("status", "==", "recovered")),
        (snap) => {
            if (statsRecovered) statsRecovered.textContent = snap.size;
        }
    );

    // ── Latest lost items ────────────────────────────────────
    const itemsContainer = document.querySelector(".items-container");

    const categoryIcons = {
        bags: "🎒", electronics: "📱", "id cards": "🪪",
        books: "📚", keys: "🔑", wallets: "👛"
    };

    function timeAgo(timestamp) {
        if (!timestamp) return "Unknown";
        const diff = Math.floor((new Date() - timestamp.toDate()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "Yesterday";
        return `${diff} Days Ago`;
    }

    onSnapshot(
        query(
            collection(db, "items"),
            where("type", "==", "lost"),
            orderBy("timestamp", "desc"),
            limit(3)
        ),
        (snap) => {
            if (!itemsContainer) return;
            itemsContainer.innerHTML = "";

            if (snap.empty) {
                itemsContainer.innerHTML = `
                    <p style="color:#aaa;text-align:center;width:100%;padding:20px;">
                        No lost items reported yet.
                    </p>`;
                return;
            }

            snap.forEach((doc) => {
                const d    = doc.data();
                const icon = categoryIcons[(d.category || "").toLowerCase()] || "📦";
                const card = document.createElement("div");
                card.className = "item-card";
                card.innerHTML = `
                    <div class="item-image">${icon}</div>
                    <h3>${d.itemName  || "Unknown Item"}</h3>
                    <p>${d.location   || "Unknown Location"}</p>
                    <span>${timeAgo(d.timestamp)}</span>
                    <button class="view-btn"
                        onclick="alert('Item: ${(d.itemName||'').replace(/'/g,"\\'")}\\nContact: ${(d.contact||'N/A').replace(/'/g,"\\'")}\\n\\n${(d.description||'').replace(/'/g,"\\'")}')">
                        View Details
                    </button>
                `;
                itemsContainer.appendChild(card);
            });
        }
    );
}


// ================================================================
// BROWSE PAGE — browse.html
// Original filterItems() & searchItems() — now powered by Firestore
// ================================================================

if (path.endsWith("browse.html")) {

    let allItems     = [];
    let activeFilter = "all";

    const itemsDiv    = document.getElementById("items");
    const message     = document.getElementById("message");
    const search      = document.getElementById("search");

    // ── Real-time Firestore listener (replaces hardcoded HTML items) ──
    onSnapshot(
        query(collection(db, "items"), orderBy("timestamp", "desc")),
        (snap) => {
            allItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderItems();
        },
        (err) => {
            console.error("Firestore error:", err);
            if (message) {
                message.textContent    = "⚠️ Failed to load items.";
                message.style.display  = "block";
            }
        }
    );

    // ── Original searchItems logic (from script.jss) ─────────
    function searchItems() {
        renderItems();
    }

    // ── Original filterItems logic (from script.jss) ─────────
    function filterItems(type) {
        activeFilter = type;

        // Update active button style
        ["all", "lost", "found"].forEach(t => {
            const btn = document.getElementById(`btn-${t}`);
            if (btn) btn.classList.toggle("active", t === type);
        });

        renderItems();
    }

    // ── Render items (combines search + filter) ───────────────
    function renderItems() {
        const searchVal = search ? search.value.toLowerCase() : "";

        const filtered = allItems.filter(item => {
            const matchType   = activeFilter === "all" || item.type === activeFilter;
            const matchSearch = !searchVal ||
                (item.itemName   || "").toLowerCase().includes(searchVal) ||
                (item.location   || "").toLowerCase().includes(searchVal) ||
                (item.category   || "").toLowerCase().includes(searchVal) ||
                (item.description|| "").toLowerCase().includes(searchVal);
            return matchType && matchSearch;
        });

        if (itemsDiv) itemsDiv.innerHTML = "";

        if (filtered.length === 0) {
            if (message) message.style.display = "block";
            return;
        }

        if (message) message.style.display = "none";

        filtered.forEach(item => {
            const div = document.createElement("div");
            div.className = `item ${item.type}`;
            div.innerHTML = `
                <h3>${item.itemName || "Unknown"}</h3>
                <p>${item.location  || "Unknown location"}</p>
                <span>${item.type === "lost" ? "Lost" : "Found"}</span>
                <small style="display:block;margin-top:4px;opacity:.6;">${item.category || ""}</small>
                <button class="view-btn" style="margin-top:8px;"
                    onclick="alert('Item: ${(item.itemName||'').replace(/'/g,"\\'")}\\nContact: ${(item.contact||'N/A').replace(/'/g,"\\'")}\\n\\n${(item.description||'').replace(/'/g,"\\'")}')">
                    View Details
                </button>
            `;
            if (itemsDiv) itemsDiv.appendChild(div);
        });
    }

    // ── Attach search listener ────────────────────────────────
    if (search) search.addEventListener("keyup", searchItems);

    // ── Expose filterItems globally for onclick= in HTML ─────
    window.filterItems = filterItems;
}


// ================================================================
// REPORT LOST PAGE — report-lost.html
// Submits form data to Firestore "items" collection
// ================================================================

if (path.endsWith("report-lost.html")) {

    const form      = document.getElementById("lost-form");
    const statusBox = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    function showStatus(msg, success) {
        statusBox.textContent      = msg;
        statusBox.style.display    = "block";
        statusBox.style.background = success ? "#1a3a2a" : "#3a1a1a";
        statusBox.style.color      = success ? "#4ade80" : "#f87171";
        statusBox.style.border     = success ? "1px solid #4ade80" : "1px solid #f87171";
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const itemName    = document.getElementById("itemName").value.trim();
            const category    = document.getElementById("category").value;
            const location    = document.getElementById("location").value.trim();
            const dateLost    = document.getElementById("dateLost").value;
            const contact     = document.getElementById("contact").value.trim();
            const description = document.getElementById("description").value.trim();

            if (!itemName || !location || !dateLost || !contact) {
                showStatus("⚠️ Please fill in all required fields.", false);
                return;
            }

            submitBtn.disabled    = true;
            submitBtn.textContent = "Submitting...";

            try {
                await addDoc(collection(db, "items"), {
                    type: "lost",
                    itemName,
                    category,
                    location,
                    dateLost,
                    contact,
                    description,
                    status:    "open",
                    timestamp: serverTimestamp()
                });

                showStatus("✅ Lost item reported successfully!", true);
                form.reset();

            } catch (err) {
                console.error("Firestore error:", err);
                showStatus("❌ Failed to submit. Please try again.", false);

            } finally {
                submitBtn.disabled    = false;
                submitBtn.textContent = "Submit";
            }
        });
    }
}


// ================================================================
// REPORT FOUND PAGE — report-found.html
// Submits form data to Firestore "items" collection
// ================================================================

if (path.endsWith("report-found.html")) {

    const form      = document.getElementById("found-form");
    const statusBox = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    function showStatus(msg, success) {
        statusBox.textContent      = msg;
        statusBox.style.display    = "block";
        statusBox.style.background = success ? "#1a3a2a" : "#3a1a1a";
        statusBox.style.color      = success ? "#4ade80" : "#f87171";
        statusBox.style.border     = success ? "1px solid #4ade80" : "1px solid #f87171";
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const itemName    = document.getElementById("itemName").value.trim();
            const category    = document.getElementById("category").value;
            const location    = document.getElementById("location").value.trim();
            const dateFound   = document.getElementById("dateFound").value;
            const contact     = document.getElementById("contact").value.trim();
            const description = document.getElementById("description").value.trim();

            if (!itemName || !location || !dateFound || !contact) {
                showStatus("⚠️ Please fill in all required fields.", false);
                return;
            }

            submitBtn.disabled    = true;
            submitBtn.textContent = "Submitting...";

            try {
                await addDoc(collection(db, "items"), {
                    type: "found",
                    itemName,
                    category,
                    location,
                    dateFound,
                    contact,
                    description,
                    status:    "open",
                    timestamp: serverTimestamp()
                });

                showStatus("✅ Found item reported successfully!", true);
                form.reset();

            } catch (err) {
                console.error("Firestore error:", err);
                showStatus("❌ Failed to submit. Please try again.", false);

            } finally {
                submitBtn.disabled    = false;
                submitBtn.textContent = "Submit";
            }
        });
    }
}
