(function() {
  mapkit.init({
    authorizationCallback: done =>
      fetch("/token")
        .then(res => res.text())
        .then(done)
  });

  const el = document.getElementById("map");

  const map = new mapkit.Map(el);
  map.showsUserLocationControl = true;

  const geocoder = new mapkit.Geocoder({
    getsUserLocation: false
  });

  const coord = new mapkit.Coordinate(37.3349, -122.00902);
  const annotation = new mapkit.MarkerAnnotation(coord, {
    title: "Apple Park",
    subtitle: "This is a sample mapkit.MarkerAnnotation",
    glyphText: "😽",
    color: "#ffffff"
  });
  map.showItems([annotation]);
})();
