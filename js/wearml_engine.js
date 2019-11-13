/**
* MIT License
*
* Copyright (c) 2018  RealWear
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

/*----------------------- SOURCE MODULE INFORMATION -------------------------+
 |
 | Source Name:  WearML Engine
 | Version: v1.0.1
 | Date: November 2019
 | Author: Luke Hopkins & Taylor Meads
 |
 +---------------------------------------------------------------------------*/

var wearML = new function(){

    this.voiceCommandsCallBack;

    this.config = {
        attributes : true,
        attributeFilter: ["class", "style"],
        childList : true,
        subtree : true,
        characterData : false
    };

    // Observer used for detecting when dom elements have been removed or added.
    this.observer = new MutationObserver(function(mutations) {

        console.log("DOM Mutation detected, re-acquiring WearML commands.");
        
        wmlNodes = document.querySelectorAll('button[id$="WML_NODE"]');
        
        wmlNodes.forEach((wmlNode) => {
            wmlNode.parentNode.removeChild(wmlNode);
        });

        wearML.pollCommands();
    });

    window.addEventListener("load", function() {
        wearML.pollCommands();
    }, false);

    this.wearMLElements = [];
    this.callbackElements = [];

    this.commandSet;

    //CONST for CSS styles'
    this.root = "--root";
    this.text_field = "--text_field";
    this.overlay_show_number = "--overlay_show_number";
    this.overlay_show_text = "--overlay_show_text";
    this.overlay_persists = "--overlay_persists";
    this.overlay_orientation = "--overlay_orientation";
    this.overlay_background_color = "--overlay_background_color";
    this.overlay_text_color = "--overlay_text_color";
    this.overlay_border_color = "--overlay_border_color";
    this.overlay_anchor_hv = "--overlay_anchor_hv";
    this.overlay_show_dot = "--overlay_show_dot";
    this.overlay_show_icon = "--overlay_show_icon";
    this.overlay_offset = "--overlay_offset";
    this.hf_scroll = "--hf_scroll";
    this.barcode = "--hf_barcode";
    this.global = "--global_commands";
    this.hide_help = "--hide_help";
    this.broadcast_results = "--broadcast_results";
    this.include_help = "--include_help";

    this.root_text_field = "";
    this.root_overlay_show_number = "";
    this.root_overlay_show_text = "";
    this.root_overlay_persists = "";
    this.root_overlay_orientation = "";
    this.root_overlay_background_color = "";
    this.root_overlay_text_color = "";
    this.root_overlay_border_color = "";
    this.root_overlay_anchor_hv = "";
    this.root_overlay_show_dot = "";
    this.root_overlay_show_icon = "";
    this.root_overlay_offset = "";
    this.root_hf_scroll = "";
    this.root_hide_help = "";
    this.root_include_help = "";
    
    this.shouldHideHelp = null;

    this.getCommands = function() {
        // Checking to see if we are a HMT
        if (!navigator.userAgent.match(/Android/i) && screen.width > 480 && screen.height > 854) {
            console.log("This is not an HMT device, WearML commands will not be registered.");
            return;
        }

        wearML.observer.disconnect();
        
        wearML.clearHelpCommands();
        this.shouldHideHelp = false; 
        
        this.elements = wearML.getAllElementsWithAttribute('*');
        wearML.createOverrideDom();
        this.rootElement = document.documentElement;
        wearML.observer.observe(this.rootElement, wearML.config);
        // createRootDom();
    };

    this.setCommandSet = function(cmdset) {
        console.log('Changing commandSet from \'' + this.commandSet + '\' to \'' + cmdset + '\'.');
        this.commandSet = cmdset;
        this.pollCommands();
    };
    

    this.initCallbackBtn = function(command){
        var btn = document.createElement("BUTTON"); 
        
        

        btn.id = command + 'WML_CB_NODE';

        btn.style.top = 0;
        btn.style.left = 0;
        btn.style.opacity = "0.01";
        btn.style.position = "fixed";

        btn.setAttribute('data-wml-speech-command',command);

        return btn;
    };

    this.registerCallbackBtn = function(btn){
        var theFirstChild = document.body.firstChild;

        document.body.insertBefore(btn, theFirstChild);

        wearML.pollCommands();
    };
    
    this.addCallbackCommand = function(command,cmdset,callbackFunc) {
        
        
        
        var btn = document.getElementById(command + 'WML_CB_NODE');
        
        
        var isNew = (btn == null || btn == undefined);

        if(isNew){
            btn = wearML.initCallbackBtn(command);
        }

        btn.onclick = callbackFunc;

        if(cmdset){
            btn.setAttribute('data-wml-commandsets',cmdset);
        }
        
        if(isNew){
            wearML.registerCallbackBtn(btn);
        }
    };

    this.removeCallbackCommand = function(command) {

        var btn = document.getElementById(command + 'WML_CB_NODE');
        

        if(btn != null && btn != undefined){
            btn.parentNode.removeChild(btn);
        }

        wearML.pollCommands();
    };

    this.automaticCommandParsing = true;

    this.setAutomaticCommandParsing = function(bool){
        console.log("Setting automatic command parsing to " + bool);

        this.automaticCommandParsing = bool;

        this.pollCommands();
    };

    this.isElementParsable = function(el){
        if(this.automaticCommandParsing){
            return el.getAttribute('data-wml-style') !== null || el.getAttribute('data-wml-speech-command') !== null || el.tagName != "DIV";
        }
        else{
            return el.getAttribute('data-wml-style') !== null || el.getAttribute('data-wml-speech-command') !== null;
        }
    };

    this.ASRPolling;

    this.isValidCommandSet = function(commandSets){
        var returnValue = false;
        if(this.commandSet == null){
            returnValue = true;
        }
        else{
            var cmdSetArr = commandSets.split('|');
            returnValue = cmdSetArr.includes(wearML.commandSet);
        }
        return returnValue;
    };
    
    this.isElementHidden = function(el){
        
      return(
              (el.type == 'hidden') ||
              (el.hidden == true) ||
              (el.display === 'none') 
            );
        
    };
    
    this.helpCommands = new Set();
    
    
    this.addHelpCommand = function(cmd){
        
        wearML.helpCommands.add(cmd);
        
        
    };
    
    this.clearHelpCommands = function(){
        wearML.helpCommands.clear();
    }

    /**
     * Get all elements based on attribute passed
     */
    this.getAllElementsWithAttribute = function(attribute) {
        wearML.wearMLElements = [];

        this.allElements = document.body.getElementsByTagName(attribute);

        for (var i = 0, n = this.allElements.length; i < n; i++) {
            // Check element to see if it has atleast one of our tags
            this.currentElement = this.allElements[i];


            try{
                if (this.isElementParsable(this.currentElement)) {
                    
                    if(wearML.isElementHidden(this.currentElement)){
                        continue;
                    }     

                    if (this.currentElement.tagName != "SCRIPT") {
                        
                        this.styleId = this.currentElement.getAttribute('data-wml-style');
                        this.elementCommandSets = this.currentElement.getAttribute('data-wml-commandsets');
                        this.speech_command = this.currentElement.getAttribute('data-wml-speech-command');
                        this.command = this.currentElement.text;
                        

                        if (this.speech_command == undefined || this.speech_command == " " || this.speech_command == "") {
                            // NOTHING
                        } else {
                            this.command = this.speech_command;

                            if (this.currentElement.id === "") {
                                this.currentElement.id = this.guid();
                            }
                            

                            //Add this element if global commandset is undefined (all commands valid) or if this element belongs to the active global commandset
                            if(wearML.commandSet == undefined || wearML.commandSet == null || wearML.isValidCommandSet(this.elementCommandSets)){


                                this.position = this.getPosition(this.currentElement);

                                this.element = {
                                    tag : this.command,
                                    id : this.currentElement.id,
                                    x : this.position.x,
                                    y : this.position.y,
                                    styleId : this.styleId
                                };
                                
                              

                                
                                // Element exists with attribute. Add to array.
                                
                                if(this.element.id.includes('WML_CB_NODE')){
                                    wearML.callbackElements.push(this.element);
                                }
                                else{
                                    wearML.wearMLElements.push(this.element);
                                    this.createButton(this.element, this.currentElement);
                                }
                                
                            }
                        }
                    }
                }
            }
            catch(error){
                console.log("An error has occurred while parsing an HTML element and a WearML element will not be registered");
                console.error(error);
            }
        }

        return wearML.wearMLElements;
    };

    this.onReceivedCommand = function(command) {
    };

    /**
     * Sets a second time from the point a reload is called. This is to stop a
     * the function reload commands from being called to many times
     */
    this.pollCommands = function() {
        if (wearML.ASRPolling != undefined) {
            clearTimeout(wearML.ASRPolling);
            this.ASRPolling = null;
        }

        wearML.ASRPolling = setTimeout(wearML.getCommands, 300);
    };

    /**
     * Creates a DOM element to contain all the custom xml
     */
    this.createOverrideDom = function() {

        this.btn = document.getElementById("wearHF_root_button")

        // Lets make sure its not already made
        if (this.btn != undefined){
            document.body.removeChild(this.btn);
        }

        this.btn = document.createElement("BUTTON"); // Create a <button>
        this.btn.id = "wearHF_root_button";


        this.t = document.createTextNode(this.generateRootWearML()); // Create a text node
        this.btn.appendChild(this.t); // Append the text to <button>
        this.btn.style.top = 0;
        this.btn.style.left = 0;
        this.btn.style.opacity = "0.01";
        this.btn.style.position = "fixed";
        
        // Get a reference to the first child
        this.theFirstChild = document.body.firstChild;
        document.body.insertBefore(this.btn, this.theFirstChild);
    };

    /**
     * Create hidden button for WearHF to interact with
     */
    this.createButton = function(element, node) {
        this.btn = document.getElementById(element.tag + "WML_NODE");

        if (this.btn != undefined) {
            document.body.removeChild(this.btn);
        }
        
        this.btn = document.createElement("BUTTON"); // Create a <button>
        this.btn.id = element.tag + "WML_NODE";

        this.t = document.createTextNode(element.tag); // Create a text node
        this.btn.style.fontSize = "0.01px";
        this.btn.appendChild(this.t); // Append the text to <button>
        this.btn.style.top = node.getBoundingClientRect().top + "px";
        this.btn.style.left = node.getBoundingClientRect().left + "px";

        this.btn.onclick = function(element) {
            for (var i = 0, n = wearML.wearMLElements.length; i < n; i++) {
                
                if(typeof element.srcElement === "undefined" || typeof element.srcElement.textContent === "undefined"){
                    continue;
                }

                if (element.srcElement.textContent === wearML.wearMLElements[i].tag) {
                    this.ele = document.getElementById(wearML.wearMLElements[i].id);

                    if (this.ele.tagName === "INPUT" | this.ele.tagName === "TEXTAREA") {
                        this.ele.focus();
                        this.ele.click();

                    } else if (this.ele.tagName === "SELECT") {
                        this.event = document.createEvent('MouseEvents');
                        this.event.initMouseEvent('mousedown', true, true, window);
                        this.ele.dispatchEvent(this.event);

                    } else {
                        this.event = new MouseEvent('click', {view:window, bubbles: true, cancelable:true});
                        this.ele.dispatchEvent(this.event);
                    }

                }
            }
        };

        this.btn.style.opacity = "0.01";
        this.btn.style.position = "absolute";
        this.btn.style.width = node.offsetWidth;
        this.btn.style.height = node.offsetHeight;
        this.btn.style.zIndex = "-1";
        // Get a reference to the first child
        var theFirstChild = document.body.firstChild;
        document.body.appendChild(this.btn);
    };
    
    this.listHelpCommands = function(){
        
        var listStr = '';
        
        wearML.helpCommands.forEach(function(value){
            listStr += value + ',';
        });
        
        return listStr.slice(0, -1) + '|'; //remove last comma and add pipe
        
    }

    /**
     * Create xml for web page. XML is used for switching off overlays by
     * default and used for sending the overlay styles to WearHF
     */
    this.generateRootWearML = function() {
        
        
        var xml = "<WearML><Package>com.android.webview</Package><Language>en_GB</Language><UniqueIdentifier id=\"web_app\"/> ";

        document.title = "hf_no_number";

        parseElementIntoXml = function(el, isCallback) {
            el.command = el.tag;
            el.styleId = el.styleId

            var resultXml = "";
            
            resultXml += "<View ";
            resultXml += "id=\"" + el.id + "\" ";

            if (el.command == undefined) {
                resultXml += "speech_command=\"" + "no" + "\" ";
            }
            else{
                resultXml += "speech_command=\"" + el.command + "\" ";
            }

            if(isCallback){
               
               resultXml += "overlay_show_number=\"no\" "; 
               wearML.addHelpCommand(el.command);
               
            }
            else{
                el.style = wearML.getStyle(el.styleId);
                
                if (el.style != undefined) {
                    resultXml += wearML.wearMLParser(el.style, el);
                }
            }
            
            
            

            resultXml += "/> ";

            return resultXml;
        }

        for (var i = 0, n = wearML.wearMLElements.length; i < n; i++) {
            xml += parseElementIntoXml(wearML.wearMLElements[i],false);
        }
        
        for (var j = 0, k = wearML.callbackElements.length; j < k; j++){
            xml += parseElementIntoXml(wearML.callbackElements[j], true);
        }

        xml += "</WearML>";
        
        var encodedXML = this.utf8_to_b64(xml);
        
        var hideHelpString = wearML.shouldHideHelp ? "hf_hide_help|" : "";
        
        var helpCmdString = wearML.helpCommands.size == 0 ?
                            "" :
                            'hf_show_help_commands:' + wearML.listHelpCommands();
                            
        var wmlString =  (helpCmdString + hideHelpString + "hf_wearml_override:" + encodedXML); 

        return wmlString;
    };

    /**
     * Create Base64 String
     */
    this.utf8_to_b64 = function(str) {

        return window.btoa(unescape(encodeURIComponent(str)));
    };

    /**
     * Finding style based on class name and returns style
     */
    this.getStyle = function(className) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var classes = document.styleSheets[i].rules || document.styleSheets[i].cssRules
            if (classes != null){
                for (var x = 0; x < classes.length; x++) {
                    if (classes[x].selectorText == className) {
                        return classes[x].style;
                    }
                }
            }
        }
    };

    /**
     * Create Random GUID
     */
    this.guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    this.getPosition = function (el) {
        this.xPos = 0;
        this.yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                this.xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                this.yScroll = el.scrollTop || document.documentElement.scrollTop;

                this.xPos += (el.offsetLeft - this.xScroll + el.clientLeft);
                this.yPos += (el.offsetTop - this.yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                this.xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                this.yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return {
            x: this.xPos,
            y: this.yPos
        };
    };

    /**
     * Convert String to xml attribute
     */
    this.wearMLParser = function(e, element) {
        var attributes = "";
        

        /**
         * If we cant find a value and we have a root value use this....
         */
        var get_root = e != undefined ? e.getPropertyValue(this.root).trim() : "";
        var get_text_field = e != undefined ? e.getPropertyValue(this.text_field).trim() : this.root_text_field;
        var get_overlay_show_number =  e != undefined ? e.getPropertyValue(this.overlay_show_number).trim() : this.root_overlay_show_number;
        var get_overlay_show_text = e != undefined ? e.getPropertyValue(this.overlay_show_text).trim() : this.root_overlay_show_text;
        var get_overlay_persists = e != undefined ? e.getPropertyValue(this.overlay_persists).trim() : this.root_overlay_persists;
        var get_overlay_orientation = e != undefined ? e.getPropertyValue(this.overlay_orientation).trim() : this.root_overlay_orientation;
        var get_overlay_background_color = e != undefined ? e.getPropertyValue(this.overlay_background_color).trim() : this.root_overlay_background_color;
        var get_overlay_text_color = e != undefined ? e.getPropertyValue(this.overlay_text_color).trim() : this.root_overlay_text_color;
        var get_overlay_border_color = e != undefined ? e.getPropertyValue(this.overlay_border_color).trim() : this.root_overlay_border_color;
        var get_overlay_anchor_hv = e != undefined ? e.getPropertyValue(this.overlay_anchor_hv).trim() : this.root_overlay_anchor_hv;
        var get_overlay_show_dot = e != undefined ? e.getPropertyValue(this.overlay_show_dot).trim() : this.root_overlay_show_dot;
        var get_overlay_show_icon = e != undefined ? e.getPropertyValue(this.overlay_show_icon).trim() : this.root_overlay_show_icon;
        var get_overlay_offset = e != undefined ? e.getPropertyValue(this.overlay_offset).trim() : this.root_overlay_offset;
        var get_hf_scroll = e != undefined ? e.getPropertyValue(this.hf_scroll).trim() : this.root_hf_scroll;
        var get_barcode = e != undefined ? e.getPropertyValue(this.barcode).trim() : "";
        var get_global = e != undefined ? e.getPropertyValue(this.global).trim() : "";
        var get_hide_help = e != undefined ? e.getPropertyValue(this.hide_help).trim() : "";
        var get_broadcast_results = e != undefined ? e.getPropertyValue(this.broadcast_results).trim() : "";
        var get_include_help = e != undefined ? e.getPropertyValue(this.include_help).trim() : "";

           /*******************************************************************
             * Input type
             ******************************************************************/
        if (get_root != "") {
            if (get_root == "true") {
                this.root_text_field = get_text_field;
                this.root_overlay_show_number = get_overlay_show_number;
                this.root_overlay_show_text = get_overlay_show_text;
                this.root_overlay_persists = get_overlay_persists;
                this.root_overlay_orientation = get_overlay_orientation;
                this.root_overlay_background_color = get_overlay_background_color;
                this.root_overlay_text_color = get_overlay_text_color;
                this.root_overlay_border_color = get_overlay_border_color;
                this.root_overlay_anchor_hv = get_overlay_anchor_hv;
                this.root_overlay_show_dot = get_overlay_show_dot;
                this.root_overlay_show_icon = get_overlay_show_icon;
                this.root_overlay_offset = get_overlay_offset;
                this.root_hf_scroll = get_hf_scroll;
                this.root_hide_help = get_hide_help;
                this.root_include_help = get_include_help;
            }
        }

           /***************************************************************************
         * Input type
         **************************************************************************/
        if (get_text_field != "") {
            attributes += "text_field=\"" + get_text_field + "\" ";
        }

        /***************************************************************************
         * Show Number
         **************************************************************************/
        if (get_overlay_show_number != "") {
            if (get_overlay_show_number == "true") {
                attributes += "overlay_show_number=\"yes\" ";
            } else {
                attributes += "overlay_show_number=\"no\" ";
            }
        }

        /**
            Show Text
         **/
        if (get_overlay_show_text != "") {
            if (get_overlay_show_text == "true")
                attributes += "overlay_show_text=\"yes\" ";
            else {
                attributes += "overlay_show_text=\"no\" ";
            }
        }

        /**
            Show Overlay
         **/
        if (get_overlay_persists != "") {
            if (get_overlay_persists == "true")
                attributes += "overlay_persists=\"yes\" ";
            else {
                attributes += "overlay_persists=\"no\" ";
            }
        }

        /**
            Overlay Orientation
         **/
        if (get_overlay_orientation != "") {
            attributes += "overlay_orientation=" + get_overlay_orientation
                    + " ";
        }

        /**
            Overlay background color
         **/
        if (get_overlay_background_color != "") {
            attributes += "overlay_background_color="
                    + get_overlay_background_color + " ";
        }

        /**
            Overlay text color
         */
        if (get_overlay_text_color != "") {
            attributes += "overlay_text_color=" + get_overlay_text_color + " ";
        }

        /**
            Overlay border color
         */
        if (get_overlay_border_color != "") {
            attributes += "overlay_border_color=" + get_overlay_border_color
                    + " ";
        }

        /**
            Overlay anchor percent
         */
        if (get_overlay_anchor_hv != "") {
            attributes += "overlay_anchor=" + get_overlay_anchor_hv + " ";
        }

        /**
            Overlay show dot
         **/
        if (get_overlay_show_dot != "") {
            if (get_overlay_show_dot == "true")
                attributes += "overlay_show_dot=\"yes\" ";
            else {
                attributes += "overlay_show_dot=\"no\" ";
            }
        }

        /**
            Overlay show icon
         **/
        if (get_overlay_show_icon != "") {
            if (get_overlay_show_icon == "true")
                attributes += "overlay_show_icon=\"yes\" ";
            else {
                attributes += "overlay_show_icon=\"no\" ";
            }
        }

        /**
            Overlay offset
         **/
        if (get_overlay_offset != "") {
            attributes += "overlay_offset=" + get_overlay_offset + " ";
        }

        /**
            HF Scroll
         **/
        if (get_hf_scroll != "") {
            attributes += "scroll=" + get_hf_scroll + " ";
        }

        /**
           Barcode Reader
         **/
        if (get_barcode != "") {
            attributes += "barcode=" + get_barcode + " ";

        }

        /**
              Hide Help
         */
        if (get_hide_help != "") {
            
            wearML.shouldHideHelp = (get_hide_help == 'true') ? true : false;
        }

        /**
            Global Commands
         **/
        if (get_global != "") {
            if (get_global == "true")
                attributes += "global_commands=\"yes\" ";
            else {
                attributes += "global_commands=\"no\" ";
            }
        }

        /**
            BroadCast Commands
         **/
        if (get_broadcast_results != "") {
            if (get_broadcast_results == "true")
                attributes += "broadcast_results=\"yes\" ";
            else {
                attributes += "broadcast_results=\"no\" ";
            }
        }
        
        if(get_include_help != ""){
            console.log('Adding help command \'' + element.command + '\'');
            wearML.addHelpCommand(element.command);
        }
        
        return attributes;
    };
}