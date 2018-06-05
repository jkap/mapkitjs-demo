(async function() {
  mapkit.init({
    authorizationCallback: done =>
      fetch("/token")
        .then(res => res.text())
        .then(done)
  });

  const el = document.getElementById("map");

  const map = new mapkit.Map(el);
  map.showsUserLocationControl = true;

  const searcher = new mapkit.Search({
    getsUserLocation: true
  });

  const search = promisify(searcher.search, searcher);

  const startLocation = (await search(
    "Apple Park Visitor Center, Cupertino, CA"
  )).places[0];

  const startCoord = startLocation.coordinate;
  const startAnnotation = new mapkit.MarkerAnnotation(startCoord, {
    color: "#54d669",
    title: startLocation.name,
    subtitle: startLocation.formattedAddress
  });

  const endLocation = (await search("1 Infinite Loop, Cupertino, CA"))
    .places[0];
  const endCoord = endLocation.coordinate;
  const endAnnotation = new mapkit.MarkerAnnotation(endCoord, {
    title: endLocation.name,
    subtitle: endLocation.formattedAddress
  });

  getDirectionsAndDrawRoute({
    origin: startCoord,
    destination: endCoord,
    map
  });

  map.showItems([startAnnotation, endAnnotation]);
})();

function promisify(func, self) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      func.bind(self)(...args, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  };
}

function getDirections(...args) {
  const directions = new mapkit.Directions();
  return promisify(directions.route, directions)(...args);
}

async function getDirectionsAndDrawRoute({ origin, destination, map }) {
  const data = await getDirections({ origin, destination });
  const route = data.routes[0];
  drawRoute(route, { map });
}

function drawRoute(route, { map }) {
  const lineStyle = new mapkit.Style({
    lineWidth: 4,
    lineJoin: "round"
  });
  const lines = route.path.map(
    points => new mapkit.PolylineOverlay(points, { style: lineStyle })
  );

  map.showItems(lines);
}
