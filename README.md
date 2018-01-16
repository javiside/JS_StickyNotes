# README #

### Sticky Notes ###

* Sticky Notes usin JS and patterns
* version Alpha

### Version 0.1 ###

* Create notes button
* Close/delete notes button (on each note)
* Delete all notes burron
* Write text on the note
* Saving data using localStorage

### Version 0.3 ###
 [Fixed bug] Getting saved notes values from storage
 
### Version 0.4 ###
Added underscoreJS (templates) and requireJS (MVP); View: catching wrapper div and created notes' template, Module: added localStorage, Presenter/main: added identifier variable, getRand(), createNote() and Render() functions

### Version 0.5 ###
PRESENTER module: Implemented a factory when creating notes (factory pattern); MODEL module: added savedNotes variable; VIEW module: added createButton and deleteButton variables. Added an EVENTS module (observer pattern).

### Version 0.6 ###
Added Id property to div notes, merged similar render triggers

### Version 0.7 ###
Added resizing and factory modules; VIEW model: added listeners for click, resize and change, moved render to view model; PRESENTER module: added close, update and delete notes functions.

### Version 0.8 ###
Implemented Command pattern. Changed elements IDs. Added position rotation and size properties for notes. removed unnecessary events
 
### Version 0.9 ###
Added search and ordering (drag & drop) notes; moved resize module to view

### Version 0.10 ###
Added undo button and detecting ctrl + Z event. Changed notes style

### Version 0.11 ###
Finished undo event, added historyStack on model module.

### Version Alpha ###
Updated Read.me, first release (alpha) version
