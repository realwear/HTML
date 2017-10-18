/*------------------- COPYRIGHT AND TRADEMARK INFORMATION -------------------+
 |
 |    RealWear Development Software, Source Code and Object Code
 |    (c) RealWear, Inc. All rights reserved.
 |
 |    Contact info@realwear.com for further information about the use of
 |    this code.
 |
 +---------------------------------------------------------------------------*/


/*----------------------- SOURCE MODULE INFORMATION -------------------------+
 |
 | Source Name:  WearML Engine
 | Version: v0.9.1
 | Date: August 2017
 | Author: Luke Hopkins
 |
 +---------------------------------------------------------------------------*/

window.addEventListener("load", function() { getCommands(); }, false);

var wearMLElements = [];

//CONST
var root = "--root";
var text_field = "--text_field";
var overlay_show_number = "--overlay_show_number";
var overlay_show_text = "--overlay_show_text";
var overlay_persists = "--overlay_persists";
var overlay_orientation = "--overlay_orientation";
var overlay_background_color = "--overlay_background_color";
var overlay_text_color = "--overlay_text_color";
var overlay_border_color = "--overlay_border_color";
var overlay_anchor_hv = "--overlay_anchor_hv";
var overlay_show_dot = "--overlay_show_dot";
var overlay_show_icon = "--overlay_show_icon";
var overlay_offset = "--overlay_offset";
var hf_scroll = "--hf_scroll";
var barcode = "--hf_barcode";
var global = "--global_commands";
var hide_help = "--hide_help";
var broadcast_results = "--broadcast_results";

var root_text_field = "";
var root_overlay_show_number = "";
var root_overlay_show_text = "";
var root_overlay_persists = "";
var root_overlay_orientation = "";
var root_overlay_background_color = "";
var root_overlay_text_color = "";
var root_overlay_border_color = "";
var root_overlay_anchor_hv = "";
var root_overlay_show_dot = "";
var root_overlay_show_icon = "";
var root_overlay_offset = "";
var root_hf_scroll = "";
var root_hide_help = "";

function getCommands() {
   var elements = getAllElementsWithAttribute('*');
   createOverrideDom();
}

/**
*  Get all elements based on attribute passed
**/
function getAllElementsWithAttribute(attribute)
{
  var allElements = document.body.getElementsByTagName(attribute);
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    //Check element to see if it has atleast one of our tags
    if (allElements[i].getAttribute('data-wml-style') !== null || allElements[i].getAttribute('data-wml-speech-command') !== null || allElements[i].tagName != "DIV")
    {
        if(allElements[i].tagName == "SCRIPT")
            return;
        console.log(allElements[i].tagName);
        var styleId = allElements[i].getAttribute('data-wml-style');
        var command = allElements[i].text;

        var speech_command = allElements[i].getAttribute('data-wml-speech-command');


        if(speech_command == undefined || speech_command == " " || speech_command == ""){

        }else {
            command = speech_command;


        if(allElements[i].id === ""){
            allElements[i].id = guid();
        }

        var position = getPosition(allElements[i]);
        var element = {tag: command, id: allElements[i].id,x: position.x, y: position.y, styleId: styleId };
      // Element exists with attribute. Add to array.
        wearMLElements.push(element);
        }
    }
  }
  return wearMLElements;
}

/**
*   Creates a DOM element to contain all the custom xml
**/
function createOverrideDom(){

    var btn = document.getElementById("wearHF_root_button")

    if(btn != undefined)
        document.body.removeChild(btn);
    // Lets make sure its not already made
    var btn = document.createElement("BUTTON");        // Create a <button> element
    btn.id = "wearHF_root_button";

    var t = document.createTextNode("hf_wearml_override:" + generateXML());       // Create a text node
    btn.appendChild(t);                                // Append the text to <button>
    btn.style.top = 0;
    btn.style.left = 0;
    btn.style.opacity  = "0.01";
    btn.style.position = "fixed";
    // Get a reference to the first child
    var theFirstChild = document.body.firstChild;
   // document.body.appendChild(btn);
   document.body.insertBefore(btn, theFirstChild);
}


