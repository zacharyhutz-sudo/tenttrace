// 1. Initialize the map
// We start with a zoomed-out view of the US since we don't know the park yet
const map = L.map('map').setView([39.8283, -98.5795], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Get the user's search query from the URL (e.g., map.html?q=Tugaloo)
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get('q') ? params.get('q').toLowerCase().trim() : "";

// Update the sidebar header to show what we are looking at
if(searchQuery) {
    document.querySelector('.sidebar-header h2').innerText = params.get('q'); // Display original casing
}

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS1_GWcMHtt84X11EiASNoSXHRXPfq3CYUSJrZAKHixKTNiBaIY4LsTlY8HxzfrLCATjfae8q6fRXk3/pub?gid=0&single=true&output=csv';

// 3. Load and Filter Data
Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function(results) {
        const markers = []; // Array to store markers for auto-zooming

        results.data.forEach(site => {
            // SAFEGUARD: Ensure site has coordinates and a park name
            if(site.lat && site.lng && site.park) {
                
                // NORMALIZE: Clean up strings for comparison
                const siteParkName = site.park.toLowerCase().trim();

                // LOGIC: Check if the site's park name includes the search query
                // Using 'includes' allows "Tugaloo" to find "Tugaloo State Park"
                if(siteParkName.includes(searchQuery)) {
                    
                    const marker = L.marker([parseFloat(site.lat), parseFloat(site.lng)]).addTo(map);
                    markers.push(marker); // Add to our list

                    // Add click event
                    marker.on('click', () => {
                        const container = document.getElementById('site-list');
                        container.innerHTML = `
                            <div class="site-card">
                                <img src="${site.image}" style="width:100%; border-radius:8px;">
                                <h3>${site.name}</h3>
                                <p>${site.description}</p>
                                <p><strong>Size:</strong> ${site.size}</p>
                                <p class="price" style="color:#E67E22; font-weight:bold;">${site.price}</p>
                            </div>
                        `;
                    });
                }
            }
        });

        // 4. Auto-Zoom Logic
        if (markers.length > 0) {
            // Create a feature group from markers to calculate boundaries
            const group = L.featureGroup(markers);
            // Fit map to show all markers with some padding
            map.fitBounds(group.getBounds(), {padding: [50, 50]});
        } else {
            // Optional: Alert if no parks match
            console.log("No parks found matching: " + searchQuery);
        }
    }
});
