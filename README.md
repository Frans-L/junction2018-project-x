# TrePark Live

One of the most frustrating things in cities is to find a free parking slot. Fortunately, we have solution for the problem!

TrePark Live is a service that shows free parking spots on a map. The service is using the live video feed of the dash cams of the public transport. It recognizes the free parkings slots on real-time and draws them on a map.

In 48 hours, we have built a mobile app that functions as a dash cam. It films the road, and sends the video and its current location to a server. The server detects cars with Google Vision API, and updates the info to a map. Our website that is during the competition http://trepark.live draws the free parking spots over OpenStreetMaps on real-time.

Note: After the competition the website won't be anymore running.

## Demo

Car detection:
<p align="center">
  <img src="https://github.com/Frans-L/junction2018-project-x/blob/master/media/detection.png?raw=true" alt="Car detection"/>
</p>

The map updates on real-time, when a buss (in our demo, our car) drives next to parking slots.

<p align="center">
  <img src="https://github.com/Frans-L/junction2018-project-x/blob/master/media/map.gif?raw=true" alt="Map updates on real-time"/>
</p>

## Future

The project was built in 48 hours during the Junction 2018.

If you are interested in the project, feel free to contact us :)

## Techonologies

- React (frontend)
- React Native (dash cam)
- Python + Google vision (backend)

