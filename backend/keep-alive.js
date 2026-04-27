while (true) {
  try {
    const http = require('http');
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/',
      method: 'GET'
    };
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { console.log('Server OK:', data); });
      }
    });
    req.on('error', () => {
      console.log('Server down, restarting...');
      require('child_process').exec('node "C:\\ClinicaDental\\backend\\src\\index.js"', { cwd: 'C:\\ClinicaDental\\backend', windowsHide: true });
    });
    req.end();
  } catch(e) {}
  require('os').platform() === 'win32' ? require('os').sleep(5000) : require('os').sleep(5000);
}