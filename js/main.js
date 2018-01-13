//PRESENTER:
define(['model', 'view', 'factory', 'resizing', 'underscore', 'events'], function (model, view, factory, resizing, _, events) {

    var identifier = 0; //notes identifier
    var getNewNotenDate = function () { return new Date().toJSON().substr(2, 14).replace('T', ' ') };

    var noteManager = {
        createNote: function () {
           //Get random color, positions, and rotation
            function getRand(opt, from, to) {
                return opt == "number" ?
                    Math.floor(Math.random() * to) + from :
                    opt == "rotate" ?
                        (Math.floor(Math.random() * to) - from) :
                        (function () {
                            var colors = ['red', 'white', 'yellow', 'green', 'royalblue', 'black', 'pink'];
                            return colors[getRand("number", 0, colors.length)];
                        })()
            };
            var note = factory.noteFactory.createNotes({
                noteType: "note",
                noteID: ++identifier,
                tagName: "NOTE",
                noteClass: getRand("color"),
                initInfo: getNewNotenDate(),
                modInfo: getNewNotenDate(),
                noteText: "",
                noteWidth: view.offset,
                noteHeight: view.offset,
                noteLeft: getRand("number", 0, 80),
                noteTop: getRand("number", 0, 70),
                noteRot: getRand("rotate", 5, 10)
            });
            this.saveNewNoteData(note);
        },

        saveNewNoteData: function (note) {
            model.savedNotes[note.noteID] = note;
            events.trigger('changeOnNotes', note);
        },

        updateNote: function (exec) {
            var noteText = exec.note;
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
        },

        closeNote: function () {
            var parent = event.target.parentNode;
            var id = parent.id;
            delete model.savedNotes[id];
            events.trigger('changeOnNotes', parent);
        },

        deleteNotes: function () {
            for (var i in model.savedNotes) {
                delete model.savedNotes[i];
            }
            events.trigger('changeOnNotes', { tagName: "DELETEALL" });
        },

        execute: function (exec) {
            return noteManager[exec.name] && noteManager[exec.name].apply(noteManager, arguments);
        }
    };
    events.on('clicked', noteManager.execute);
    events.on('noteUpdated', noteManager.execute);



    
    /* * Get random values for position, rotate and color */





})

