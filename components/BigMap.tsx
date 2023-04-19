import { useState, useEffect } from "react";
// import * as React from "react";
import Map, {
  Source,
  Layer,
  Popup,
} from "react-map-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleMatchMediaChange = (e) => {
    setDarkMode(!!e.matches);
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    setDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", handleMatchMediaChange);

    return () => matchMedia.removeEventListener("change", handleMatchMediaChange);
  }, []);

  return darkMode;
};

function BigMap() {
  const darkMode = useDarkMode();

  const [items, setItems] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [popup, setPopup] = useState(null);

  const load = (bounds) => {
    let url = "https://streetlife.bustimes.org/map_data?bbox=";
    url += `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`

    fetch(url).then((response) => {
      response.json().then((items) => {
        setItems(items);
      });
    }, (boo) => {
      // debugger;
    });
  };

  const handleMoveEnd = (evt) => {
    if (evt.viewState.zoom > 10) {
      load(evt.target.getBounds());
    }
  };

  const handleLoad = (evt) => {
    if (evt.target.getZoom() > 10) {
      load(evt.target.getBounds());
    }
  };

  const handleMouseEnter = (evt) => {
    setCursor("pointer");
    setPopup({
      lngLat: evt.lngLat,
      features: evt.features
    });
  };

  const handleMouseLeave = (evt) => {
    setCursor(null);
    setPopup(null);
  };

  return (
    <Map
      initialViewState={{
        zoom: 10,
        latitude: 52.5,
        longitude: 1,
      }}
      hash={true}
      onMoveEnd={handleMoveEnd}
      onLoad={handleLoad}
      onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      interactiveLayerIds={["points", "polygons"]}
      cursor={cursor}
      mapLib={maplibregl}
      mapStyle={"https://tiles.stadiamaps.com/styles/alidade_smooth" + (darkMode ? "_dark" : "") + ".json"}
      style={{
        position: "absolute",
        top: 56,
        bottom: 0,
        height: "auto",
      }}
      RTLTextPlugin=""
    >
      <Source type="geojson" data={items}>
        <Layer id="points" type="circle" filter={["==", "$type", "Point"]}
          paint={{
            "circle-color": "#FE83CC",
            "circle-radius": 4,
          }}
        />
        <Layer id="polygons" type="line"
          paint={{
            "line-width": 4,
            "line-color": "#FE83CC"
          }}
        />
      </Source>
      { popup ?
        <Popup latitude={popup.lngLat.lat} longitude={popup.lngLat.lng} onClose={() => setPopup(null)} closeButton={false}>
          {popup.features.map(feature => {
            return (
              <div key={feature.properties.reference}>
                <a href={`https://roadworks.me.uk/${feature.properties.reference}`}>
                  {feature.properties.reference}
                </a>
              </div>
            )
          })}
        </Popup> : null }
    </Map>
  );
}

export default BigMap;
