// ====================================================================================
// Initialization
// ====================================================================================

civilizations.sort((a, b) => a.name.localeCompare(b.name));
leaders.sort((a, b) => a.name.localeCompare(b.name));

const civilizationById = Object.fromEntries(civilizations.map(civ => [civ.id, civ]));
const leaderById = Object.fromEntries(leaders.map(leader => [leader.id, leader]));

let uniqueDomId = 0;
const presetSlotCounts = [2, 4, 6, 8, 10, 12];

function getCurrentLang() {
    if (window.getCurrentLanguage) return window.getCurrentLanguage();
    return "en";
}

function getTranslatedName(type, id, defaultName) {
    const lang = getCurrentLang();
    if (!lang || lang === "en") return defaultName;
    if (window.nameTranslations && window.nameTranslations[lang] && window.nameTranslations[lang][type] && window.nameTranslations[lang][type][id]) {
        return window.nameTranslations[lang][type][id];
    }
    return defaultName;
}

document.addEventListener("DOMContentLoaded", () => {
    function buildFilterCheckboxes(containerId, dataArray, cssClass, colorMap = null, type = null) {
        const container = document.getElementById(containerId);
        dataArray.forEach(item => {
            const label = document.createElement("label");
            label.className = "filter-checkbox";
            
            let textStyle = "";
            let boxStyle = "";
            
            if (colorMap && colorMap[item.id]) {
                if (colorMap[item.id].style) {
                    textStyle = colorMap[item.id].style;
                } else if (colorMap[item.id].color) {
                    textStyle = `color: ${colorMap[item.id].color};`;
                    boxStyle = `accent-color: ${colorMap[item.id].color};`;
                }
            }

            const labelName = type ? getTranslatedName(type, item.id, item.name) : item.name;
            label.innerHTML = `<input type="checkbox" class="${cssClass}" value="${item.id}" style="${boxStyle}" checked> <span style="${textStyle}">${labelName}</span>`;
            container.appendChild(label);
        });
    }

    function buildBanCheckboxes(containerId, dataArray, cssClass) {
        const container = document.getElementById(containerId);

        dataArray.forEach(item => {
            const label = document.createElement("label");
            const nameText = getTranslatedName(cssClass.includes('civ') ? 'civ' : 'leader', item.id, item.name);

            label.innerHTML = `
                <input type="checkbox" class="${cssClass}" value="${item.id}">
                ${nameText}
            `;

            container.appendChild(label);
        });
    }

    buildFilterCheckboxes("filter-versions", versions, "filter-version", null, 'versions');
    buildFilterCheckboxes("filter-ages", ages, "filter-age", null, 'ages');
    buildFilterCheckboxes("filter-attributes", attributes, "filter-attribute", attributeColors, 'attributes');

    buildBanCheckboxes("ban-civs", civilizations, "ban-civ");
    buildBanCheckboxes("ban-leaders", leaders, "ban-leader");

    const slotCountSelect = document.getElementById("slot-count-select");

    // Wire up compact flag buttons (if present) for language switching
    const langEnBtn = document.getElementById("lang-en");
    const langDeBtn = document.getElementById("lang-de");

    if (langEnBtn) {
        langEnBtn.addEventListener("click", () => applyLanguage("en"));
    }

    if (langDeBtn) {
        langDeBtn.addEventListener("click", () => applyLanguage("de"));
    }

    if (slotCountSelect) {
        slotCountSelect.value = String(presetSlotCounts[0]);
        slotCountSelect.addEventListener("change", (event) => {
            const targetCount = Number.parseInt(event.target.value, 10);

            if (Number.isFinite(targetCount)) {
                setSlotCount(targetCount);
            }
        });
    }

    document.addEventListener("change", (event) => {
        if (
            event.target.matches(".filter-logic-cb, .filter-version, .filter-age, .filter-attribute, .ban-civ, .ban-leader, #attr-target, #attr-logic") ||
            event.target.matches(".civ-select, .leader-select")
        ) {
            refreshAllSlotOptions();
        }
    });

    addSlot();
    addSlot();

    syncSlotCountSelector();

    applyLanguage("en");

    refreshAllSlotOptions();

    document.getElementById("add-slot-btn").addEventListener("click", () => addSlot());
    document.getElementById("roll-all-btn").addEventListener("click", rollAllSlots);
});


