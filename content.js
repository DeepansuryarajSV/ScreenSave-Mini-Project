chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       switch(request.message){
           case "start":{
            startRecording();
            break;
           }
           case "stop":{
            stopRecording();
            break;
           }
       }
       window.form=request.format;
      return true; 
    }

);

let recorder, stream, streamID;

function startRecording() {
    chrome.runtime.sendMessage({message: "getStreamID"}, function(response){
        streamID = response.streamID;
        console.log("Stream ID below");
        console.log(streamID);

        if(!streamID) return;
        
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "screen",
                    chromeMediaSourceId: streamID
                }   
            }   
        }, function onSuccess(mainStream) {
              stream = mainStream;

              recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9',
              });

              let chunks = [];
    
              recorder.ondataavailable = e => chunks.push(e.data);
    
              recorder.onstop = e => {
                  const completeBlob = new Blob(chunks, { type: "video/webm; codecs=vp9" });
                  const result = window.URL.createObjectURL(completeBlob) 
                  chunks = [];
                  console.log(result);
                  function download(fileUrl, fileName) {
                    var a = document.createElement("a");
                    a.href = fileUrl;
                    a.setAttribute("download", fileName);
                    a.click();
                }
                
                download(result, `ScreenSave.${form}`);
                  chrome.runtime.sendMessage({message: "blobData", objecUrl: result})
                  
              };
    
              chrome.storage.local.set({isRecording: true});
    
              recorder.start();
              
        }, function onError(error) {
            console.log(error);
        }); 
    })
}

function stopRecording(){
  chrome.storage.local.set({isRecording: false});
  recorder.stop();
  console.log("stop");
  stream.getVideoTracks()[0].stop();

  chrome.storage.local.get("video_data", function(items) {
  const { video_data } = items;
  console.log(video_data);
});
  
}

chrome.storage.local.set({video_data: null});
chrome.storage.local.set({isRecording: false});

