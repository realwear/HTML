## Import WearML-Engine ##

The latest version of [wearMl_engine.js](https://github.com/realwear/HTML/blob/master/js/wearml_engine-min.js). After downloading include the javascript file to your web page. The script will only execute on android based devices with a screen size of 480x854.


## Adding a Speech Command ##

Once you have added the javascript file to your web page you can start adding speech commands to your HTML elements. Adding data-wml-speech-command="" to your element along with the speech command you want to register will allow the wearML engine to detect which element you would like to speech enable.

```javascript
<input data-wml-speech-command="Enter Username" class="form-control" type="text" placeholder="Username"/>
```

## Receiving a Speech Command ##


There are two ways a developer can receive a call back for a speech command. 

* Use the elements onClick event handler:

```javascript onclick="myfunction()"```

This function will be called when a speech command is recognized.

* Register a wearML callback:

```javascript
wearML.voiceCommandsCallBack = function(command){
    console.log("CallBack Received Command " + command);
}
```

This function will be called everytime a speech command is spoken and the variable will contain said command.

## Updating Voice Commands ##

In order to update voice commands the wearML engine will use a MutationObserver to detect the adding and removing of html dom elements. If you are finding that speech-commands and overlay's are not correctly updating when changing your html content you can call the public method: 

```javascript
wearML.updateCommands()
```
This will force the WearMLEngine to reload grammer and overlays.

## WearML Overlays ##

WearML Overlays are the hints provided by WearHF to help the user with navigating the current screen. WearML overlay's have many attributes and options to choose from in order to provided helpful hints to the user. There are many features contained in the wearML overlays and the API can be found below for reference. 

In order to customise the wearML overlay first create a CSS style and add custom css attributes using "--" and then appended the WearML Style attribute you wish to use.

```javascript
<style>
        .nativeSpeechRightAligned{
            --overlay_show_number:false;
            --overlay_show_dot:true;
            --overlay_persists:true;
            --overlay_anchor_hv:"110,50";
        }
</style>
```

Add the style to your dom element:

```javascript
<input data-wml-style=".nativeSpeechRightAligned" data-wml-speech-command="Enter Username"
                           class="form-control" type="text" placeholder="Username"/>
```



## DOM Attribute
|  Attribute | Description |
| --- | --- |
data-wml-speech-command  | String  | text|content_description|no|xxxx	Optional: Defines the source for the speech command. text will take the text attribute from the component. content_description will use that attribute from the component. no will turn the voice command off on the component all together. xxxx You are also able to provide a custom voice command here, e.g. xxxx
data-wml-style  | String  |	Optional: References to a CSS style using the classname.

## CSS Attribute
| Attribute | DataType | Description |
| --- | --- | --- |
--root  | Boolean  | All elements below this will inherit the attributes provided to this dom tag unless otherwise specified. 
--overlay_show_text   | Boolean  | Optional: Turns a text label on or off. Text on the label will be taken from the speech_command that is set. (default = no)
--overlay_persists  | Boolean  |	Optional: Number and/or overlay won’t fade away. (default = no, fades away)
--overlay_orientation  | String  |	left,right,top,bottom	Optional: Text overlay direction (default = right)
--overlay_background_color  | String | Optional: Changes the background color of the element String is represented as HEX
--overlay_text_color  | tring | Optional: Changes the background color of the element String is represented as HEX
--overlay_border_color  | String | Optional: Changes the background color of the element String is represented as HEX
--overlay_anchor_hv  | String as "H,V" | Optional: Sets the anchor point horizontally and vertically, specified as a percentage. 0 means anchor to left,top  edge of element. 100 means anchor to right,bottom edge of element. 50 means anchor to middle of element.
--overlay_show_dot | Boolean  | Optional: Turns purple dot icon on or off for the element. Off by default
--overlay_show_icon | Boolean  |Optional: Turns microphone icon on or off for the element. On by default if there is a text overlay
--hf_scroll | String | "None" = switches off headtracker "Horizontal" = Headtracker only works horizontally "Vertical" = Headtracker only work vertically
--text_field | String | "Dictation keyboard will open in dictation mode "keyboard" = default keyboard "barcode" barcode reader will open | Optional: On text field elements this will indicate what keyboard should be opened.
--barcode | String | any, qr , code128, up, cean | Optional: Will define which type of barcode is being scanned. Ignored if the text_field isn’t set to barcde. (default = any)
--global_commands  | Boolean  | Optional: Disables all global commands and hides show help, doesn’t matter which component it is applied to. 
--broadcast_results  | Boolean  | Optional: Broadcast ASR results via separate intent com.realwear.wearhf.intent.action.SPEECH_EVENT, including confidence scores. (default = no)
