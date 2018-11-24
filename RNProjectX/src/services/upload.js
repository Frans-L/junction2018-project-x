const SERVER_URL = 'http://9d885e4e.ngrok.io/img';

export const sendImage = async ({ uri, location }) => {
  const img = {
    type: 'image/jpeg',
    name: 'car.jpg',
    uri,
  };

  const body = new FormData();
  body.append('img', img);
  body.append('loc', JSON.stringify(location));

  const d = await fetch(SERVER_URL, {
    method: 'POST',
    body,
  });

  if (d.status < 200 || d.status >= 300) throw new Error(d.statusText);

  console.log('Send', d);
};
