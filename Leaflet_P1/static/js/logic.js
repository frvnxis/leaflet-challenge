// All Earthquakes from 7 days on USGS

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get marker color based on earthquake depth
function getColor(depth) {
    if (depth >= 90) {
        return "red" 
    } else {
        if (depth > 70) {
            return "orangered"
        } else {
            if (depth > 50) {
                return "orange"
            } else {
                if (depth > 30) {
                    return "gold"
                } else {
                    if (depth > 10) {
                        return "yellow"
                    } else {
                        return "lightgreen"
                    }
                }
            }
        }
    }
};

// Declare function to create map features.
function createFeatures(earthquakeData) {
    // Create popup layers using earthquake title, type and magnitude
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>Location: " + feature.properties.place + "</p>" +
            "<p>Depth: " + feature.geometry.coordinates[2] + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>");
    }
    //Create circle markers for each earthquake in the data set.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make circle radius dependent on the magnitude and get color based on the depth
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillOpacity: 1,
                color: getColor(feature.geometry.coordinates[2])
            })
        },
        // Append popups on each feature
        onEachFeature: onEachFeature
    });
    // Call create map function using the earthquakes data
    createMap(earthquakes);
};

// Declare function to create map
function createMap(earthquakes) {
    // Get initial light layer
    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 15,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
    // Declare map object and set it to the map element in the DOM
    var myMap = L.map("map", {
        center: [29.876019, -107.224121],
        zoom: 4,
        layers: [mapLayer, earthquakes]
    });
    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "lightgreen",
            "yellow",
            "gold",
            "orange",
            "orangered",
            "red"];
        var labels = [];

        var legendInfo = "<h1>Earthquake Depth<h1>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">90+</div>" +
                "<div class=\"fourth\">70-90</div>" +
                "<div class=\"third\">50-70</div>" +
                "<div class=\"second\">30-50</div>" +
                "<div class=\"first\">10-30</div>" +
                "<div class=\"min\"><10</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(myMap);

};

// Get earthquakes data
d3.json(url, function(data) {
    // Create features with the earthquakes data
    createFeatures(data.features)
});