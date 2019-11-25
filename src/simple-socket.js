const WebSocket = require('ws')
var utils = require('./utils.js');

const SERVER_IP_ADDRESS = utils.getIPAddress();
const SERVER_IP_PORT = 9030;
const CLIENTS = [];

const wss = new WebSocket.Server({ port: SERVER_IP_PORT });

if(typeof wss.broadcast !== "function") {
    wss.broadcast = function( msg ) {
        this.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    }
}

wss.on('connection', (ws, req) => {
    
    //const ip = req.connection.remoteAddress;
    //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //ip = ip.replace(/^.*:/, '');  
    
    const ip = utils.getIPFromReq( req );
    const id = utils.getUniqueId2();
    CLIENTS[ id ] = ws;
    
    //console.dir(wss.clients);
    //console.log("Id: " + id);
    //for(var s in CLIENTS) {
    //    console.log("- " + s);
    //}
    
    // check
    /*
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            console.dir(client);
        }
    });
    */

    // Received message event
    ws.on('message', message => {
        
        //console.log((new Date()).toLocaleTimeString() + ` Received message => ${message}`)
        
        utils.writeLog(`Received message => ${message} from ${ip}`);
        
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send("test " + message);
            }
        });
        
        //wss.broadcast("From broadcast... " + message);
        /*for(var sId in CLIENTS) {
            if(sId !== id && (CLIENTS[sId].readyState === WebSocket.OPEN)) {
                //CLIENTS[sId].send("send from server... " + message);
                CLIENTS[sId].send(message);
            }
        }
        */
        
        /*
        for(var s in CLIENTS) {
            console.log(" - " + s + ", " + id);
            if(s !== id) {
                client = CLIENTS[s];
                if (client.readyState === WebSocket.OPEN) {
                    console.log("send message...")
                    client.send(message);
                }
            }
        }
        */

    })

    ws.on('error', error => {
        utils.writeLog("Client " + ip + " error: " + error);
    })

    ws.on('close', (ws, req) => {
        
        //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //ip = ip.replace(/^.*:/, '');  
        //const ip = utils.getIPFromReq(req);
        
        utils.writeLog("Client " + ip + " connection closed.");
        delete CLIENTS[ id ];
        
    });
    
    //console.log((new Date()).toLocaleTimeString() + " Client from " + ip + " connected.");
    
    utils.writeLog("Client from " + ip + " connected.")
    ws.send('Message From Server!! Hello ' + ip)
});

//console.log((new Date()).toLocaleTimeString() + " Server started at http://%s:%s", SERVER_IP_ADDRESS, SERVER_IP_PORT);
utils.writeLog(`Server is started at http://${SERVER_IP_ADDRESS}:${SERVER_IP_PORT}`);
