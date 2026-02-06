$(document).ready(function() {
    lastPress = new Date();

    // loopOverReferents();
    if(localStorage.getItem("VPID") == null){
        localStorage.setItem("VPID", 1);
    }

    $('#VPNR').val(localStorage.getItem("VPID"));

    var devices;
    getCameras();

    $(document).on("keyup", function(event) {
        if (event.key == ' ' || event.key == 'Enter' || event.key == "ArrowRight") {
            event.preventDefault();
            now = new Date();
            if(now.getTime() - lastPress.getTime() > 1000){
                // console.log(now.getTime() - lastPress.getTime());
                $('button:visible').click();
                lastPress = now;
            } else {
                console.log("Button Press below Threshold")
            }
        }
        if (event.key == 'i') {
            startRecording(true);
        }
        if (event.key == 'o') {
            stopRecording();
        }
    });

});

// Duration and Loops
const countdown = 3; 	// in seconds 
var countdowncounter; 	// temp für iteration
var countdowninterval;	// interval 
var dur; 				// duration for each referentImage, defaults to 3000
var numLoops; 			// number of Loops per Referent
var loopCounter; 		// temp für iteration

// Image Sequence
var refIndex;
var imgIndex;
var deviceIndex = 0;
var vpid = 0;
var TEMPvpid = 0;
var imgs;
var interval;

// Camera Streams
var streams = []; 			// contains streams for each camera
let mediaRecorders = [];	// contains recorders for each stream
let audioRecorder;          // Recorder for Audio
const lut = {}; 			// Look-Up-Table for Camera Labels and Ids

// Devices
var devices; // für aktuelle VP benutze Gerätereihenfolge
var deviceOrder = [
	["basis", "vertikal", "konvex", "kreis", "horizontal", "konkav"],
	["vertikal", "kreis", "basis", "konkav", "konvex", "horizontal"],
	["kreis", "konkav", "vertikal", "horizontal", "basis", "konvex"],
	["konkav", "horizontal", "kreis", "konvex", "vertikal", "basis"],
	["horizontal", "konvex", "konkav", "basis", "kreis", "vertikal"],
	["konvex", "basis", "horizontal", "vertikal", "konkav", "kreis"]
];

// Referents
var referentOrder = [
    [0, 1, 3, 4, 5, 2],
	[1, 4, 0, 2, 3, 5],
	[4, 2, 1, 5, 0, 3],
	[2, 5, 4, 3, 1, 0],
	[5, 3, 2, 0, 4, 1],
	[3, 0, 5, 1, 2, 4]
];

const refLabels = {
	0: "move",
	1: "rotate",
	2: "zoom",
	3: "select",
	4: "turnon",
	5: "duplicate"
}

var referents = [ // noch sequentiell — als key/value paar umsetzen mit referentname in dateinamen + ordnungszahlen
    // also z.B. 
    // VP_12_c1_d2_undo_od1or1 [c = cam, d = device,  od = order device, or = order referent]
    ["0.png", "1.png"], // 0 = move
    ["0.png", "1.png"], // 1 = rotate
    ["0.png", "1.png"], // 2 = zoom
    ["0.png", "1.png"], // 3 = single select
    ["0.png", "1.png"], // 4 = turn on
    ["0.png", "1.png"]  // 5 = duplicate
];

function loopOverReferents(){
    console.log(`VP;Device;Referent;Match;Perform`)
    for (let i = 1; i<30; i++) {
        let order = getOrderNumber(i);
        let loopdevices = deviceOrder[order-1];
        for (let j = 0; j < 6; j++) {
            loopdevice = loopdevices[j];
            devReferents = referentOrder[j];
            for (let k = 0; k < 6; k++) {
                let referent = refLabels[devReferents[k]];
                console.log(`${i};${loopdevice};${referent};;`);
            }
        }
    }
}

function incrementVP(){
    vpid++;
    localStorage.setItem("VPID", vpid);
};


