var socket = io.connect('http://192.168.9.39');
//=====================================================================
//                  Create HTML for Widgets Display
//=====================================================================
//May need to be done in a templating engine server side

//=====================================================================
//                  Create HTML for Device Control
//=====================================================================
socket.on('newDevices', function (data) {
    data.forEach(element => {
        var node = document.createElement("A");
        node.setAttribute("id", element.name);                
        node.setAttribute("class", "block");
        node.setAttribute("href", "#");               
        var textnode = document.createTextNode(element.description);         
        node.appendChild(textnode);                             
        document.getElementById("ctrl-ui-btn").appendChild(node);    
    });
});
//=====================================================================
//                  Event Listener For Commands from UI
//=====================================================================
var controlEvents =document.querySelector("#ctrl-ui-btn");
controlEvents.addEventListener("click", controlEventHandler, false)
function controlEventHandler(e){
    if(e.target !== e.currentTarget){
        socket.emit('setPump', e.target.id);
    }
}
//=====================================================================
//           Event Listener For Incoming Data Updates From Server
//=====================================================================
    socket.on('newWeather', function (data) {
        document.getElementById('weatherSummary').innerHTML = data.summary;
        document.getElementById('weatherTemp').innerHTML = data.temperature;
    });
    socket.on('newPrice', function (data) {
        document.getElementById('powerPrice').innerHTML = data;     
    });