import { textToTree, treeToText } from "./tree.js";
import { fitHeights } from "./layout.js";
import { syncLineHighlight } from "./highlight.js";

const STORAGE_KEY = "savedTree";
const LAYOUT_KEY = "layout";

const source = document.getElementById("text");
const tree = document.getElementById("tree");
const inputs = document.getElementById("inputs");
const layoutToggle = document.getElementById("layout-toggle");
const areas = [source, tree];

let stacked = false;

function fit() {
    fitHeights(areas, !stacked);
}

function renderTree() {
    tree.value = textToTree(source.value);
    fit();
}

function renderSource() {
    source.value = treeToText(tree.value);
    fit();
}

function setStacked(value) {
    stacked = value;
    inputs.classList.toggle("inputs--stacked", stacked);
    layoutToggle.setAttribute("aria-pressed", String(stacked));
    layoutToggle.textContent = stacked ? "Side-by-side view" : "Stacked view";
    fit();
    try {
        localStorage.setItem(LAYOUT_KEY, stacked ? "stacked" : "side");
    } catch {
        // ignore
    }
}

function loadSaved() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) source.value = saved;
        setStacked(localStorage.getItem(LAYOUT_KEY) === "stacked");
    } catch {
        // storage unavailable (private mode, blocked): start empty
    }
}

function save() {
    try {
        localStorage.setItem(STORAGE_KEY, source.value);
    } catch {
        // ignore
    }
}

source.addEventListener("input", renderTree);
tree.addEventListener("input", renderSource);
layoutToggle.addEventListener("click", () => setStacked(!stacked));
addEventListener("beforeunload", save);

syncLineHighlight(areas);

loadSaved();
renderTree();
