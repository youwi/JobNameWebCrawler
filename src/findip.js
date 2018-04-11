/**
 * 使用WebRTC来获取电脑的IP地址
 * 支持Chrome/Firefox
 *
 * @param onNewIP
 */
function findIP(onNewIP) {
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]}),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function ipIterate(ip) {

        if (!localIPs[ip]){
            if(onNewIP)
                onNewIP(ip);
            else
                console.log(ip)
        }
        localIPs[ip] = true;
    }

    pc.createDataChannel("");

    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(ipIterate);
        });
        pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
    };
}

function addIP(ip) {
    //console.log('got ip: ', ip);
    var li = document.createElement('li');
    li.textContent = ip;
    document.getElementById("IPLeak").appendChild(li);
}
findIP(addIP);