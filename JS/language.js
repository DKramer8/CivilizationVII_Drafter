let currentLanguage = "en";

const i18n = {
    en: {
        languageLabel: "Language",
        mainSummary: "Settings",
        randomTitle: "Draft Logic",
        randomTooltip: "Determines which civilization/leader combinations can be drafted based on selected matching rules. These rules differ from ingame prefered combinations. <br><br><b>Random:</b> No pairing restrictions.<br><b>Historic:</b> Leaders that are historically tied to the civilization. Some civilizations have no assigned leaders. Leaders can be linked to none or one single civilizations<br><b>Geographic:</b> Leaders associated with roughly the same region as the civilization. Some civilizations have no assigned leaders. Leaders can be linked to none or many civilizations.<br><b>Strategic:</b> Leaders that fit the civilization strategically. Leaders can be linked to none or many civilizations.",
        modeRandom: "Random",
        modeHistoric: "Historic",
        modeGeografic: "Geographic",
        modeStrategic: "Strategic",
        versionsTitle: "Game Versions / DLCs",
        versionsTooltip: "Filters the civilization and leader pools by owned game versions and DLC packs.",
        agesTitle: "Ages",
        agesTooltip: "Filters the civilization pool by age.",
        attributesTitle: "Attributes",
        attributesTooltip: "Filters civilizations and leaders by attribute points.<br><br><b>Filter applies to:</b><br><i>Civilization or Leader:</i> Either one must satisfy the condition.<br><i>Civilization and Leader:</i> Both must satisfy the condition.<br><i>Combined Civilization + Leader:</i> The combined attributes must satisfy the condition.<br><i>Only Civilizations:</i> Only the civilization must satisfy the condition.<br><i>Only Leaders:</i> Only the leader must satisfy the condition.<br><br><b>Condition:</b><br><i>OR:</i> At least one selected attribute must be present.<br><i>AND:</i> All selected attributes must be present. (Each civilization and leader has exactly two attributes. Select at most 2 attributes, or 4 in combined mode.)<br><i>NOT:</i> None of the selected attributes may be present.",
        attrTargetLabel: "Filter applies to:",
        attrLogicLabel: "Condition:",
        targetEither: "Civilization or Leader",
        targetBoth: "Civilization and Leader",
        targetCombined: "Combined Civilization + Leader",
        targetCiv: "Only Civilizations",
        targetLeader: "Only Leaders",
        logicOr: "OR (At least one selected attribute)",
        logicAnd: "AND (All selected attributes --> DONT SELECT MORE THAN POSSIBLE!)",
        logicNot: "NOT (None of the selected attributes)",
        bansTitle: "Bans",
        bansTooltip: "Defines which civilizations and leaders are excluded from the draft pool.",
        bansCivsTitle: "Civilizations",
        bansCivsTooltip: "Defines which civilizations are excluded from the draft pool.",
        bansLeadersTitle: "Leaders",
        bansLeadersTooltip: "Defines which leaders are excluded from the draft pool.",
        addSlot: "+ Add Slot",
        slotCountLabel: "Players",
        rollAll: "Roll All Slots",
        slot: "Slot",
        civilization: "Civilization",
        leader: "Leader",
        lock: "Lock",
        lockTitle: "Protects this selection from being overwritten when rolling",
        roll: "Roll",
        noneOption: "None",
        noAttributes: "No attributes selected!",
        noCombination: "No valid combination found!"
    },
    de: {
        languageLabel: "Sprache",
        mainSummary: "Einstellungen",
        randomTitle: "Zufallsvergabe",
        randomTooltip: "Beeinflusst den Auswahlpool der Zivilisationen und Anführer*innen basierend auf deren Kombinationsmöglichkeiten. <br><br><b>Zufällig:</b> Ohne Einschränkungen.<br><b>Historisch:</b> Anführer*innen, die nachweislich Teil der Zivilisation waren. Manche Zivilisationen haben keine Anführer*innen zugeordnet. Anführer*innen können keiner oder genau einer Zivilisation zugeordnet sein.<br><b>Geografisch:</b> Anführer*innen, die vermutlich einmal am selben geografischen Ort gewirkt haben, an dem sich die Zivilisation befindet. Manche Zivilisationen haben keine Anführer*innen zugeordnet. Anführer*innen können keiner oder mehreren Zivilisationen zugeordnet sein.<br><b>Strategisch:</b> Anführer*innen, die spielstrategisch zur Zivilisation passen. Anführer*innen koennen keinen oder mehreren Zivilisationen zugeordnet sein.",
        modeRandom: "Zufällig",
        modeHistoric: "Historisch",
        modeGeografic: "Geografisch",
        modeStrategic: "Strategisch",
        versionsTitle: "Spielversionen / DLCs",
        versionsTooltip: "Beeinflusst den Auswahlpool der Zivilisationen und Anführer*innen basierend auf den DLCs.",
        agesTitle: "Zeitalter",
        agesTooltip: "Beeinflusst den Auswahlpool der Zivilisationen basierend auf deren Zeitalter.",
        attributesTitle: "Attribute",
        attributesTooltip: "Beeinflusst den Auswahlpool der Zivilisationen und Anführer*innen basierend auf deren Attributspunkten.<br><br><b>Filter gilt für:</b><br><i>Zivilisation oder Anführer*in:</i> Die Zivilisation oder der*die Anführer*in muss die Bedingung erfüllen.<br><i>Zivilisation und Anführer*in:</i> Sowohl die Zivilisation als auch der*die Anführer*in müssen die Bedingung erfüllen.<br><i>Zivilisation und Anführer*in kombiniert:</i> Die Kombination aus Zivilisation und Anführer*in muss die Bedingung erfüllen.<br><i>Nur Zivilisationen:</i> Nur die Zivilisation muss die Bedingung erfüllen.<br><i>Nur Anführer*innen:</i> Nur der*die Anführer*in muss die Bedingung erfüllen.<br><br><b>Bedingung:</b><br><i>ODER:</i> Eines der ausgewählten Attribute muss vorhanden sein.<br><i>UND:</i> Alle gewählten Attribute müssen vorhanden sein. (Sowohl Zivilisation als auch Anführer*in haben immer genau zwei Attributspunkte. Maximal 2, bei kombiniert 4, Attribute auswählen.)<br><i>NICHT:</i> Keines der ausgewählten Attribute darf vorhanden sein.",
        attrTargetLabel: "Filter gilt für:",
        attrLogicLabel: "Bedingung:",
        targetEither: "Zivilisation oder Anführer*in",
        targetBoth: "Zivilisation und Anführer*in",
        targetCombined: "Zivilisation und Anführer*in kombiniert",
        targetCiv: "Nur Zivilisationen",
        targetLeader: "Nur Anführer*innen",
        logicOr: "ODER (Mindestens eines der gewählten Attribute)",
        logicAnd: "UND (Alle gewählten Attribute --> NICHT MEHR ALS MÖGLICH AUSWÄHLEN! )",
        logicNot: "NICHT (Keines der gewählten Attribute)",
        bansTitle: "Verbote",
        bansTooltip: "Bestimmt, welche Zivilisationen und Anführer*innen nicht in den Auswahlpool aufgenommen werden.",
        bansCivsTitle: "Zivilisationen",
        bansCivsTooltip: "Bestimmt, welche Zivilisationen nicht in den Auswahlpool aufgenommen werden.",
        bansLeadersTitle: "Anführer*innen",
        bansLeadersTooltip: "Bestimmt, welche Anführer*innen nicht in den Auswahlpool aufgenommen werden.",
        addSlot: "+ Slot hinzufügen",
        slotCountLabel: "Spieler",
        rollAll: "Alle Slots würfeln",
        slot: "Slot",
        civilization: "Zivilisation",
        leader: "Anführer*in",
        lock: "Fixieren",
        lockTitle: "Schützt vor dem Überschreiben beim Würfeln",
        roll: "Würfeln",
        noneOption: "Nichts",
        noAttributes: "Keine Attribute ausgewählt!",
        noCombination: "Keine gültige Kombination gefunden!"
    }
};

