
function socketProxy(targetIP,targetPort,localPort){
    var net = require('net');
    return net.createServer((client)=>{
        var target = new net.Socket();
        target.connect(targetPort,targetIP);
    
        client.on('data',msg=>{
            target.write(msg);
        }).on('error',err=>{
            Error.captureStackTrace(err);
            console.error('client connect:',err);
        }).on('close',()=>{
            target.destroy();
            console.log('client is closed');
        });
        target.on('data',msg=>{
           client.write(msg); 
        }).on('error',err=>{
            Error.captureStackTrace(err);
            console.error('target server:',err);
        }).on('close',()=>{
            client.destroy();
            console.log('target is closed!');
        })
    }).listen(localPort);
};
module.exports = socketProxy;
if(require.main == module){
    //node socketproxy.js -t 192.168.0.214:3389 -p 6666
    var target = process.argv[process.argv.indexOf('-t') + 1].split(':');
    var port = process.argv[process.argv.indexOf('-p') + 1];
    socketProxy(target[0],parseInt(target[1],parseInt(port)));
}
