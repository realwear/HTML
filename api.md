## Adding a Speech Command ##

Once you have added the javascript file to your web page you can start adding speech commands to your html elements. Adding data-wml-speech-command="" to your element along with the speech command you want to register will allow the wearML engine to detect which element you would like to speech enable.

<code>
                    &lt;inputdata-wml-speech-command="Enter Username"
                           class="form-control" type="text" placeholder="Username"&gt;
</code>


## Receiving a Speech Command ##


There are two ways a developer can receive a call back for a speech command. A developer can use the standard html element attribute <code>onclick="myfunction()"</code> and this function will be called when a speech command is recognized.
Second option will allow a developer to registered a genenric callback as such:

<code>

wearML.voiceCommandsCallBack = function(command){
    console.log("CallBack Received Command " + command);
}

</code>


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