
// LONG SCREENSHOT MODULE
let load=document.getElementsByClassName("long");
window.onload=function(){
  let btn=document.getElementById("long_screenshot");
  btn.addEventListener("click",function(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    // use `url` here inside the callback because it's asynchronous!
    let url = tabs[0].url;
    let longSelect=document.getElementById("long-img-type");
    let longOption=longSelect.options[longSelect.selectedIndex].value;
    
    // Format: PNG
    if(longOption=="png"){
        load[0].style.opacity="1";
        fetch("https://shot.screenshotapi.net/screenshot?token=4QDAT73-9T9M25M-GPZBT29-PWETDFN&url="+url + "&full_page=true&output=image&file_type=png&wait_for_event=load")
        .then(response => response.blob())
        .then(function(myblob){
            var imagePath = URL.createObjectURL(myblob);
            saveAs(imagePath , "ScreenSave");
            load[0].style.opacity="0";
        });
    }

    // Format: PDF
    else if(longOption=="pdf"){
        load[0].style.opacity="1";
        fetch("https://shot.screenshotapi.net/screenshot?token=4QDAT73-9T9M25M-GPZBT29-PWETDFN&url="+url + "&full_page=true&output=image&file_type=pdf&pdf_options%5Bformat%5D)=A4&pdf_options%5Bmedia%5D)=print&pdf_options%5Blandscape%5D)=false&pdf_options%5Bprint_background%5D)=false&wait_for_event=load")
        .then(response => response.blob())
        .then(function(myblob){
            var imagePath = URL.createObjectURL(myblob);
            saveAs(imagePath , "ScreenSave");
            load[0].style.opacity="0";
        });
    }

    //Format: jpeg
    else if(longOption=="jpeg"){
        load[0].style.opacity="1";
        fetch("https://shot.screenshotapi.net/screenshot?token=4QDAT73-9T9M25M-GPZBT29-PWETDFN&url="+url + "full_page=true&output=image&file_type=jpeg&wait_for_event=load")
        .then(response => response.blob())
        .then(function(myblob){
            var imagePath = URL.createObjectURL(myblob);
            saveAs(imagePath , "ScreenSave.jpg");
            load[0].style.opacity="0";
        });
    }

    //Format: webp
    else if(longOption=="webp"){
        load[0].style.opacity="1";
        fetch("https://shot.screenshotapi.net/screenshot?token=4QDAT73-9T9M25M-GPZBT29-PWETDFN&url="+url + "&full_page=true&output=image&file_type=webp&wait_for_event=load")
        .then(response => response.blob())
        .then(function(myblob){
            var imagePath = URL.createObjectURL(myblob);
            saveAs(imagePath , "ScreenSave");
            load[0].style.opacity="0";
        });
    }

    });
});

// SIMPLE SCREENSHOT MODULE
let ss=document.getElementById("screenshot");
ss.addEventListener("click",function(){

let longSelect=document.getElementById("short-img-type");
let longOption=longSelect.options[longSelect.selectedIndex].value;

function onCaptured(imageUri) {
    var url=imageUri;
    
    fetch(url)
    .then(res => res.blob())
    .then(
       function(myblob){
            var imagePath = URL.createObjectURL(myblob);
            if(longOption=="jpeg"){
                saveAs(imagePath , "ScreenSave.jpeg");
            }
            else if(longOption=="webp"){
                saveAs(imagePath , "ScreenSave.webp");
            }
            else if(longOption=="png"){
                saveAs(imagePath , "ScreenSave.png");
            }
            else if(longOption=="pdf"){
                const doc = new window.jspdf.jsPDF('l');
                doc.addImage(imagePath, 10, 25, 280,150);
                doc.save("ScreenSave.pdf");
            }
            
        } 
    )
}

function onError(error) {
  console.log(`Error: ${error}`);
}

let capturing = chrome.tabs.captureVisibleTab();
  capturing.then(onCaptured, onError);
});

// MULTIPLE SCREENSHOT MODULE

var count=0;
let ms=document.getElementById("multishot");
let dload = document.getElementById("download");
let imagePath=[];
var url_element;
ms.addEventListener("click",function(){
console.log("Button Clicked");

function onCaptured(imageUri) {
    var url=imageUri;
    fetch(url)
    .then(res => res.blob())
    .then(
       function(myblob){
            url_element=URL.createObjectURL(myblob);
            imagePath.push(url_element); 
            console.log(imagePath)
            count++;
        } 
    )
}

function onError(error) {
  console.log(`Error: ${error}`);
}

let capturing = chrome.tabs.captureVisibleTab();
  capturing.then(onCaptured, onError);
});

dload.addEventListener('click',function(){
    let multiSelect=document.getElementById("multi-img-type");
    let multiOption=multiSelect.options[multiSelect.selectedIndex].value;
    console.log(imagePath.length);

    if(multiOption=="png"){
        imagePath.forEach((m_urls)=>{
        saveAs(m_urls , "ScreenSave.png");
    })
    }
    else if(multiOption=="jpg"){
        imagePath.forEach((m_urls)=>{
        saveAs(m_urls , "ScreenSave.jpg");
    })
    }
    else if(multiOption=="webp"){
        imagePath.forEach((m_urls)=>{
        saveAs(m_urls , "ScreenSave.webp");
    })
    }
    else if(multiOption=="pdf"){
        
        const doc = new window.jspdf.jsPDF('l');

        for(let j=0;j<imagePath.length;j++){

        if(j==0){
          doc.addImage(imagePath[j], 10, 25, 280,150);
        }
        else{
            doc.addPage();
            doc.addImage(imagePath[j], 10, 25, 280,150);  
        }
        }
        doc.save("ScreenSave.pdf");
    }

});

// SCREEN RECORDING MODULE
const start = document.getElementById("start");
const stop = document.getElementById("stop");


start.addEventListener("click", () => {
  chrome.tabs.query({currentWindow: true, active: true}, function ([activeTab]){
    chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
  });
});

stop.addEventListener("click", () => {
    let recSelect=document.getElementById("rec-type");
    let recOption=recSelect.options[recSelect.selectedIndex].value;
    chrome.tabs.query({currentWindow: true, active: true}, function ([activeTab]){
    chrome.tabs.sendMessage(activeTab.id, {"message": "stop","format":`${recOption}`});
  });
});

}


