export default async () => {
  const cameraPoints = (await (await fetch('http://9d344f40.ngrok.io/points')).json()).map(
    cameraPoint => ({
      lat: cameraPoint.latitude,
      lng: cameraPoint.longitude,
      cars: cameraPoint.cars.length,
      speed: cameraPoint.speed,
      timestamp: cameraPoint.timestamp,
    }),
  );
  const highPassCameraPoints = [];
  let latestCP = { timestamp: 0 };
  cameraPoints.forEach((cp, i) => {
    if (cp.timestamp - latestCP.timestamp > 4) {
      highPassCameraPoints.push(cp);
      latestCP = cp;
    }
  });
  return highPassCameraPoints.filter(cp => cp.cars > 0).filter(cp => cp.speed > 5);
};
