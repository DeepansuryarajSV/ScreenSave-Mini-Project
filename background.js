chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       switch(request.message){
           case "getStreamID":{
            getStreamID(sender, sendResponse);
            break;
           }
           case "blobData": {
            chrome.storage.local.set({video_data: request.objecUrl});
            break;
          }
       }

       return true;
    }
);

function getStreamID(sender, sendResponse){
    chrome.desktopCapture.chooseDesktopMedia(['screen','window','tab'], sender.tab, function (streamid) {
        setTimeout(() => {
            sendResponse({type: "streamID", streamID: streamid})
        }, 1)
    });

}