const HIDDEN_Y = "-2.4rem";

/**
 * Keep the highlighted line in sync across several textareas.
 * Updates are coalesced into one per animation frame.
 */
export function syncLineHighlight(areas) {
    let frame = 0;
    let source = null;

    const lineHeight = () => parseFloat(getComputedStyle(areas[0]).lineHeight);

    const apply = () => {
        frame = 0;
        const { value, selectionStart } = source;
        let line = 0;
        for (let i = value.indexOf("\n"); i !== -1 && i < selectionStart; i = value.indexOf("\n", i + 1)) {
            line++;
        }
        const y = line * lineHeight() + "px";
        for (const el of areas) el.style.backgroundPositionY = y;
    };

    const schedule = (el) => {
        source = el;
        if (!frame) frame = requestAnimationFrame(apply);
    };

    const hide = () => {
        for (const el of areas) el.style.backgroundPositionY = HIDDEN_Y;
    };

    for (const el of areas) {
        el.addEventListener("focus", () => schedule(el));
        el.addEventListener("input", () => schedule(el));
        el.addEventListener("click", () => schedule(el));
        el.addEventListener("keyup", () => schedule(el));
        el.addEventListener("blur", (evt) => {
            if (!areas.includes(evt.relatedTarget)) hide();
        });
    }
}
