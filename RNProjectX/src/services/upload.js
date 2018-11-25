const SERVER_URL = 'http://9d344f40.ngrok.io/img';

export const sendImage = async ({ uri, location }, success, fail) => {
  const img = {
    type: 'image/jpeg',
    name: 'car.jpg',
    uri,
  };

  const body = new FormData();
  body.append('img', img);
  body.append('loc', JSON.stringify(location));

  try {
    const d = await fetch(SERVER_URL, {
      method: 'POST',
      body,
    });

    if (d.status < 200 || d.status >= 300) throw new Error(d.statusText);

    success();
  } catch (err) {
    console.log(err);
    fail(err);
  }
};
