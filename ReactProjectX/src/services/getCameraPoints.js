export default async () =>
  (await (await fetch('http://9d344f40.ngrok.io/points')).json()).map(cameraPoint => ({
    lat: cameraPoint.latitude,
    lng: cameraPoint.longitude,
    timestamp: cameraPoint.timestamp,
  }));
