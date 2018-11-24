export default async () =>
  (await (await fetch('http://3f894475.ngrok.io/points')).json()).map(cameraPoint => ({
    lat: cameraPoint.latitude,
    lng: cameraPoint.longitude,
    timestamp: cameraPoint.timestamp,
  }));