function sleep(ms) { // weiß nicht ob die klappt, via https://www.sitepoint.com/delay-sleep-pause-wait/
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startStudy() {
    refDur = $('#refDur').val();
    dur = (refDur > 0) ? refDur * 1000 : 2000;
    
    numLoops = ($('#refLoops').val() != '')? $('#refLoops').val(): 2;

    vpid = $('#VPNR').val();
    TEMPvpid = vpid;
    orderNr = getOrderNumber(vpid);
    devices = deviceOrder[orderNr-1];

    
    $('.intro').hide();
    $('.videobox').hide();
    changeDevice();
}

function changeDevice() {
	$('#deviceName').html(devices[deviceIndex]);
	$('.changeDevice').show();
}

function startReferents() {
	$('.changeDevice').hide();
	refIndex = 0;
    startCountdown();	
}

function getOrderNumber(id) {
	vp = id;
	if (vp > 6) {
		while(vp > 6) {
			vp -= 6;
		}
		return vp;
	} else {
		return vp;
	}
}

function startCountdown() {
    $('.devicephase').hide();
    $('.videobox').hide();
    countdowncounter = countdown;
    loopCounter = numLoops;

    setTimeout(showReferents, (countdown + 1) * 1000);

    showCountdown();
    countdowninterval = setInterval(showCountdown, 1000);
}

function showCountdown() {
    $("#countdown").html(countdowncounter);
    $("#countdown").show();
    if (countdowncounter < 0) {
        $("#countdown").hide();
        clearInterval(countdowninterval);
    }
    countdowncounter--;
}

function showReferents() {
    $('.referentdiv').show(); //"fast");
    refSrc = referents[referentOrder[deviceIndex][refIndex]];
    imgIndex = 0;
    totalDur = dur * refSrc.length;
    imgs = refSrc;

    $('#progressOutline').show('fast');
    $('#progressBar').stop(true).css({ width: 0 });

    $('#progressBar').animate({
        width: "100%"
    }, totalDur, "linear");

    showImg();
    interval = setInterval(showImg, dur);
}


function showImg() {
    if (imgIndex < imgs.length) {
        console.log('showing ref/' + referentOrder[deviceIndex][refIndex] + '/' + imgs[imgIndex]);
        $("#referent").attr('src', 'ref/' + referentOrder[deviceIndex][refIndex] + '/' + imgs[imgIndex]);
        imgIndex++;
        $("#referent").show();
    } else {
        console.log("Bilder Fertig, checke Loop");
        clearInterval(interval);
        if (loopCounter > 0) {
            console.log(loopCounter);
            console.log("intervall: " + interval);
            showReferents();
            loopCounter--;
            $(".skipButton").fadeIn('slow');
        } else {
            console.log("Loop Fertig, zeige Vorschau");
            $("#referent").attr('src', ' ');
            $("#referent").hide();
            $("#progressOutline").hide();
            $(".productionphase").show();
            $(".hidedemo").hide();
            $(".skipButton").hide();
        }
    }
}

function skipRefs() {
    clearInterval(interval);
    $("#referent").attr('src', ' ');
    $("#referent").hide();
    $("#progressOutline").hide();
    $(".productionphase").show();
    $(".hidedemo").hide();
    $(".skipButton").hide();
}

function finishDemo() {
    refIndex++;
    if (refIndex < referents.length) {
        startCountdown();
    } else {
    	if (deviceIndex < devices.length-1) {
            $('.rateDevice').show();
            startAudioRecording(devices[deviceIndex]);
            deviceIndex++;
    	} else {
            $('.rateDevice').show();
            TEMPvpid = vpid;
            startAudioRecording(devices[deviceIndex]);
            $('.rateDevice button').attr('onclick', "stopAudioRecording(); $('.rateDevice').hide(); incrementVP(); $('.fertig').show();");
		}
    }
}

function getCameras() {
    navigator.mediaDevices.enumerateDevices().then(showStreams);
}

async function showStreams(devices) {
    console.log(devices)
    for (let i = 0; i !== devices.length; ++i) {
        const device = devices[i];
        if (device.kind === 'videoinput') {
            var src = {};
            
            src.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: device.deviceId,
                    width: { exact: 1920 },
                    height: { exact: 1080 },
                    framerate: { exact: 30 }
                },
                audio: true
            });

            src.label = shorten(device.label);
            let index = streams.length;
            streams.push(src);
            $(".videobox").append(`
                <div id="video${index}cont">
                <div class="videocont">
                    <video id="video${index}" width="${src.stream.video}" height="${src.stream.height}" autoplay muted></video>
                </div>
                <p class="hidedemo">${src.label}</p>
                <button class="red hidedemo" onclick="destroyCamera(${index})">Ignore this Stream</button>
                </div>
                `);
            document.querySelector('#video' + index).srcObject = src.stream;
        }
    }
}

