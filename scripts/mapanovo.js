var CartoDB_Positron = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  );
  
let map = L.map(document.getElementById("propertyMap"), {
    attributionControl: false,
    gestureHandling: true,
    zoomSnap: 0.1,
}).setView([localizacaoAtual.lat, localizacaoAtual.lng], 12).addLayer(CartoDB_Positron);
let AtualBounds = map.getBounds();
AtualBounds = AtualBounds.getNorth() + "," + AtualBounds.getWest() + "," + AtualBounds.getSouth() + "," + AtualBounds.getEast();

map.on("moveend", () => {
    let bounds = map.getBounds();
    bounds =
        bounds.getNorth() +
        "," +
        bounds.getWest() +
        "," +
        bounds.getSouth() +
        "," +
        bounds.getEast();

    populateMarkers(bounds);
});
  
let allMarkers = {};
  
function populateMarkers(bounds) {
    return fetch(
      "https://api.waqi.info/map/bounds/?latlng=" + bounds + "&token=e19416fb4d02cb742d10908aff9fd86ec1a5255b"
    )
      .then((x) => x.json())
      .then((stations) => {
        if (stations.status != "ok") throw stations.reason;
  
        stations.data.forEach((station) => {
          if (allMarkers[station.uid]) map.removeLayer(allMarkers[station.uid]);
  
          let iw = 83,
            ih = 107;
          let icon = L.icon({
            iconUrl: "https://waqi.info/mapicon/" + station.aqi + ".30.png",
            iconSize: [iw / 2, ih / 2],
            iconAnchor: [iw / 4, ih / 2 - 5],
          });
  
          let marker = L.marker([station.lat, station.lon], {
            zIndexOffset: station.aqi,
            title: station.station.name,
            icon: icon,
          }).addTo(map);
  
          marker.on("click", () => {
            console.log("click");
            let popup = L.popup()
              .setLatLng([station.lat, station.lon])
              .setContent(station.station.name)
              .openOn(map);
  
            getMarkerAQI(station.uid).then((aqi) => {
              let details = "";
              console.log(aqi);
              for (specie in aqi.iaqi) {
                details += "<b>" + specie + "</b>:" + aqi.iaqi[specie].v + " ";
              }

              if (aqi.aqi <= 50) {
                cor = " color: green";
                extenso = "Bom";
              } else if(aqi.aqi <= 150) {
                cor = " color: orange";
                extenso = "Moderado";
              } else {
                cor = " color: red";
                extenso = "Perigoso";
              }

              let nomeCidade = aqi.city.name.split(',');

              console.log(nomeCidade);

              let layout = '<div id="content">' +
              '<h3 id="firstHeading" class="firstHeading" style="text-align:center">' + nomeCidade[0] + '</h3>' +
              '<h4 style="text-align:center">' + nomeCidade[1] + ' - ' + nomeCidade[2] + '</h4>' +
              '<hr>' +
              '<div id="bodyContent">' +
                '<p style="font-size:20px"> Qualidade do Ar: <b style="'+ cor +'; font-size: 20px !important;">' + extenso + '</b></p>' +
                '<p style="font-size:18px"> Temperatura: <b style="font-size: 18px !important;">' + aqi.iaqi.t.v + '</b></p>' +
                '<p style="font-size:18px"> Umidade: <b style="font-size: 18px !important;">' + aqi.iaqi.h.v + '</b></p>' +
              '</div>'

              popup.setContent(layout);
            });
          });
  
          allMarkers[station.uid] = marker;
        });
  
        return stations.data.map(
          (station) => new L.LatLng(station.lat, station.lon)
        );
      });
  }
  
  function getMarkerAQI(markerUID) {
    return fetch(
      "https://api.waqi.info/feed/@" + markerUID + "/?token=e19416fb4d02cb742d10908aff9fd86ec1a5255b"
    )
      .then((x) => x.json())
      .then((data) => {
        if (data.status != "ok") throw data.reason;
        return data.data;
      });
  }
  
  populateMarkers(AtualBounds).then((bounds) => {
    map.fitBounds(bounds, { maxZoom: 12, paddingTopLeft: [0, 40] });
  });