function t(key) {
    return i18n[currentLanguage][key] ?? i18n.en[key] ?? key;
}

function setElementText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function setElementHtml(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = value;
    }
}

function localizeSlotCard(slotCard) {
    const title = slotCard.querySelector(".slot-title");
    const civLabel = slotCard.querySelector(".civ-label");
    const leaderLabel = slotCard.querySelector(".leader-label");
    const civLockLabel = slotCard.querySelector(".civ-lock-label");
    const leaderLockLabel = slotCard.querySelector(".leader-lock-label");
    const civLockText = slotCard.querySelector(".civ-lock-text");
    const leaderLockText = slotCard.querySelector(".leader-lock-text");
    const rollButton = slotCard.querySelector(".roll-single-btn");

    if (title) {
        const numberText = title.dataset.slotNumber || "";
        title.textContent = numberText ? `${t("slot")} ${numberText}` : t("slot");
    }

    if (civLabel) civLabel.textContent = t("civilization");
    if (leaderLabel) leaderLabel.textContent = t("leader");

    if (civLockLabel) {
        civLockLabel.title = t("lockTitle");
    }

    if (civLockText) civLockText.textContent = `🔒 ${t("lock")}`;

    if (leaderLockLabel) {
        leaderLockLabel.title = t("lockTitle");
    }

    if (leaderLockText) leaderLockText.textContent = `🔒 ${t("lock")}`;

    if (rollButton) rollButton.textContent = t("roll");
}

