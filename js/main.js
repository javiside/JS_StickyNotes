//PRESENTER:
define(['model', 'view', 'factory', 'resizing', 'underscore', 'events'], function (model, view, factory, resizing, _, events) {

    var identifier = 0; //notes identifier
    var getNewNotenDate = function () { return new Date().toJSON().substr(2, 14).replace('T', ' ') };

    events.on('noteCreated', createNote);
    events.on('noteDeleted', closeNote);
    events.on('allDeleted', deleteNotes);
    events.on('saveNote', saveNewNoteData);
    events.on('noteUpdated', updateNote);
    
    /* * Get random values for position, rotate and color */
    function getRand(from, to, opt) {
        return opt == undefined ?
            Math.floor(Math.random() * to) + from :
            opt == "rotate" ?
                "rotate(" + (Math.floor(Math.random() * to) - from) + "deg)" :
                (function () {
                    var colors = ['red', 'white', 'yellow', 'green', 'royalblue'];
                    return colors[getRand(0, colors.length)];
                })()
    }

    function createNote() {
        var note = factory.noteFactory.createNotes({
            noteType: "note",
            noteID: ++identifier,
            tagName: "NOTE",
            noteClass: getRand(0, 5, "color"),
            initInfo: getNewNotenDate(),
            modInfo: getNewNotenDate(),
            noteText: "",
            noteWidth: view.offset,
            noteHeight: view.offset,
            noteLeft: getRand(0, 80),
            noteTop: getRand(0, 70)
        });
        events.trigger('saveNote', note); //trigger the event when a new note has been created
    }

    function saveNewNoteData(note) {
        model.savedNotes[note.noteID] = note;
        events.trigger('changeOnNotes', note);
    }

    function updateNote(noteText) {
        var noteDiv = noteText.parentNode;
        var noteID = noteDiv.id;
        var savedNote = model.savedNotes[noteID];
        savedNote.noteText = noteText.value;
        savedNote.modInfo = getNewNotenDate();

        events.trigger('changeOnNotes', {
            tagName: "UPDATED", 
            oldNote: noteDiv, 
            newNote: model.savedNotes[noteID],
            oldNoteArea: noteText,
            oldNoteMod: noteDiv.children.modID
        });
    }

    function closeNote() {
        var parent = event.target.parentNode;
        var id = parent.id;
        delete model.savedNotes[id];
        events.trigger('changeOnNotes', parent);
    }

    function deleteNotes() {
        for (var i in model.savedNotes) {
            delete model.savedNotes[i];
        }
        events.trigger('changeOnNotes', {tagName: "DELETEALL"});
    }
})
