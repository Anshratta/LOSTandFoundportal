import { db } from "./firebase.js";
import {
    collection, addDoc, onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const path = window.location.pathname;
const itemsRef = collection(db, "items");

// ── Navbar search (works on every page) ──
const navInput = document.querySelector(".search input");
const navBtn = document.querySelector(".search button");

if (navInput) {
    const goSearch = () => {
        const prefix = path.includes("/pages/") ? "" : "pages/";
        window.location.href = `${prefix}browse.html?search=${encodeURIComponent(navInput.value.trim())}`;
    };
    navBtn?.addEventListener("click", goSearch);
    navInput.addEventListener("keydown", e => e.key === "Enter" && goSearch());
}

const timeAgo = (ts) => {
    if (!ts) return "Unknown";
    const days = Math.floor((Date.now() - ts.toDate()) / 86400000);
    return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} Days Ago`;
};

const showDetails = (item) =>
    alert(`Item: ${item.itemName || ""}\nContact: ${item.contact || "N/A"}\n\n${item.description || ""}`);

// ================================================================
// HOME PAGE — live stats + latest lost items
// ================================================================
if (path.endsWith("index.html") || path === "/" || path.endsWith("/LOSTandFoundportal/")) {

    const statCards = document.querySelectorAll(".stats .card h2");
    const itemsContainer = document.querySelector(".items-container");
    const icons = { bags: "🎒", electronics: "📱", "id cards": "🪪", books: "📚", keys: "🔑", wallets: "👛" };

    onSnapshot(itemsRef, (snap) => {
        const items = snap.docs.map(d => d.data());

        // update stats
        const lost = items.filter(i => i.type === "lost");
        const foundNames = new Set(items.filter(i => i.type === "found").map(i => i.itemName?.toLowerCase().trim()));
        const recovered = new Set(lost.map(i => i.itemName?.toLowerCase().trim()).filter(n => foundNames.has(n)));
        if (statCards[0]) statCards[0].textContent = lost.length;
        if (statCards[1]) statCards[1].textContent = snap.size;
        if (statCards[2]) statCards[2].textContent = recovered.size;

        // latest 3 lost items
        if (!itemsContainer) return;
        const latest = lost.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)).slice(0, 3);

        itemsContainer.innerHTML = latest.length ? "" : `<p style="color:#aaa;text-align:center;width:100%;padding:20px;">No lost items reported yet.</p>`;

        latest.forEach(item => {
            const card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
                <div class="item-image">${icons[item.category?.toLowerCase()] || "📦"}</div>
                <h3>${item.itemName || "Unknown Item"}</h3>
                <p>${item.location || "Unknown Location"}</p>
                <span>${timeAgo(item.timestamp)}</span>`;
            const btn = document.createElement("button");
            btn.className = "view-btn";
            btn.textContent = "View Details";
            btn.addEventListener("click", () => showDetails(item));
            card.appendChild(btn);
            itemsContainer.appendChild(card);
        });
    }, () => {
        if (itemsContainer) itemsContainer.innerHTML = `<p style="color:#f87171;text-align:center;width:100%;padding:20px;">⚠️ Could not load items.</p>`;
    });
}

// ================================================================
// BROWSE PAGE — search + filter items
// ================================================================
if (path.endsWith("browse.html")) {

    let allItems = [];
    let activeFilter = "all";

    const params = new URLSearchParams(window.location.search);
    const itemsDiv = document.getElementById("items");
    const message = document.getElementById("message");
    const search = document.getElementById("search");

    if (search) search.value = params.get("search") || params.get("category") || "";

    onSnapshot(query(itemsRef, orderBy("timestamp", "desc")), (snap) => {
        allItems = snap.docs.map(d => d.data());
        render();
    }, () => { if (message) { message.textContent = "⚠️ Failed to load items."; message.style.display = "block"; } });

    function render() {
        const term = search?.value.toLowerCase() || "";
        const filtered = allItems.filter(item =>
            (activeFilter === "all" || item.type === activeFilter) &&
            (!term || [item.itemName, item.location, item.category, item.description]
                .some(f => (f || "").toLowerCase().includes(term)))
        );

        if (itemsDiv) itemsDiv.innerHTML = "";
        if (message) message.style.display = filtered.length ? "none" : "block";

        filtered.forEach(item => {
            const div = document.createElement("div");
            div.className = `item ${item.type}`;
            div.innerHTML = `
                <h3>${item.itemName || "Unknown"}</h3>
                <p>${item.location || "Unknown location"}</p>
                <span>${item.type === "lost" ? "Lost" : "Found"}</span>
                <small style="display:block;margin-top:4px;opacity:.6;">${item.category || ""}</small>`;
            const btn = document.createElement("button");
            btn.className = "view-btn";
            btn.style.marginTop = "8px";
            btn.textContent = "View Details";
            btn.addEventListener("click", () => showDetails(item));
            div.appendChild(btn);
            itemsDiv?.appendChild(div);
        });
    }

    search?.addEventListener("input", render);

    // called from HTML: onclick="filterItems('lost')" etc.
    window.filterItems = (type) => {
        activeFilter = type;
        ["all", "lost", "found"].forEach(t =>
            document.getElementById(`btn-${t}`)?.classList.toggle("active", t === type));
        render();
    };
}

// ================================================================
// REPORT LOST / REPORT FOUND — shared submit logic
// ================================================================
function setupReportForm(formId, type, dateFieldId) {
    if (!path.endsWith(`report-${type}.html`)) return;

    const form = document.getElementById(formId);
    const statusBox = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");
    if (!form) return;

    const showStatus = (msg, ok) => {
        if (!statusBox) return;
        statusBox.textContent = msg;
        statusBox.style.display = "block";
        statusBox.style.background = ok ? "#1a3a2a" : "#3a1a1a";
        statusBox.style.color = ok ? "#4ade80" : "#f87171";
        statusBox.style.border = `1px solid ${ok ? "#4ade80" : "#f87171"}`;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const get = (id) => document.getElementById(id)?.value.trim() || "";
        const data = {
            type, itemName: get("itemName"), category: get("category"),
            location: get("location"), [dateFieldId]: get(dateFieldId),
            contact: get("contact"), description: get("description"),
            status: "open", timestamp: serverTimestamp()
        };

        if (!data.itemName || !data.location || !data[dateFieldId] || !data.contact) {
            return showStatus("⚠️ Please fill in all required fields.", false);
        }

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Submitting..."; }
        try {
            await addDoc(itemsRef, data);
            showStatus(`✅ ${type === "lost" ? "Lost" : "Found"} item reported successfully!`, true);
            form.reset();
        } catch (err) {
            console.error("Firestore error:", err);
            showStatus("❌ Failed to submit. Please try again.", false);
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit"; }
        }
    });
}

setupReportForm("lost-form", "lost", "dateLost");
setupReportForm("found-form", "found", "dateFound");