// ====================================================================================
// Functions
// ====================================================================================

function getCurrentFilterState(excludedSlotId = null) {
    const activeVersions = Array.from(document.querySelectorAll('.filter-version:checked')).map(cb => cb.value);
    const activeAges = Array.from(document.querySelectorAll('.filter-age:checked')).map(cb => cb.value);
    const activeAttributes = Array.from(document.querySelectorAll('.filter-attribute:checked')).map(cb => cb.value);

    const bannedCivs = Array.from(document.querySelectorAll('.ban-civ:checked')).map(cb => cb.value);
    const bannedLeaders = Array.from(document.querySelectorAll('.ban-leader:checked')).map(cb => cb.value);

    const modeRandom = document.getElementById("mode-random").checked;
    const modeHistoric = document.getElementById("mode-historic").checked;
    const modeGeografic = document.getElementById("mode-geografic").checked;
    const modeStrategic = document.getElementById("mode-strategic").checked;

    return {
        activeVersions,
        activeAges,
        activeAttributes,
        bannedCivs,
        bannedLeaders,
        attrTarget: document.getElementById("attr-target").value,
        attrLogic: document.getElementById("attr-logic").value,
        useRandomLogic: (!modeRandom && !modeHistoric && !modeGeografic && !modeStrategic) || modeRandom,
        modeHistoric,
        modeGeografic,
        modeStrategic,
        usedCivs: [],
        usedLeaders: []
    };
}

function collectUsedSelections(excludedSlotId = null) {
    const usedCivs = [];
    const usedLeaders = [];

    document.querySelectorAll(".slot-card").forEach(card => {
        if (card.id === excludedSlotId) {
            return;
        }

        const civValue = card.querySelector(".civ-select").value;
        const leaderValue = card.querySelector(".leader-select").value;

        if (civValue !== "random") {
            usedCivs.push(civValue);
        }

        if (leaderValue !== "random") {
            usedLeaders.push(leaderValue);
        }
    });

    return { usedCivs, usedLeaders };
}

function pairMatchesCurrentFilters(civ, leader, filterState) {
    if (!filterState.activeVersions.includes(civ.game_version)) return false;
    if (!filterState.activeAges.includes(civ.age)) return false;
    if (!filterState.activeVersions.includes(leader.game_version)) return false;

    if (filterState.bannedCivs.includes(civ.id)) return false;
    if (filterState.bannedLeaders.includes(leader.id)) return false;

    const civMatch = hasAttributeMatch(civ.attributes, filterState.activeAttributes, filterState.attrLogic);
    const leaderMatch = hasAttributeMatch(leader.attributes, filterState.activeAttributes, filterState.attrLogic);

    if (filterState.attrTarget === "civ" && !civMatch) return false;
    if (filterState.attrTarget === "leader" && !leaderMatch) return false;
    if (filterState.attrTarget === "either" && !civMatch && !leaderMatch) return false;
    if (filterState.attrTarget === "both" && (!civMatch || !leaderMatch)) return false;

    if (filterState.attrTarget === "combined") {
        const combinedAttrs = [...new Set([...civ.attributes, ...leader.attributes])];

        if (!hasAttributeMatch(combinedAttrs, filterState.activeAttributes, filterState.attrLogic)) {
            return false;
        }
    }

    let isMatch = false;

    if (filterState.useRandomLogic) isMatch = true;

    if (filterState.modeHistoric && historicalPairs[civ.id] && historicalPairs[civ.id].includes(leader.id)) {
        isMatch = true;
    }

    if (filterState.modeGeografic && geograficalPairs[civ.id] && geograficalPairs[civ.id].includes(leader.id)) {
        isMatch = true;
    }

    if (filterState.modeStrategic && strategicPairs[civ.id] && strategicPairs[civ.id].includes(leader.id)) {
        isMatch = true;
    }

    return isMatch;
}

