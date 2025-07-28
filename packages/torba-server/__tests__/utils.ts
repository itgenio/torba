import http from 'http';

const url = 'http://localhost:3075/';

export async function makeRequest(method: string, path: string = '', data: any = {}) {
  const targetUrl = url + path;

  console.log(`make request to ${targetUrl}`);

  const rawData = JSON.stringify(data);

  const options = {
    host: 'localhost',
    port: 3075,
    path: '/' + path,
    method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': rawData.length,
    },
  };

  return new Promise<{ success: true; result: any } | { success: false; error?: string; message?: string }>(
    (resolve, reject) => {
      const req = http.request(options, res => {
        res.setEncoding('utf8');

        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', error => reject(error));

      req.write(rawData);

      req.end();
    }
  );
}
