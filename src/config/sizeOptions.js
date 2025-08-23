// sizeOptions.js

// ===== Constants =====
export const INCH_SIZE_OPTIONS = {
    sheet: [
        { width: 12, length: 18, name: "Tabloid Extra" },
        { width: 13, length: 19, name: "Super B" },
        { width: 8.5, length: 11, name: "Letter" },
        { width: 9, length: 12, name: "Letter Plus" },
        { width: 10, length: 13, name: "Letter Plus Plus" },
        { width: 11.5, length: 17.5, name: "Hemp Paper" },
        { width: 11, length: 17, name: "Tabloid" },
        { width: 14.66, length: 25, name: "Awful Oversize" }
    ],
    doc: [
        { width: 3.5, length: 4, name: "Folded Business Card" },
        { width: 4.25, length: 11, name: "Door Hanger" },
        { width: 4.25, length: 5.5, name: "Quarter Letter" },
        { width: 5, length: 7, name: "5x7" },
        { width: 5.5, length: 8.5, name: "Half Letter" },
        { width: 6, length: 9, name: "Sunrun Postcard" },
        { width: 4, length: 6, name: "Chipotle" }
    ],
    gutter: [
        { width: 0.125, length: 0.125, name: "1/8" },
        { width: 0.25, length: 0.25, name: "1/4" },
        { width: 0, length: 0, name: "No Gutter" },
        { width: 0.3125, length: 0.17, name: "Duplo 25 UP" }
    ],
    margin: [
        { width: 0.0625, length: 0.0625, name: "1/16" },
        { width: 0.25, length: 0.25, name: "1/4" },
        { width: 0.5, length: 0.5, name: "1/2" },
        { width: 0, length: 0, name: "No Margin" },
        { width: 0.125, length: 0.125, name: "1/8" }
    ]
};

// Metric equivalents in millimeters
export const MM_SIZE_OPTIONS = {
    sheet: [
        { width: 305, length: 457, name: "Tabloid Extra" },
        { width: 330, length: 483, name: "Super B" },
        { width: 216, length: 279, name: "Letter" },
        { width: 229, length: 305, name: "Letter Plus" },
        { width: 254, length: 330, name: "Letter Plus Plus" },
        { width: 292, length: 445, name: "Hemp Paper" },
        { width: 279, length: 432, name: "Tabloid" },
        { width: 372, length: 635, name: "Awful Oversize" }
    ],
    doc: [
        { width: 89, length: 102, name: "Folded Business Card" },
        { width: 108, length: 279, name: "Door Hanger" },
        { width: 108, length: 140, name: "Quarter Letter" },
        { width: 127, length: 178, name: "5x7" },
        { width: 140, length: 216, name: "Half Letter" },
        { width: 152, length: 229, name: "Sunrun Postcard" },
        { width: 102, length: 152, name: "Chipotle" }
    ],
    gutter: [
        { width: 3, length: 3, name: "1/8" },
        { width: 6, length: 6, name: "1/4" },
        { width: 0, length: 0, name: "No Gutter" },
        { width: 8, length: 4, name: "Duplo 25 UP" }
    ],
    margin: [
        { width: 2, length: 2, name: "1/16" },
        { width: 6, length: 6, name: "1/4" },
        { width: 13, length: 13, name: "1/2" },
        { width: 0, length: 0, name: "No Margin" },
        { width: 3, length: 3, name: "1/8" }
    ]
};