function getValidLeaderIdsForCiv(civId, filterState) {
    const civ = civilizationById[civId];

    if (!civ) {
        return [];
    }

    const validLeaderIds = [];

    leaders.forEach(leader => {
        if (pairMatchesCurrentFilters(civ, leader, filterState)) {
            validLeaderIds.push(leader.id);
        }
    });

    return validLeaderIds;
}

function getValidCivIdsForLeader(leaderId, filterState) {
    const leader = leaderById[leaderId];

    if (!leader) {
        return [];
    }

    const validCivIds = [];

    civilizations.forEach(civ => {
        if (pairMatchesCurrentFilters(civ, leader, filterState)) {
            validCivIds.push(civ.id);
        }
    });

    return validCivIds;
}

function getValidCivIds(filterState, leaderValue = "random") {
    if (leaderValue !== "random") {
        return getValidCivIdsForLeader(leaderValue, filterState);
    }

    const validCivIds = [];

    civilizations.forEach(civ => {
        const validLeaderIds = getValidLeaderIdsForCiv(civ.id, filterState);

        if (validLeaderIds.length > 0) {
            validCivIds.push(civ.id);
        }
    });

    return validCivIds;
}

function getValidLeaderIds(filterState, civValue = "random") {
    if (civValue !== "random") {
        return getValidLeaderIdsForCiv(civValue, filterState);
    }

    const validLeaderIds = [];

    leaders.forEach(leader => {
        const validCivIds = getValidCivIdsForLeader(leader.id, filterState);

        if (validCivIds.length > 0) {
            validLeaderIds.push(leader.id);
        }
    });

    return validLeaderIds;
}

function refreshSlotOptions(slotCard) {
    const civSelect = slotCard.querySelector(".civ-select");
    const leaderSelect = slotCard.querySelector(".leader-select");
    const civLock = slotCard.querySelector(".civ-lock");
    const leaderLock = slotCard.querySelector(".leader-lock");

    const filterState = getCurrentFilterState(slotCard.id);
    const usedSelections = collectUsedSelections(slotCard.id);

    filterState.usedCivs = usedSelections.usedCivs;
    filterState.usedLeaders = usedSelections.usedLeaders;

    const storedCivValue = slotCard.dataset.selectedCiv || civSelect.value || "random";
    const storedLeaderValue = slotCard.dataset.selectedLeader || leaderSelect.value || "random";

    const civOptions = getValidCivIds(filterState, storedLeaderValue === "random" ? "random" : storedLeaderValue)
        .filter(civId => !filterState.usedCivs.includes(civId));

    const leaderOptions = getValidLeaderIds(filterState, storedCivValue === "random" ? "random" : storedCivValue)
        .filter(leaderId => !filterState.usedLeaders.includes(leaderId));

    const validCivSet = new Set(civOptions);
    const validLeaderSet = new Set(leaderOptions);

    civSelect.innerHTML = [
        `<option value="random">${t("randomOption")}</option>`,
        ...civOptions
            .filter(civId => civilizationById[civId])
            .map(civId => {
                const defaultName = civilizationById[civId].name;
                const label = getTranslatedName('civ', civId, defaultName);
                return `<option value="${civId}">${label}</option>`;
            })
    ].join("");

    leaderSelect.innerHTML = [
        `<option value="random">${t("randomOption")}</option>`,
        ...leaderOptions
            .filter(leaderId => leaderById[leaderId])
            .map(leaderId => {
                const defaultName = leaderById[leaderId].name;
                const label = getTranslatedName('leader', leaderId, defaultName);
                return `<option value="${leaderId}">${label}</option>`;
            })
    ].join("");

    if (storedCivValue !== "random" && validCivSet.has(storedCivValue)) {
        civSelect.value = storedCivValue;
    } else {
        civSelect.value = "random";
        civLock.checked = false;
    }

    if (storedLeaderValue !== "random" && validLeaderSet.has(storedLeaderValue)) {
        leaderSelect.value = storedLeaderValue;
    } else {
        leaderSelect.value = "random";
        leaderLock.checked = false;
    }

    slotCard.dataset.selectedCiv = civSelect.value;
    slotCard.dataset.selectedLeader = leaderSelect.value;
}

