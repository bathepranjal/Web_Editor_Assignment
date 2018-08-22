//This functions loads on window onload
window.onload = function() {
    var converter = new showdown.Converter();
    var pad = document.getElementById('drop');
    var markdownArea = document.getElementById('markdown');   

    var previousMarkdownValue;          

    var convertTextAreaToMarkdown = function(){
        var markdownText = pad.value;
        previousMarkdownValue = markdownText;
        html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;
    };

    var didChangeOccur = function(){
        if(previousMarkdownValue != pad.value){
            return true;
        }
        return false;
    };

    setInterval(function(){
        if(didChangeOccur()){
            convertTextAreaToMarkdown();
        }
    }, 1000);
};

if(window.FileReader) { 
    addEventHandler(window, 'load', function() {
      var drop   = document.getElementById('drop');
        
      function cancel(e) {
        if (e.preventDefault) { e.preventDefault(); }
        return false;
      }
    
      // Tells the browser that we *can* drop on this target
      addEventHandler(drop, 'dragover', cancel);
      addEventHandler(drop, 'dragenter', cancel);
    });
  } else { 
    document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
  };

  function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {
        // Old school method.
        obj['on'+evt] = handler;
    }
}

addEventHandler(drop, 'drop', function (e) {
    e = e || window.event; // get window.event if e argument missing (in IE)   
    if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.
    
    var dt    = e.dataTransfer;
    var files = dt.files;

    console.log(e);

    for (var i=0; i<files.length; i++) {
      var file = files[i];
      var reader = new FileReader();
        
      //attach event handlers here...
     
      reader.readAsDataURL(file);

      addEventHandler(reader, 'loadend', function(e, file) {
        var bin = this.result; 
        drop.value+="\n![]("+bin+")";
    }.bindToEventHandler(file));
    }
    return false;
  });

  Function.prototype.bindToEventHandler = function bindToEventHandler() {
    var handler = this;
    var boundParameters = Array.prototype.slice.call(arguments);
    //create closure
    return function(e) {
        e = e || window.event; // get window.event if e argument missing (in IE)   
        boundParameters.unshift(e);
        handler.apply(this, boundParameters);
    }
  };
  