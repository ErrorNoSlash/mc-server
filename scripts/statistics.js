// Global state
const stats = [];

// Get active row limit (default 20)
const getRowLimit = () => {
    if (document.getElementById("2")?.checked) return 2;
    if (document.getElementById("5")?.checked) return 5;
    return 20;
};

// Get sort options
const getSortOptions = () => ({
    timeOld: document.getElementById("to")?.checked,
    timeNew: document.getElementById("tn")?.checked,
    playersHigh: document.getElementById("nos")?.checked
});

// Apply sorting
const sortData = (data) => {
    const { timeOld, timeNew, playersHigh } = getSortOptions();

    return [...data].sort((a, b) => {
        // players first
        if (playersHigh && a.players !== "N/A" && b.players !== "N/A") {
            const diff = b.players - a.players;
            if (diff !== 0) return diff;
        }

        // then time
        const ta = new Date(`${a.date} ${a.time}`);
        const tb = new Date(`${b.date} ${b.time}`);

        if (timeOld) return ta - tb;
        if (timeNew) return tb - ta;

        return 0;
    });
};

// Fetch data from API
const fetchStats = async () => {
    const response = await fetch("https://api.mcsrvstat.us/3/mc-central.net");
    const result = await response.json();

    const now = new Date();

    stats.unshift({
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        players: result.players?.online ?? "N/A",
        maxPlayers: result.players?.max ?? "N/A"
    });

    if (stats.length > 200) stats.length = 200;
};

// Render stats table
const renderStats = (data) => {
    const statusDiv = document.querySelector(".stats-box .status");
    statusDiv.innerHTML = "";

    if (!data.length) {
        statusDiv.textContent = "No data yet.";
        return;
    }

    const limit = getRowLimit();
    const sortedData = sortData(data);

    const table = document.createElement("table");
    table.className = "stats-table";

    const header = document.createElement("tr");
    ["Date", "Time", "Current", "Max"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
    });
    table.appendChild(header);

    sortedData.slice(0, limit).forEach(entry => {
        const row = document.createElement("tr");
        [entry.date, entry.time, entry.players, entry.maxPlayers].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    statusDiv.appendChild(table);
};

// Fetch + render
const fetchAndRenderStats = async () => {
    await fetchStats();
    renderStats(stats);
};

// Polling + checkbox wiring
document.addEventListener("DOMContentLoaded", () => {
    const statusDiv = document.querySelector(".stats-box .status");
    statusDiv.textContent = "Loading...";

    // row limit checkboxes
    const limitBoxes = ["2", "5", "20"].map(id => document.getElementById(id));
    document.getElementById("20").checked = true;

    limitBoxes.forEach(box => {
        box.addEventListener("change", () => {
            if (box.checked) {
                limitBoxes.forEach(b => b !== box && (b.checked = false));
            }
            renderStats(stats);
        });
    });

    // time sort checkboxes (mutually exclusive)
    ["to", "tn"].forEach(id => {
        const box = document.getElementById(id);
        box.addEventListener("change", () => {
            if (box.checked) {
                ["to", "tn"].forEach(o => o !== id && (document.getElementById(o).checked = false));
            }
            renderStats(stats);
        });
    });

    // players sort checkbox
    document.getElementById("nos")
        .addEventListener("change", () => renderStats(stats));

    fetchAndRenderStats();
    setInterval(fetchAndRenderStats, 5000);
});