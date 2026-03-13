export function unicodeToRgb(unicodeColor) {
    try {
        unicodeColor = unicodeColor.replace("#", "");

        var r = parseInt(unicodeColor.substring(0, 2), 16);
        var g = parseInt(unicodeColor.substring(2, 4), 16);
        var b = parseInt(unicodeColor.substring(4, 6), 16);

        return r + ", " + g + ", " + b;
    } catch {
        return 0 + ", " + 0 + ", " + 0;
    }
}

