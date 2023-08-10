const cols = document.querySelectorAll('.col');

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.code.toLowerCase() === 'space') {
        setRandomColors();
    }
});

document.addEventListener('click', (event) => {
    const type = event.target.dataset.type;

    if (type === 'lock') {
        const node =
            event.target.tagName.toLowerCase() === 'i'
                ? event.target
                : event.target.children[0];

        node.classList.toggle('fa-lock-open');
        node.classList.toggle('fa-lock');
    } else if (type === 'copy') {
        copyToClickboard(event.target.textContent);
    }
});

function gerenerateRandomColor() {
    // Generate a random hexadecimal color code.
    const hexCodes = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
    }
    return '#' + color;
}

function copyToClickboard(text) {
    // Copies the specified text to the clipboard.
    return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial) {
    // Set random colors for each column.
    const colors = isInitial ? getColorsFromHash() : [];

    cols.forEach((col, index) => {
        // Get the current state of the column.
        const isLocked = col.querySelector('i').classList.contains('fa-lock');
        const text = col.querySelector('h2');
        const button = col.querySelector('button');

        // If the column is locked, add the current color to the colors array and return.
        if (isLocked) {
            colors.push(text.textContent);
            return;
        }

        // Generate a random color.
        const color = isInitial
            ? colors[index]
                ? colors[index]
                : chroma.random()
            : chroma.random();

        // Add the random color to the colors array.
        colors.push(color);

        // Set the text content and background color of the column.
        text.textContent = color;
        col.style.background = color;

        // Set the text color of the column.
        setTextColor(text, color);
        setTextColor(button, color);
    });

    // Update the colors hash.
    updateColorsHash(colors);
}

function setTextColor(text, color) {
    // Set the text color of the specified element to the specified color.
    const luminance = chroma(color).luminance();

    // Set the text color to black if the luminance is greater than or equal to 0.5, or white otherwise.
    text.style.color = luminance >= 0.5 ? 'black' : 'white';
}

function updateColorsHash(colors = []) {
    // Convert the colors array to a string of comma-separated hexadecimal color codes.
    const colorsString = colors
        .map((col) => {
            return col.toString().substring(1);
        })
        .join('-');

    // Update the colors hash in the URL.
    document.location.hash = colorsString;
}

function getColorsFromHash() {
    // Get the colors hash from the URL.
    const hash = document.location.hash;

    // If the hash is empty, return an empty array.
    if (!hash) {
        return [];
    }

    // Split the hash into an array of hexadecimal color codes.
    const colors = hash.substring(1).split('-');

    // Return the array of hexadecimal color codes.
    return colors.map((col) => {
        return '#' + col;
    });
}

setRandomColors(true);