<script>
  "@hmr:keep-all";
  import 'ol/ol.css';
  import Map from "ol/Map.js";
  import View from "ol/View.js";
  import TileLayer from "ol/layer/Tile.js";
  import { onMount } from "svelte";
  import Circle from "ol/geom/Circle.js";
  import { fromLonLat } from "ol/proj.js";
  import { defaults as defaultInteractions } from "ol/interaction.js";
  import Feature from "ol/Feature.js";
  import Point from "ol/geom/Point.js";
  import VectorSource from "ol/source/Vector.js";
  import VectorLayer from "ol/layer/Vector.js";
  import Style from "ol/style/Style.js";
  import Fill from "ol/style/Fill.js";
  import Icon from "ol/style/Icon.js";
  import {Attribution,defaults as defaultControls} from 'ol/control.js';
  import OSM from "ol/source/OSM.js";
  import { browser } from "$app/environment";
  import { notifications } from "$lib/store.js";
  import { locale } from '$lib/translations';
  //https://github.com/openlayers/openlayers/issues/13114#issuecomment-994134162

  let map, view, gateways, gatewaysSource, homeFeature;

  export let minimumDistance = -1;

  onMount(async () => {
    if (!browser) return;

    gatewaysSource = new VectorSource();
    gateways = new VectorLayer({
      source: gatewaysSource,
    });
    const raster = new TileLayer({
      source: new OSM(),
    });

    //----------------------------

    homeFeature = new Feature({
      name: "Deine Addresse",
    });
    const homeStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "/images/mapmarker.png",
      }),
    });

    homeFeature.setStyle(homeStyle);

    const homeSource = new VectorSource({
      features: [homeFeature],
    });

    const homeLayer = new VectorLayer({
      source: homeSource,
    });
    //----------------------------

    //use symbol https://github.com/openlayers/openlayers/issues/10381
    //fixed radius https://stackoverflow.com/questions/52211777/draw-circles-in-openlayers-with-lat-lon-and-radius


    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(updatePositionFromBrowser);

    const attribution = new Attribution({
      collapsible: true,
    });

    view = new View({
      center: fromLonLat([9,49]),
      zoom: 5,
    });
    map = new Map({
      target: "map",
      layers: [raster, gateways, homeLayer],
      controls: defaultControls({attribution: false}).extend([attribution]),
      view,
      interactions: defaultInteractions({
        doubleClickZoom: true,
        dragAndDrop: false,
        dragPan: true,
        keyboardPan: true,
        keyboardZoom: true,
        mouseWheelZoom: false,
        pointer: false,
        select: false,
      }),
    });
  });

  async function updatePositionFromBrowser(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    await updatePosition({ lat, lon,markCenter:true,ignoreDistance:true });
  }

  export async function updatePosition({ lat, lon, markCenter,ignoreDistance }) {
    const coords = [lon, lat];
    var position = fromLonLat(coords);
    view.setCenter(position);
    view.setZoom(14);
    minimumDistance=-1;

    if (markCenter) {
      homeFeature.setGeometry(new Point(position));
    }
    console.log(lat,lon);

      // let heliumGateways = await fetch(`http://localhost:8001/disposal_sites?lat=${lon}&long=${lat}&radius=10000&bins=recycling_yard`);
      let heliumGateways = await fetch(`http://localhost:8001/disposal_sites?lat=${lon}&long=${lat}&radius=10000`);
      // gatewaysSource.clear();
      try {
        if (heliumGateways.status == 200) {
          heliumGateways = await heliumGateways.json();
    
          const heliumGatewaysArray = [];
          console.log(heliumGateways);
          heliumGateways.forEach((gateway) => {
          //   //gateway.distance, gateway.gain, gateway.elevation
          //   if (gateway.status.online != "online") return;
          //   if (!ignoreDistance && (minimumDistance == -1 || gateway.distance < minimumDistance)) minimumDistance = gateway.distance;
    
            const coords = fromLonLat([gateway.location.lat, gateway.location.lang]);
            // const heliumGatewayFeature = new Feature({
            //   geometry: new Circle(coords, 1000),
            // });
            const heliumGatewayFeature = new Feature({
            });
  
            heliumGatewayFeature.setStyle(new Style({
              image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: "fraction",
                anchorYUnits: "pixels",
                src: "/icons/small/"+gateway.bins[0]+".png",
              }),
            }));
            
            heliumGatewayFeature.setGeometry(new Point(coords));
  
            // heliumGatewayFeature.setStyle(
            //   new Style({
            //     fill: new Fill({
            //       color: [10, 207, 131, 1],
            //     }),
            //   })
            // );
            heliumGatewaysArray.push(heliumGatewayFeature);
          });
          
          console.log(heliumGatewaysArray);
          gatewaysSource.addFeatures(heliumGatewaysArray);
        }
      } catch (err) {
        console.log(err);
      }


    if(!ignoreDistance && minimumDistance==-1) minimumDistance=10000;
  }

</script>

<div id="map" class="w-full map" />

<style lang="scss">
  .map {
    height: 55vh;
  }
</style>