/**
*  Create xml for web page.
**/
function generateXML(){
  var xml = "<WearML><Package>com.android.webview</Package><Language>en_GB</Language><UniqueIdentifier id=\"web_app\"/> ";

  for (var i = 0, n = wearMLElements.length; i < n; i++)
  {
      var command = wearMLElements[i].tag;
      var styleId = wearMLElements[i].styleId
      xml += "<View ";
      xml += "id=\"" + wearMLElements[i].id + "\" ";

      var style = getStyle(styleId)

      if(style != undefined){
			xml += wearMLParser(style, wearMLElements[i]);
      }

      if(command != undefined){
        xml += "speech_command=\""+ command + "\" ";
      }

      xml += "/> ";
  }

   xml += "</WearML>";
   return utf8_to_b64(xml);
}

function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}

/**
*   Finding style based on class name and returns style
**/
function getStyle(className) {
    for(var i = 0; i < document.styleSheets.length; i++){
            var classes = document.styleSheets[i].rules || document.styleSheets[i].cssRules
            if(classes != null)
                for(var x=0;x<classes.length;x++) {
                    if(classes[x].selectorText==className) {
                        return classes[x].style;
                    }
                }
     }
}

/**
*   Create Random GUID
**/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getPosition(e) {
    var isNotFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') == -1);
    var x = 0, y = 0;
    while (e) {
        x += e.offsetLeft - e.scrollLeft + (isNotFirefox ? e.clientLeft : 0);
        y += e.offsetTop - e.scrollTop + (isNotFirefox ? e.clientTop : 0);
        e = e.offsetParent;
    }
    return { x: x + window.scrollX, y: y + window.scrollY };
}