function refreshAllSlotOptions() {
    document.querySelectorAll(".slot-card").forEach(refreshSlotOptions);
}

function syncSlotCountSelector() {
    const slotCountSelect = document.getElementById("slot-count-select");

    if (!slotCountSelect) {
        return;
    }

    const currentCount = document.querySelectorAll(".slot-card").length;

    if (presetSlotCounts.includes(currentCount)) {
        slotCountSelect.value = String(currentCount);
    }
}

function setSlotCount(targetCount) {
    if (!Number.isFinite(targetCount) || targetCount < 0) {
        return;
    }

    const currentCount = document.querySelectorAll(".slot-card").length;
    const targetCardsToAdd = Math.max(0, targetCount - currentCount);
    const targetCardsToRemove = Math.max(0, currentCount - targetCount);

    for (let index = 0; index < targetCardsToAdd; index += 1) {
        addSlot({ suppressRefresh: true });
    }

    for (let index = 0; index < targetCardsToRemove; index += 1) {
        const cards = document.querySelectorAll(".slot-card");
        const lastCard = cards[cards.length - 1];

        if (!lastCard) {
            break;
        }

        lastCard.remove();
    }

    if (currentCount !== targetCount) {
        reindexSlots();
        refreshAllSlotOptions();
        syncSlotCountSelector();
    }
}

