# DaxarLite
Its all about safness !


#APP LOGIC :

Two windows : 
 - THE MAIN ONE (WHERE YOU HAVE COMMON ACTIONS)
 - THE AREA RECT

 ## The main window define the main app space

 ## The area rect , the recorded area.

 * Electron allows us to record a window or the entire screen but not a specific RECT (Area).


DAXAR - LOGIC :

 + Recording whole screen
 + Having a placeholder needed area window
 + Having a window with a HTML5 canvas :
    - Getting the area placeholder size and pos 
    - And streaming the recorded whole screen stream (But conveniently Cropped)
 + Finally getting the canvas stream and saving it into a Video formated file (.mp4)

 