/**
*    Convert String to xml attribute
**/
function wearMLParser(e, element) {

   var attributes = "";

    /**
    * If we cant find a value and we have a root value use this....
    */
   var get_root = e != undefined ? e.getPropertyValue(root).trim() : "";
   var get_text_field = e != undefined ? e.getPropertyValue(text_field).trim() : root_text_field;
   var get_overlay_show_number =  e != undefined ? e.getPropertyValue(overlay_show_number).trim() : root_overlay_show_number;
   var get_overlay_show_text = e != undefined ? e.getPropertyValue(overlay_show_text).trim() : root_overlay_show_text;
   var get_overlay_persists = e != undefined ? e.getPropertyValue(overlay_persists).trim() : root_overlay_persists;
   var get_overlay_orientation = e != undefined ? e.getPropertyValue(overlay_orientation).trim() : root_overlay_orientation;
   var get_overlay_background_color = e != undefined ? e.getPropertyValue(overlay_background_color).trim() : root_overlay_background_color;
   var get_overlay_text_color = e != undefined ? e.getPropertyValue(overlay_text_color).trim() : root_overlay_text_color;
   var get_overlay_border_color = e != undefined ? e.getPropertyValue(overlay_border_color).trim() : root_overlay_border_color;
   var get_overlay_anchor_hv = e != undefined ? e.getPropertyValue(overlay_anchor_hv).trim() : root_overlay_anchor_hv;
   var get_overlay_show_dot = e != undefined ? e.getPropertyValue(overlay_show_dot).trim() : root_overlay_show_dot;
   var get_overlay_show_icon = e != undefined ? e.getPropertyValue(overlay_show_icon).trim() : root_overlay_show_icon;
   var get_overlay_offset = e != undefined ? e.getPropertyValue(overlay_offset).trim() : root_overlay_offset;
   var get_hf_scroll = e != undefined ? e.getPropertyValue(hf_scroll).trim() : root_hf_scroll;
   var get_barcode = e != undefined ? e.getPropertyValue(barcode).trim() : "";
   var get_global = e != undefined ? e.getPropertyValue(global).trim() : "";
   var get_hide_help = e != undefined ? e.getPropertyValue(hide_help).trim() : "";
   var get_broadcast_results = e != undefined ? e.getPropertyValue(broadcast_results).trim() : "";

   /**
       Input type
   ***/
   if(get_root != ""){
              if(get_root == "true"){
                   root_text_field = get_text_field;
                   root_overlay_show_number = get_overlay_show_number;
                   root_overlay_show_text = get_overlay_show_text;
                   root_overlay_persists = get_overlay_persists;
                   root_overlay_orientation = get_overlay_orientation;
                   root_overlay_background_color = get_overlay_background_color;
                   root_overlay_text_color = get_overlay_text_color;
                   root_overlay_border_color = get_overlay_border_color;
                   root_overlay_anchor_hv = get_overlay_anchor_hv;
                   root_overlay_show_dot = get_overlay_show_dot;
                   root_overlay_show_icon = get_overlay_show_icon;
                   root_overlay_offset = get_overlay_offset;
                   root_hf_scroll = get_hf_scroll;
                   root_hide_help = get_hide_help;
              }
   }

   /**
       Input type
   ***/
   if(get_text_field != ""){
       attributes += "text_field="+ get_text_field + " ";
    }

    /**
        Show Number
    ***/
    if(get_overlay_show_number != ""){
        if(get_overlay_show_number == "true"){
            attributes += "overlay_show_number=\"yes\" ";
         }
        else{
            attributes += "overlay_show_number=\"no\" ";
        }
    }


    /**
        Show Text
    **/
    if(get_overlay_show_text != ""){
        if(get_overlay_show_text == "true")
            attributes += "overlay_show_text=\"yes\" ";
        else{
            attributes += "overlay_show_text=\"no\" ";
        }
    }


    /**
        Show Overlay
    **/
    if(get_overlay_persists != ""){
        if(get_overlay_persists == "true")
            attributes += "overlay_persists=\"yes\" ";
        else{
            attributes += "overlay_persists=\"no\" ";
        }
    }

    /**
        Overlay Orientation
    **/
   if(get_overlay_orientation != ""){
       attributes += "overlay_orientation="+ get_overlay_orientation + " ";
    }

    /**
        Overlay background color
    **/
   if(get_overlay_background_color != ""){
       attributes += "overlay_background_color="+ get_overlay_background_color + " ";
    }


    /**
        Overlay text color
    */
   if(get_overlay_text_color != ""){
       attributes += "overlay_text_color="+ get_overlay_text_color + " ";
    }


    /**
        Overlay border color
    */
   if(get_overlay_border_color != ""){
       attributes += "overlay_border_color="+ get_overlay_border_color + " ";
    }

    /**
        Overlay anchor percent
    */
   if(get_overlay_anchor_hv != ""){
       attributes += "overlay_anchor="+ get_overlay_anchor_hv + " ";
    }

    /**
        Overlay show dot
    **/
   if(get_overlay_show_dot != ""){
       if(get_overlay_show_dot == "true")
              attributes += "overlay_show_dot=\"yes\" ";
          else{
              attributes += "overlay_show_dot=\"no\" ";
       }
    }

    /**
        Overlay show icon
    **/
   if(get_overlay_show_icon != ""){
       if(get_overlay_show_icon == "true")
              attributes += "overlay_show_icon=\"yes\" ";
          else{
              attributes += "overlay_show_icon=\"no\" ";
       }
    }

    /**
        Overlay offset
    **/
   if(get_overlay_offset != ""){
        attributes += "overlay_offset="+ get_overlay_offset + " ";
    }

    /**
        HF Scroll
    **/
   if(get_hf_scroll != ""){
       attributes += "scroll="+ get_hf_scroll + " ";
    }

    /**
       Barcode Reader
    **/
   if(get_barcode != ""){
      attributes += "barcode="+ get_barcode + " ";

    }

     /**
           Hide Help
    */
    if(get_hide_help != ""){
          attributes += "barcode="+ get_barcode + " ";

     }

    /**
        Global Commands
    **/
   if(get_global != ""){
          if(get_global == "true")
               attributes += "global_commands=\"yes\" ";
             else{
                 attributes += "global_commands=\"no\" ";
          }
    }

    /**
        BroadCast Commands
    **/
   if(get_broadcast_results != ""){
          if(get_broadcast_results == "true")
               attributes += "broadcast_results=\"yes\" ";
             else{
                 attributes += "broadcast_results=\"no\" ";
          }
    }
    return attributes;
}
