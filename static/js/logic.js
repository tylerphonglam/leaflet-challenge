// Create a Leaflet map
const map = L.map('map').setView([35, -100], 5); // Set the initial map center and zoom level

// Add a base map layer (you can choose your preferred map provider)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data from USGS GeoJSON feed
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    // Loop through the earthquake features and create markers on the map
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
      const place = feature.properties.place;

      // Create a circle marker with size based on magnitude and color based on depth
      L.circleMarker([coordinates[1], coordinates[0]], {
        radius: magnitude * 5, // Adjust the scale factor as needed
        fillColor: getColor(depth),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      })
        .bindPopup(`Location: ${place}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`)
        .addTo(map);
    });
  })
  .catch(error => console.error('Error fetching data:', error));

// Define a function to calculate the color based on depth
function getColor(depth) {
  const colors = ['#00ff00', '#ffff00', '#ff9900', '#ff6600', '#ff0000']; // Green to Red gradient
  if (depth < 10) return colors[0];
  if (depth < 30) return colors[1];
  if (depth < 50) return colors[2];
  if (depth < 70) return colors[3];
  return colors[4];
}

// Create a legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const levels = ["<10", "10-30", "30-50", "50-70", "70+"];
  const colors = ['#00ff00', '#ffff00', '#ff9900', '#ff6600', '#ff0000']; // Define earthquake colors

  // Generate legend content
  div.innerHTML = '<strong>Depth (km)</strong><br>';
  for (let i = 0; i < levels.length; i++) {
    div.innerHTML +=
      `<i style="background:${colors[i]}"></i>${levels[i]}<br>`;
  }

  return div;
};

legend.addTo(map);

// Define a function to calculate the earthquake level based on magnitude
function getEarthquakeLevel(magnitude) {
  if (magnitude < 3.0) {
    return "Minor";
  } else if (magnitude < 4.0) {
    return "Light";
  } else if (magnitude < 5.0) {
    return "Moderate";
  } else if (magnitude < 6.0) {
    return "Strong";
  } else {
    return "Major";
  }
}
