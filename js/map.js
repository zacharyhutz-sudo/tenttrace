// 1. Set the center of your map
const map = L.map('map').setView([34.498, -83.078], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 2. Paste your Google Sheet CSV Link here
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS1_GWcMHtt84X11EiASNoSXHRXPfq3CYUSJrZAKHixKTNiBaIY4LsTlY8HxzfrLCATjfae8q6fRXk3/pub?gid=0&single=true&output=csv';

// 3. Use PapaParse to load the data
Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(site => {
            // Check if site has valid coordinates
            if(site.lat && site.lng) {
                const marker = L.marker([parseFloat(site.lat), parseFloat(site.lng)]).addTo(map);
                
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
        });
    }
});
