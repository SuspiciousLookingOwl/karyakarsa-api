# Karyakarsa (WIP)

An unofficial API Wrapper for [Karyakarsa](karyakarsa)

### Example
```js
const { Client } = require("karyakarsa");
// or for ES6
import { Client } from "karyakarsa";

const client = new Client();

client.on("donation", (donation) => {
	console.log(donation);
});

client.setStreamKey("your-stream-key");
```

Example donation data:
```js
{
  id: 'db22d3bb7e716b22bd1e4e06def93fab235fcb6b',
  name: 'AKUN TEST',
  total: 15000,
  notes: 'Semangat terus yaahhhh!',
  createdAt: '2021-03-11 20:59:23'
}
```