function addSlot(options = {}) {
    const suppressRefresh = options.suppressRefresh === true;
    uniqueDomId++;
    const container = document.getElementById("slots-container");

    const slotCard = document.createElement("div");
    slotCard.className = "slot-card";
    slotCard.id = `slot-id-${uniqueDomId}`;
    slotCard.dataset.rolled = "false";
    slotCard.dataset.selectedCiv = "random";
    slotCard.dataset.selectedLeader = "random";

    slotCard.innerHTML = `
        <div class="slot-title">Slot</div>
        <div class="select-group">
            <div class="select-wrapper">
                <div class="label-row">
                    <label class="civ-label">${t("civilization")}</label>
                    <label class="lock-label civ-lock-label" title="${t("lockTitle")}"><input type="checkbox" class="civ-lock"> <span class="civ-lock-text">🔒 ${t("lock")}</span></label>
                </div>
                <select class="civ-select">
                    <option value="random">${t("randomOption")}</option>
                    ${civilizations.map(c => `<option value="${c.id}">${getTranslatedName('civ', c.id, c.name)}</option>`).join('')}
                </select>
            </div>
            <div class="select-wrapper">
                <div class="label-row">
                    <label class="leader-label">${t("leader")}</label>
                    <label class="lock-label leader-lock-label" title="${t("lockTitle")}"><input type="checkbox" class="leader-lock"> <span class="leader-lock-text">🔒 ${t("lock")}</span></label>
                </div>
                <select class="leader-select">
                    <option value="random">${t("randomOption")}</option>
                    ${leaders.map(l => `<option value="${l.id}">${getTranslatedName('leader', l.id, l.name)}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="slot-actions">
            <button class="roll-single-btn btn-secondary">${t("roll")}</button>
            <button class="remove-btn btn-danger">X</button>
        </div>
    `;

    slotCard.querySelector(".civ-select").addEventListener("change", (e) => {
        slotCard.querySelector(".civ-lock").checked = (e.target.value !== "random");
        slotCard.dataset.selectedCiv = e.target.value;
        refreshAllSlotOptions();
    });

    slotCard.querySelector(".leader-select").addEventListener("change", (e) => {
        slotCard.querySelector(".leader-lock").checked = (e.target.value !== "random");
        slotCard.dataset.selectedLeader = e.target.value;
        refreshAllSlotOptions();
    });

    slotCard.querySelector(".roll-single-btn").addEventListener("click", () => rollSlot(slotCard.id));

    slotCard.querySelector(".remove-btn").addEventListener("click", () => {
        slotCard.remove();
        reindexSlots();
        refreshAllSlotOptions();
        syncSlotCountSelector();
    });

    container.appendChild(slotCard);
    reindexSlots();

    if (!suppressRefresh) {
        refreshAllSlotOptions();
        syncSlotCountSelector();
    }
}

function reindexSlots() {
    const cards = document.querySelectorAll(".slot-card");

    cards.forEach((card, index) => {
        const title = card.querySelector(".slot-title");
        title.dataset.slotNumber = String(index + 1);
        title.textContent = `${t("slot")} ${index + 1}`;
    });
}

function rollAllSlots() {
    const cards = document.querySelectorAll(".slot-card");

    cards.forEach(card => {
        if (!card.querySelector(".civ-lock").checked) {
            card.querySelector(".civ-select").value = "random";
            card.dataset.selectedCiv = "random";
        }

        if (!card.querySelector(".leader-lock").checked) {
            card.querySelector(".leader-select").value = "random";
            card.dataset.selectedLeader = "random";
        }
    });

    // NEU: Füllt die HTML-Dropdowns wieder mit allen gültigen Optionen auf,
    // da die Slots nun wieder auf "random" stehen.
    refreshAllSlotOptions();

    cards.forEach(card => rollSlot(card.id));
}

function hasAttributeMatch(attrList, activeAttributes, logic) {
    if (logic === "not") {
        return !attrList.some(attr => activeAttributes.includes(attr));
    }
    return logic === "or"
        ? attrList.some(attr => activeAttributes.includes(attr))
        : activeAttributes.every(attr => attrList.includes(attr));
}

function rollSlot(slotId) {
    const card = document.getElementById(slotId);

    const civSelect = card.querySelector(".civ-select");
    const leaderSelect = card.querySelector(".leader-select");

    const civLock = card.querySelector(".civ-lock").checked;
    const leaderLock = card.querySelector(".leader-lock").checked;

    const fixedCiv = civLock ? civSelect.value : "random";
    const fixedLeader = leaderLock ? leaderSelect.value : "random";

    const modeRandom = document.getElementById("mode-random").checked;
    const modeHistoric = document.getElementById("mode-historic").checked;
    const modeGeografic = document.getElementById("mode-geografic").checked;
    const modeStrategic = document.getElementById("mode-strategic").checked;

    const useRandomLogic =
        (!modeRandom && !modeHistoric && !modeGeografic && !modeStrategic)
        || modeRandom;

    const activeVersions = Array.from(document.querySelectorAll('.filter-version:checked')).map(cb => cb.value);
    const activeAges = Array.from(document.querySelectorAll('.filter-age:checked')).map(cb => cb.value);
    const activeAttributes = Array.from(document.querySelectorAll('.filter-attribute:checked')).map(cb => cb.value);

    const bannedCivs = Array.from(document.querySelectorAll('.ban-civ:checked')).map(cb => cb.value);
    const bannedLeaders = Array.from(document.querySelectorAll('.ban-leader:checked')).map(cb => cb.value);

    const attrTarget = document.getElementById("attr-target").value;
    const attrLogic = document.getElementById("attr-logic").value;

    const usedCivs = [];
    const usedLeaders = [];

    document.querySelectorAll(".slot-card").forEach(c => {
        if (c.id !== slotId) {
            const cCiv = c.querySelector(".civ-select").value;
            const cLeader = c.querySelector(".leader-select").value;

            if (cCiv !== "random") usedCivs.push(cCiv);
            if (cLeader !== "random") usedLeaders.push(cLeader);
        }
    });

    if (activeAttributes.length === 0) {
        alert(`${card.querySelector(".slot-title").textContent}: ${t("noAttributes")}`);
        return;
    }

    const civToValidLeaders = {};

    civilizations.forEach(civ => {

        if (fixedCiv !== "random" && civ.id !== fixedCiv) return;

        if (bannedCivs.includes(civ.id)) return;

        if (fixedCiv === "random") {
            if (!activeVersions.includes(civ.game_version)) return;
            if (!activeAges.includes(civ.age)) return;
            if (usedCivs.includes(civ.id)) return;

            if (attrTarget === "civ") {
                if (!hasAttributeMatch(civ.attributes, activeAttributes, attrLogic)) {
                    return;
                }
            }
        }

        const validLeadersForThisCiv = [];

        leaders.forEach(leader => {

            if (fixedLeader !== "random" && leader.id !== fixedLeader) return;

            if (bannedLeaders.includes(leader.id)) return;

            if (fixedLeader === "random") {
                if (!activeVersions.includes(leader.game_version)) return;
                if (usedLeaders.includes(leader.id)) return;

                if (attrTarget === "leader") {
                    if (!hasAttributeMatch(leader.attributes, activeAttributes, attrLogic)) {
                        return;
                    }
                }
            }

            const civMatch = hasAttributeMatch(civ.attributes, activeAttributes, attrLogic);
            const leaderMatch = hasAttributeMatch(leader.attributes, activeAttributes, attrLogic);

            if (attrTarget === "either") {
                // "Zivilisation oder Anführer": Es reicht, wenn einer der beiden die Bedingung erfüllt.
                // Wir werfen die Kombination also nur raus, wenn BEIDE die Bedingung verfehlen.
                if (!civMatch && !leaderMatch) return;
            }

            if (attrTarget === "both") {
                // "Zivilisation und Anführer": BEIDE müssen die Bedingung erfüllen (also hier: BEIDE ohne Militär sein).
                // Wir werfen die Kombination raus, sobald AUCH NUR EINER die Bedingung verfehlt (also das Attribut hat).
                if (!civMatch || !leaderMatch) return;
            }

            if (attrTarget === "combined") {
                const combinedAttrs = [...new Set([...civ.attributes, ...leader.attributes])];

                if (!hasAttributeMatch(combinedAttrs, activeAttributes, attrLogic)) {
                    return;
                }
            }

            let isMatch = false;

            if (useRandomLogic) isMatch = true;

            if (
                modeHistoric &&
                historicalPairs[civ.id] &&
                historicalPairs[civ.id].includes(leader.id)
            ) {
                isMatch = true;
            }

            if (
                modeGeografic &&
                geograficalPairs[civ.id] &&
                geograficalPairs[civ.id].includes(leader.id)
            ) {
                isMatch = true;
            }

            if (
                modeStrategic &&
                strategicPairs[civ.id] &&
                strategicPairs[civ.id].includes(leader.id)
            ) {
                isMatch = true;
            }

            if (isMatch || (fixedCiv !== "random" && fixedLeader !== "random")) {
                validLeadersForThisCiv.push(leader.id);
            }
        });

        if (validLeadersForThisCiv.length > 0) {
            civToValidLeaders[civ.id] = validLeadersForThisCiv;
        }
    });

    const validCivIds = Object.keys(civToValidLeaders);

    if (validCivIds.length === 0) {
        const slotName = card.querySelector(".slot-title").textContent;

        alert(`${slotName}: ${t("noCombination")}`);

        return;
    }

    const finalCivId =
        validCivIds[Math.floor(Math.random() * validCivIds.length)];

    const allowedLeaders = civToValidLeaders[finalCivId];

    const finalLeaderId =
        allowedLeaders[Math.floor(Math.random() * allowedLeaders.length)];

    if (!civLock) civSelect.value = finalCivId;
    if (!leaderLock) leaderSelect.value = finalLeaderId;
    card.dataset.selectedCiv = civSelect.value;
    card.dataset.selectedLeader = leaderSelect.value;
    card.dataset.rolled = "true";

    refreshAllSlotOptions();

    // Visuelles Feedback triggern (Animation zurücksetzen und neu starten)
    card.classList.remove("flashing");
    void card.offsetWidth; 
    card.classList.add("flashing");
}