export default async () =>
  (await (await fetch('http://9d885e4e.ngrok.io/points')).json()).map(cameraPoint => ({
    lat: cameraPoint.latitude,
    lng: cameraPoint.longitude,
    has_car: cameraPoint.has_car,
    timestamp: cameraPoint.timestamp,
  }));
