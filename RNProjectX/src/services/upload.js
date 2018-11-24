const SERVER_URL = 'http://10.100.12.103:9999/img';

export const sendImage = async ({ uri }) => {
  const img = {
    type: 'image/jpeg',
    name: 'car.jpg',
    uri,
  };

  const body = new FormData();
  body.append('img', img);

  const d = await fetch(SERVER_URL, {
    method: 'POST',
    body,
  });

  console.log('Send', d);
};
