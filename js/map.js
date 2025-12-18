const map = L.map('map').setView([34.498, -83.078], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

fetch('data/campsites.geojson')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                layer.bindPopup(feature.properties.name);
                layer.on('click', () => updateSidebar(feature.properties));
            }
        }).addTo(map);
    });

function updateSidebar(props) {
    const container = document.getElementById('site-list');
    container.innerHTML = `
        <div class="site-card">
            <img src="${props.image}" alt="${props.name}">
            <h3>${props.name}</h3>
            <p>${props.desc}</p>
            <p><strong>Size:</strong> ${props.size}</p>
            <p class="price">${props.price}</p>
        </div>
    `;
}
