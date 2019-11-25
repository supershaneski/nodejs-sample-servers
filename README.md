
README
==============

**Last Modified:** 2019/11/25

This project is a collection of test servers for other projects.

* HTTP server using [express](https://expressjs.com/) 
* REST server using [express](https://expressjs.com/) + JSON file.
* Web-socket using [ws](https://github.com/websockets/ws/blob/HEAD/doc/ws.md)
* HTTP server using [KoaJS](https://koajs.com)


==============

First, download and install all the modules used in the project.

### `npm install`


---

To start the HTTP server, run:

### `npm run start-http`

The HTTP server serves static files from /public folder.

It also serves files from /media folder when access from the URL,
http://localhost:9090/media.

There is also a special code to show random images from the URL,
http://localhost:9090/image.


---

To start the REST server, run:

### `npm run start-rest`

The server is using the data.json file from the /data folder to serve as the database.


---

To start the WebSocket server, run:

### `npm run start-socket`


---

To start the HTTP server using KoaJS, run:

### `npm run start-koa`

The behavior is the same as simple-http using express.


---


Open [localhost](http://localhost:3000) to view in the browser.

### `npm run eject`

**Note: [Put your note here.]**