function shorten(input) {
    let result = input.replace(/\(.*?\)/g, '');
    result = result.replace(/ /g, '_');
    return result;
}


function destroyCamera(id) {
    tracks = streams[id].stream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });
    console.log('removed from streams');
    console.log(streams);

    $('#video' + id + 'cont').remove();
    console.log('destroyed DOM' + id);
}

function startRecording(nonScheduled = false) {
    $('#recordButton').html('– stop recording');
    $('#recordButton').attr('onclick', 'stopRecording()');
    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i].stream;
        if (stream.active) {
            const label = streams[i].label;
            let chunks = [];

            lut[stream.id] = label;

            mediaRecorders[i] = new MediaRecorder(stream, { mimeType: "video/mp4", videoBitsPerSecond: 10000000 });
            mediaRecorders[i].start();
            today = new Date()
            console.log(label + ' started at ' + today.getTime());

            mediaRecorders[i].ondataavailable = (e) => {
                chunks.push(e.data);
            };

            mediaRecorders[i].onstop = function() {
                console.log('onstop of ' + i + ' triggered');
                const blob = new Blob(chunks, { type: "video/mp4;" });
                chunks = [];

                const videoURL = window.URL.createObjectURL(blob);
                let filename = '';
                if(nonScheduled) {
                    filename = 'VP' + vpid + '_' + devices[deviceIndex] + '_ERR_' + refLabels[referentOrder[deviceIndex][refIndex]] + '_' + lut[this.stream.id];
                } else {
                    filename = 'VP' + vpid + '_' + devices[deviceIndex] + '_' + refLabels[referentOrder[deviceIndex][refIndex]] + '_' + lut[this.stream.id];
                }

                const a = document.createElement("a");
                a.style.display = "none";
                a.href = videoURL;
                a.download = `${filename}.mp4`;
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(videoURL);
                document.body.removeChild(a);
            };
        }
    }
}

function stopRecording() {
    console.log(mediaRecorders);
    for (let i = 0; i < mediaRecorders.length; i++) {
        if (mediaRecorders[i] != undefined && mediaRecorders[i].state == 'recording') {
            mediaRecorders[i].stop();
            console.log(i + ' stopped');
        }
    }
    $('#recordButton').html('• start recording');
    $('#recordButton').attr('onclick', 'startRecording()');
}

function startAudioRecording(devicename) {
 let stream = streams[0].stream;
 console.log('audioSource: ' + stream);
 console.log(stream);
 if (stream.active) {
        let chunks = [];

        audioRecorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
        audioRecorder.start();
        today = new Date()
        console.log('audioStream started at ' + today.getTime());

        audioRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        audioRecorder.onstop = function() {
            console.log('onstop of audioStream triggered');
            const blob = new Blob(chunks, { type: "video/mp4;" });
            chunks = [];

            const audioURL = window.URL.createObjectURL(blob);
            const filename = 'VP' + TEMPvpid + '_' + devicename + '_description';

            const a = document.createElement("a");
            a.style.display = "none";
            a.href = audioURL;
            a.download = `${filename}.mp4`;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(audioURL);
            document.body.removeChild(a);
        };
    } else {
        console.log("stream not active?");
        console.log(stream.active);
    }
}

function stopAudioRecording() {
    if (audioRecorder != undefined && audioRecorder.state == 'recording') {
        audioRecorder.stop();
        console.log('audiorecorder stopped');
    }
}