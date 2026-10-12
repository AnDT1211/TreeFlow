const BRANCH_MID = "├── ";
const BRANCH_LAST = "└── ";
const PIPE = "│   ";
const BLANK = "    ";

const SOURCE_LINE = /^(=*)([^=].*)$/;
const TREE_PREFIX = /^((?:│   |    |├── |└── )*)(.*)$/;

/**
 * Convert "=" indented text into an ASCII tree.
 * Output always has exactly one line per input line, so blank lines are
 * preserved and line N of the source matches line N of the tree.
 */
export function textToTree(source) {
    const lines = source.split(/\r?\n/);
    const out = new Array(lines.length).fill("");
    // Levels that already have a later sibling (we walk bottom-up).
    const hasNext = {};

    for (let i = lines.length - 1; i >= 0; i--) {
        const match = lines[i].match(SOURCE_LINE);
        if (match === null) continue;

        const level = match[1].length;
        const name = match[2].trim();

        let prefix = level === 0 ? "" : hasNext[level] ? BRANCH_MID : BRANCH_LAST;
        for (let l = level - 1; l > 0; l--) {
            prefix = (hasNext[l] ? PIPE : BLANK) + prefix;
        }

        out[i] = prefix + name;
        hasNext[level] = true;
        for (const key of Object.keys(hasNext)) {
            if (Number(key) > level) delete hasNext[key];
        }
    }

    return out.join("\n");
}

/** Convert an ASCII tree back into "=" indented text. */
export function treeToText(tree) {
    return tree
        .split(/\r?\n/)
        .map((line) => {
            const [, prefix, rest] = line.match(TREE_PREFIX);
            return "=".repeat(prefix.length / 4) + rest;
        })
        .join("\n");
}
