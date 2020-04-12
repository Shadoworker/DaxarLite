# DaxarLite
Its all about safness !


#APP LOGIC :

Two windows : 
 - THE MAIN ONE (WHERE YOU HAVE COMMON ACTIONS)
 - THE AREA RECT

 ## The main window define the main app space

 ## The area rect , the recorded area.

 * Electron allows us to record a window or the entire screen but not a specific RECT (Area).


DAXAAR - LOGIC :

• CORE :This Logic needs 3 screens "Windows" (+ One)

 - A main app window 
    - With a basic init-streaming button
 - A "desired-screen-area-to-record" placeholder window a.k.a "area" 
    - Movable and Resizable
 - And a cropper window 
    - Containing a HTML5-canvas Element and a hidden HTML-video Element
    - And a Record/Stop button
    
 • PROCESS : 
 
 - Init streaming (On main app window)
 - The previous action displays the "desired-screen-area-to-record" placeholder window 
 - User Moves and/or Resizes the window "area"
 - User clicks on Record/Stop button to start the streaming
 - The "area" settings (x and y pos, width and height) are send to the cropper window
 - Cropper window :
    + Sets canvas size (width and height)
    + Starts the "whole" screen recording process
    + Load record stream data in the HTML-video Element and autoplays it
    + Draws the video-stream in the canvas at the specified position (To match the crop area:see CSS STYLING IN CODE)
    + Record Canvas area and push every Blob data into a chunksArray
    + On streaming stopped (either by MAX VIDEO DURATION or USER ACTION),
      the chunks are converted and saved to a proper video format (.MP4 , currently)

  • UPGRADE :
  - Working on a way to get a better rendering (HD) - Actual output seems not very net
  - Working on supporting more format (.MKV, .GIF)
  
  
  
  
  
  
  ## Ave Daxaar !

 
