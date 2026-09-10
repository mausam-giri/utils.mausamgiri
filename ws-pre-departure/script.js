const arrivalCard = {
    id: "foreigner-arrival-card",
    title: "Online Foreigner Arrival Card",
    desc: "Fill 72 to 24 hours before arrival in China.",
    href: "https://s.nia.gov.cn/ArrivalCardFillingPC/entry-registration-home",
    // Depart India morning 19 Sep; same-day evening arrival in China.
    arrivalAt: "2026-09-19T19:00:00+08:00",
    openHoursBefore: 72,
    closeHoursBefore: 24
};

const checklistData = [
    {
        id: "travel-docs",
        title: "Travel & Documents",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        subsections: [
            {
                name: "Domestic Travel",
                items: [
                    { id: "govt-id", title: "Valid Government ID", desc: "Original ID for domestic transit" },
                    { id: "flight-tickets-domestic", title: "Flight Tickets", desc: "Physical or Digital copies" },
                    { id: "emergency-contact", title: "Emergency Contacts", desc: "Keep accessible at all times" }
                ]
            },
            {
                name: "International Travel",
                items: [
                    { id: "passport", title: "Passport", desc: "DO NOT pack in checked baggage." },
                    { id: "china-visa", title: "China Visa", desc: "Confirmed visa - Physical & digital copies." },
                    { id: "travel-insurance", title: "Travel Insurance", desc: "Policy document with coverage details" },
                    { id: "invitation-letter", title: "Invitation Letter", desc: "Official WorldSkills Competition invitation" },
                    { id: "flight-tickets-intl", title: "International Flight Tickets", desc: "Boarding passes & complete itinerary" }
                ]
            }
        ]
    },
    {
        id: "packing",
        title: "Packing Essentials",
        icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
        subsections: [
            {
                name: "Clothing & General",
                items: [
                    { id: "safety-shoes", title: "Safety shoes", desc: "If needed for your competition" },
                    { id: "white-socks", title: "White socks", desc: "4-6 pairs" },
                    { id: "undergarments", title: "Undergarments", desc: "4-6 pairs" }
                ]
            },
            {
                name: "Health & Hygiene",
                items: [
                    { id: "medications", title: "Medications", desc: "Pack in carry-on" },
                    { id: "toiletries", title: "Toiletries", desc: "Pack in carry-on" },
                    { id: "first-aid", title: "First-Aid Kit", desc: "Basic supplies" },
                    { id: "sunscreen", title: "Sunscreen", desc: "SPF 50+" },
                    { id: "wet-wipes", title: "Wet Wipes", desc: "Travel pack" },
                    { id: "hand-sanitizer", title: "Hand Sanitizer", desc: "< 100ml for carry-on" },
                    { id: "deodorant", title: "Deodorant", desc: "Roll-on preferred" },
                    { id: "tissues", title: "Tissues", desc: "Pocket pack" },
                    { id: "pain-relief", title: "Pain Relief", desc: "Paracetamol/Ibuprofen" }
                ]
            },
            {
                name: "Food (Personal)",
                items: [
                    { id: "dry-snacks", title: "Dry Snacks", desc: "Commercially packaged" },
                    { id: "energy-bars", title: "Energy Bars", desc: "High protein" },
                    { id: "nuts-seeds", title: "Nuts & Seeds", desc: "Almonds/Walnuts" },
                    { id: "tea-coffee", title: "Tea & Coffee", desc: "Sachets" },
                    { id: "biscuits", title: "Biscuits", desc: "Glucose/Digestive" }
                ]
            }
        ]
    },
    {
        id: "nsdc-items",
        title: "NSDC Provided Items",
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        subsections: [
            {
                name: "Ceremonial & Comp Attire",
                items: [
                    { id: "tracksuit", title: "Track suit / sweatshirt", desc: " " },
                    { id: "trousers-shoes", title: "Trousers / formal shoes", desc: "For opening ceremony" }
                ]
            },
            {
                name: "Luggage & Accessories",
                items: [
                    { id: "cabin-trolley", title: "Cabin trolley / bag", desc: " " },
                    { id: "accessories", title: "Accessories Kit", desc: "Lapel pins / adaptor / umbrella" },
                    { id: "table-flag", title: "Table flag", desc: "India Flag" }
                ]
            },
            {
                name: "Currency",
                items: [
                    { id: "foreign-currency", title: "Foreign Currency", desc: "USD/CNY small denominations" }
                ]
            }
        ]
    },
    {
        id: "info",
        title: "Itinerary & Info",
        icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
        subsections: [
            {
                name: "Accommodation",
                items: [
                    { id: "hotel-info", title: "Vienna International Hotel", desc: "Shanghai Hongqiao" }
                ]
            }
        ]
    }
];

let appState = {
    checks: {},
    flags: {},
    notes: {},
    filter: 'all',
    collapsed: {}
};

let currentNoteItemId = null;

function init() {
    loadState();
    render();
    startCodeCountdown();
}

