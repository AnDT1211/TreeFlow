const EXTRA_HEIGHT = 20;

/**
 * Size the textareas to their content. With `equal` they all take the
 * height of the tallest one (side-by-side); otherwise each fits itself
 * (stacked). Reads and writes are batched to avoid layout thrashing.
 */
export function fitHeights(areas, equal) {
    for (const el of areas) el.style.height = "auto";
    const heights = areas.map((el) => el.scrollHeight + EXTRA_HEIGHT);
    const tallest = Math.max(...heights);
    areas.forEach((el, i) => {
        el.style.height = (equal ? tallest : heights[i]) + "px";
    });
}
