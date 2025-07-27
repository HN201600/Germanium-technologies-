// This script efficiently handles large text areas for searching patterns without crashing.
// It uses event delegation and optimized text processing to remain responsive even with very large inputs.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const mainText = document.getElementById('mainText');
    const patternInput = document.getElementById('pattern');
    const output = document.getElementById('output');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get the text and pattern
        const text = mainText.value;
        const pattern = patternInput.value;

        // Clear previous output
        output.innerHTML = '';

        if (!pattern) {
            output.innerHTML = '<span style="color: red;">Please enter a pattern to search.</span>';
            return;
        }

        // Use indexOf for simple substring search, or RegExp for pattern search
        // For huge texts, avoid global RegExp if possible, as it can hang.
        let count = 0;
        let locations = [];

        if (pattern.length < 500 && text.length < 1e7) { // RegExp safe for reasonable sizes
            try {
                const regex = new RegExp(pattern, 'gi');
                let match;
                while ((match = regex.exec(text)) !== null) {
                    count++;
                    locations.push(match.index);
                    // To avoid infinite loop for zero-width matches
                    if (regex.lastIndex === match.index) {
                        regex.lastIndex++;
                    }
                }
            } catch (err) {
                output.innerHTML = '<span style="color: red;">Invalid pattern.</span>';
                return;
            }
        } else { // Fallback to indexOf for very large patterns/texts
            let pos = 0;
            while (pos < text.length) {
                let idx = text.indexOf(pattern, pos);
                if (idx === -1) break;
                count++;
                locations.push(idx);
                pos = idx + pattern.length;
            }
        }

        // Display results
        if (count === 0) {
            output.innerHTML = '<span style="color: orange;">Pattern not found.</span>';
        } else {
            let locString = locations.length > 0 ? '<br/>Locations: ' + locations.slice(0, 50).join(', ') + (locations.length > 50 ? '...' : '') : '';
            output.innerHTML = `<span style="color: green;">Found <b>${count}</b> matches.</span>${locString}`;
        }
    });
});