function loadState() {
    const saved = localStorage.getItem('wsc-smart-checklist');
    if (saved) {
        const parsed = JSON.parse(saved);
        appState.checks = parsed.checks || {};
        appState.flags = parsed.flags || {};
        appState.notes = parsed.notes || {};
        appState.collapsed = parsed.collapsed || {};
    }
}

function saveState() {
    localStorage.setItem('wsc-smart-checklist', JSON.stringify({
        checks: appState.checks,
        flags: appState.flags,
        notes: appState.notes,
        collapsed: appState.collapsed
    }));
    updateProgress();
}

function getAllItems() {
    return [
        arrivalCard,
        ...checklistData.flatMap(section =>
            section.subsections.flatMap(sub => sub.items)
        )
    ];
}

function getArrivalWindow() {
    const arrival = new Date(arrivalCard.arrivalAt);
    const openAt = new Date(arrival.getTime() - arrivalCard.openHoursBefore * 3600 * 1000);
    const closeAt = new Date(arrival.getTime() - arrivalCard.closeHoursBefore * 3600 * 1000);
    return { arrival, openAt, closeAt };
}

function formatChinaDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Shanghai",
        day: "numeric",
        month: "short"
    }).format(date);
}

function formatDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    if (d > 0) return `${d}d ${h}h`;
    const m = Math.floor((total % 3600) / 60);
    if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
    return `${m}m`;
}

function getArrivalStatus(now = new Date()) {
    const { openAt, closeAt } = getArrivalWindow();
    if (now < openAt) {
        return {
            key: "upcoming",
            label: `Opens in ${formatDuration(openAt - now)}`
        };
    }
    if (now < closeAt) {
        return {
            key: "open",
            label: `Window open · closes in ${formatDuration(closeAt - now)}`
        };
    }
    return {
        key: "closed",
        label: "Ideal window has passed — form may still be required"
    };
}

function updateArrivalCardStatus() {
    const el = document.getElementById("arrival-card-status");
    if (!el) return;
    const status = getArrivalStatus();
    el.textContent = status.label;
    el.dataset.status = status.key;
}

function matchesFilter(item) {
    if (appState.filter === 'all') return true;
    if (appState.filter === 'completed') return !!appState.checks[item.id];
    if (appState.filter === 'pending') return !appState.checks[item.id];
    return true;
}

function getSubsectionKey(sectionId, subsectionName) {
    return `${sectionId}::${subsectionName}`;
}

function toggleSubsection(key) {
    appState.collapsed[key] = !appState.collapsed[key];
    saveState();
    render();
}

function renderArrivalCard() {
    if (!matchesFilter(arrivalCard)) return "";

    const { openAt, closeAt } = getArrivalWindow();
    const status = getArrivalStatus();
    const isChecked = !!appState.checks[arrivalCard.id];
    const isFlagged = !!appState.flags[arrivalCard.id];
    const hasNote = !!appState.notes[arrivalCard.id];

    return `
        <section class="action-section">
            <div class="card action-card ${isChecked ? "is-done" : ""} ${isFlagged ? "is-flagged" : ""}">
                <div class="item-row ${isChecked ? "item-completed" : ""} ${isFlagged ? "is-flagged" : ""}" id="row-${arrivalCard.id}" onclick="toggleCheck('${arrivalCard.id}')">
                    <div class="custom-checkbox pointer-events-none">
                        <input type="checkbox" class="hidden" ${isChecked ? "checked" : ""} tabindex="-1">
                        <div>
                            <svg class="w-3 h-3 text-white ${isChecked ? "" : "hidden"}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <p class="item-text">${arrivalCard.title}</p>
                            ${hasNote ? `<span class="material-icon material-icon-filled text-base" title="Has comment">chat_bubble</span>` : ""}
                        </div>
                        <p class="item-desc">${arrivalCard.desc}</p>
                    </div>
                    <div class="item-actions" onclick="event.stopPropagation()">
                        <button type="button" onclick="toggleFlag('${arrivalCard.id}')" class="flag-btn" aria-label="Flag item">
                            <span class="material-icon">flag</span>
                        </button>
                        <button type="button" onclick="openNoteModal('${arrivalCard.id}')" class="${hasNote ? "text-brand-300" : ""}" aria-label="Add comment">
                            <span class="material-icon ${hasNote ? "material-icon-filled" : ""}">add_comment</span>
                        </button>
                    </div>
                </div>
                <div class="action-card-body">
                    <p class="action-window-row">
                        <span class="action-meta">Fill window: ${formatChinaDate(openAt)} – ${formatChinaDate(closeAt)}</span>
                        <span class="action-status" id="arrival-card-status" data-status="${status.key}">${status.label}</span>
                    </p>
                    <a class="action-link" href="${arrivalCard.href}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
                        Open official form
                        <span class="material-icon">open_in_new</span>
                    </a>
                </div>
            </div>
        </section>
    `;
}