function applyLanguage(lang) {
    currentLanguage = i18n[lang] ? lang : "en";
    document.documentElement.lang = currentLanguage;

    setElementText("language-label", t("languageLabel"));
    setElementText("main-summary", t("mainSummary"));
    setElementText("summary-random-title", t("randomTitle"));
    setElementHtml("summary-random-tooltip", t("randomTooltip"));
    setElementText("mode-random-label", t("modeRandom"));
    setElementText("mode-historic-label", t("modeHistoric"));
    setElementText("mode-geografic-label", t("modeGeografic"));
    setElementText("mode-strategic-label", t("modeStrategic"));
    setElementText("summary-versions-title", t("versionsTitle"));
    setElementText("summary-ages-title", t("agesTitle"));
    setElementText("summary-attributes-title", t("attributesTitle"));
    setElementText("summary-bans-title", t("bansTitle"));
    setElementText("summary-bans-civs-title", t("bansCivsTitle"));
    setElementText("summary-bans-leaders-title", t("bansLeadersTitle"));

    setElementHtml("summary-versions-tooltip", t("versionsTooltip"));
    setElementHtml("summary-ages-tooltip", t("agesTooltip"));
    setElementHtml("summary-attributes-tooltip", t("attributesTooltip"));
    setElementHtml("summary-bans-tooltip", t("bansTooltip"));
    setElementHtml("summary-bans-civs-tooltip", t("bansCivsTooltip"));
    setElementHtml("summary-bans-leaders-tooltip", t("bansLeadersTooltip"));

    setElementText("attr-target-label", t("attrTargetLabel"));
    setElementText("attr-logic-label", t("attrLogicLabel"));
    setElementText("add-slot-btn", t("addSlot"));
    setElementText("slot-count-label", t("slotCountLabel"));
    setElementText("roll-all-btn", t("rollAll"));

    const attrTarget = document.getElementById("attr-target");

    if (attrTarget) {
        attrTarget.querySelector('option[value="either"]').textContent = t("targetEither");
        attrTarget.querySelector('option[value="both"]').textContent = t("targetBoth");
        attrTarget.querySelector('option[value="combined"]').textContent = t("targetCombined");
        attrTarget.querySelector('option[value="civ"]').textContent = t("targetCiv");
        attrTarget.querySelector('option[value="leader"]').textContent = t("targetLeader");
    }

    const attrLogic = document.getElementById("attr-logic");

    if (attrLogic) {
        attrLogic.querySelector('option[value="or"]').textContent = t("logicOr");
        attrLogic.querySelector('option[value="and"]').textContent = t("logicAnd");
        attrLogic.querySelector('option[value="not"]').textContent = t("logicNot");
    }

    document.querySelectorAll(".slot-card").forEach(localizeSlotCard);
    reindexSlots();
    refreshAllSlotOptions();

    // Update flag active states if present
    const enBtn = document.getElementById("lang-en");
    const deBtn = document.getElementById("lang-de");

    if (enBtn) {
        enBtn.classList.toggle("active", currentLanguage === "en");
        enBtn.setAttribute("aria-pressed", currentLanguage === "en");
    }

    if (deBtn) {
        deBtn.classList.toggle("active", currentLanguage === "de");
        deBtn.setAttribute("aria-pressed", currentLanguage === "de");
    }
}

// expose current language to other scripts
window.getCurrentLanguage = function() {
    return currentLanguage;
};