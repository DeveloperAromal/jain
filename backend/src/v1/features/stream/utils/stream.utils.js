import fetch from "node-fetch";

export async function streamVideo({ videoUrl, range, res }) {
  const headers = range ? { Range: range } : {};

  const response = await fetch(videoUrl, { headers });

  res.status(response.status);

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  response.body.pipe(res);
}