function render() {
    const container = document.getElementById('checklist-container');
    container.innerHTML = '';

    let hasVisibleItems = matchesFilter(arrivalCard);
    container.innerHTML = renderArrivalCard();

    checklistData.forEach(section => {
        const subsectionsHtml = section.subsections.map(subsection => {
            const filteredItems = subsection.items.filter(matchesFilter);
            if (filteredItems.length === 0) return '';

            hasVisibleItems = true;
            const subKey = getSubsectionKey(section.id, subsection.name);
            const isCollapsed = !!appState.collapsed[subKey];

            return `
                <div class="card">
                    <button type="button" onclick="toggleSubsection('${subKey}')" class="subsection-toggle ${isCollapsed ? 'is-collapsed' : ''}">
                        <span class="subsection-name">${subsection.name}</span>
                        <span class="material-icon collapse-icon">${isCollapsed ? 'expand_more' : 'expand_less'}</span>
                    </button>
                    <div class="${isCollapsed ? 'hidden' : ''}">
                        ${filteredItems.map(item => createItemHTML(item)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        if (!subsectionsHtml.trim()) return;

        container.innerHTML += `
            <section>
                <h2>${section.title}</h2>
                ${subsectionsHtml}
            </section>
        `;
    });

    if (!hasVisibleItems) {
        container.innerHTML = `<p class="empty-state">No items match the current filter.</p>`;
    }

    updateProgress();
    updateFilterButtons();
    updateArrivalCardStatus();
}

function createItemHTML(item) {
    const isChecked = !!appState.checks[item.id];
    const isFlagged = !!appState.flags[item.id];
    const hasNote = !!appState.notes[item.id];
    const desc = item.desc ? `<p class="item-desc">${item.desc}</p>` : '';

    return `
    <div class="item-row ${isChecked ? 'item-completed' : ''} ${isFlagged ? 'is-flagged' : ''}" id="row-${item.id}" onclick="toggleCheck('${item.id}')">
        <div class="custom-checkbox pointer-events-none">
            <input type="checkbox" class="hidden" ${isChecked ? 'checked' : ''} tabindex="-1">
            <div>
                <svg class="w-3 h-3 text-white ${isChecked ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
        </div>

        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
                <p class="item-text truncate">${item.title}</p>
                ${hasNote ? `<span class="material-icon material-icon-filled text-base" title="Has comment">chat_bubble</span>` : ''}
            </div>
            ${desc}
        </div>

        <div class="item-actions" onclick="event.stopPropagation()">
            <button type="button" onclick="toggleFlag('${item.id}')" class="flag-btn" aria-label="Flag item">
                <span class="material-icon">flag</span>
            </button>
            <button type="button" onclick="openNoteModal('${item.id}')" class="${hasNote ? 'text-brand-300' : ''}" aria-label="Add comment">
                <span class="material-icon ${hasNote ? 'material-icon-filled' : ''}">add_comment</span>
            </button>
        </div>
    </div>
    `;
}

function toggleCheck(id) {
    appState.checks[id] = !appState.checks[id];
    saveState();
    render();
}

function toggleFlag(id) {
    if (appState.flags[id]) {
        delete appState.flags[id];
    } else {
        appState.flags[id] = true;
    }
    saveState();
    render();
}

function openNoteModal(id) {
    currentNoteItemId = id;
    const itemTitle = getAllItems().find(i => i.id === id)?.title || 'Item';
    document.getElementById('note-item-title').textContent = `For: ${itemTitle}`;
    document.getElementById('note-input').value = appState.notes[id] || '';
    document.getElementById('note-modal').classList.remove('hidden');
}

function closeNoteModal() {
    document.getElementById('note-modal').classList.add('hidden');
    currentNoteItemId = null;
}

function saveNote() {
    if (currentNoteItemId) {
        const text = document.getElementById('note-input').value.trim();
        if (text) {
            appState.notes[currentNoteItemId] = text;
        } else {
            delete appState.notes[currentNoteItemId];
        }
        saveState();
        render();
        closeNoteModal();
    }
}

function setFilter(type) {
    appState.filter = type;
    render();
}

function updateFilterButtons() {
    ['all', 'pending', 'completed'].forEach(type => {
        const btn = document.getElementById(`btn-${type}`);
        btn.classList.toggle('is-active', appState.filter === type);
    });
}

function updateProgress() {
    const allItems = getAllItems();
    const checkedCount = allItems.filter(i => appState.checks[i.id]).length;
    const percentage = Math.round((checkedCount / allItems.length) * 100);

    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}

function startCodeCountdown() {
    const targetTs = Math.floor(new Date('September 19, 2026 00:00:00').getTime() / 1000);
    const elCountdown = document.getElementById('countdown');

    function update() {
        const delta = Math.max(targetTs - Math.floor(Date.now() / 1000), 0);
        const d = Math.floor(delta / 86400);
        const h = Math.floor((delta % 86400) / 3600);
        const m = Math.floor((delta % 3600) / 60);
        const s = delta % 60;
        if (elCountdown) {
            elCountdown.textContent = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
        }
        updateArrivalCardStatus();
    }

    update();
    setInterval(update, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}