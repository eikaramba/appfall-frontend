import { json as json$1 } from '@sveltejs/kit';

export async function GET({ url }) {
  if (!url.searchParams.get("address")) return new Response(undefined, { status: 404 });

  const address = encodeURIComponent(url.searchParams.get("address"));



  let position = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${address}&limit=5&countrycodes=de&format=json&addressdetails=1`
  ,{headers:{'user-agent':'Appfall Backend Server'}});
  if (position.status == 200) {
    try {
      position = await position.json();
      position.forEach(feature => {
        feature.longitude = feature.lon;
        feature.latitude = feature.lat;
      });
      if (position.length > 0)
        return json$1({ data: position });
    } catch (e) {console.error(e)}
  }

  //not working good
  // position = await fetch(
  //   `http://api.positionstack.com/v1/forward?access_key=571ffdc2d98d29a3ca20544d458fadf2&query=${address}&limit=5&fields=results.latitude,results.longitude,results.label,results.confidence,results.country_code&country=DE`
  // );

  // if (position.status == 200) {
  //   try {
  //     position = await position.json();
  //     if (position.data.length > 0)
  //       return {
  //         status: 200,
  //         body: { data: position.data },
  //       };
  //   } catch (e) {}
  // }

  //Fallback to mapbox
  position = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?country=DE&limit=5&access_token=pk.eyJ1IjoiZWlrYXJhbWJhIiwiYSI6ImNreGhxNGRxaTV3c20yeGxhaDFuc3I0ZGcifQ.I3iMtVqJbHFg0aR5OADtJw`
  );
  if (position.status == 200) {
    try {
      position = await position.json();
      position.features.forEach(feature => {
        feature.longitude = feature.center[0];
        feature.latitude = feature.center[1];
        feature.confidence = feature.relevance;
      });
      if (position.features.length > 0)
        return json$1({ data: position.features });
      } catch (e) {console.error(e)}
  }

  //Fallback to
  //https://developer.tomtom.com/store/maps-api
  //https://developer.tomtom.com/search-api/documentation/geocoding-service/geocode

  //https://developer.here.com/c/geocoding

  //https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/?redirectedfrom=MSDN


  return new Response(undefined, { status: 404 });
}
