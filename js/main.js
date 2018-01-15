//PRESENTER:
define(['view', 'model', 'factory', 'underscore', 'events'], function (view, model, factory, _, events) {
    var identifier = localStorage['lastNote']; //notes identifier
    var getNewNotenDate = function () { return new Date().toJSON().substr(2, 14).replace('T', ' ') };

    var noteManager = {
        createNote: function (event) {
            if (event.type === "up") {
                /* * Get random values for position, rotate and color */
                function getRand(opt, from, to) {
                    switch (opt) {
                        case "number": return Math.floor(Math.random() * to) + from; break;
                        case "rotate": return Math.floor(Math.random() * to) - from; break;
                        case "color":
                            return (function () {
                                var colors = ['red', 'white', 'yellow', 'green', 'royalblue', 'black', 'darkcyan'];
                                return colors[getRand("number", 0, colors.length)];
                            })()
                            break;
                        default:
                            return; break;
                    }
                };
                identifier++; //every time we create a new note, we increment the identifier
                var note = factory.noteFactory.createNotes({
                    noteType: "note",
                    noteID: identifier,
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
                events.trigger('sizeChanged', wrapper);
            }
        },

        saveNewNoteData: function (note) {
            model.savedNotes[note.noteID] = note;
            events.trigger('changeOnNotes', note);
        },
        /*Update the note when the text is changed*/
        updateNote: function (exec) {
            if (exec.textArea) {
                var textArea = exec.textArea;
                var note = exec.note;
                if (textArea.tagName === "TEXTAREA") {
                    if (exec.key == "\\") {
                        event.preventDefault();
                        return;
                    }
                    textArea.stopedTyping = textArea.stopedTyping || null;
                    //Add the editing class when typing
                    textArea.className = "editing";

                    clearTimeout(textArea.stopedTyping);
                    textArea.stopedTyping = setTimeout(function () {

                        //Change to the saved class and set back to default after 300ms
                        textArea.className = "saved";
                        setTimeout(function () { textArea.className = ""; }, 300);

                        //Save the new info
                        var savedNote = model.savedNotes[note.id];
                        savedNote.noteText = textArea.value;
                        savedNote.modInfo = getNewNotenDate();
                        //Trigger the event for the view module
                        events.trigger('changeOnNotes', {
                            tagName: "UPDATED",
                            textEntered: savedNote.noteText,
                            newModDate: savedNote.modInfo,
                            textArea: textArea,
                            modDate: note.children.modID
                        });
                    }, 600);
                }
            }
        },

        closeNote: function (event) {
            if (event.type === "up") {
                var parent = event.target.parentNode.parentNode; //target<header<note (div)
                var id = parent.id;
                delete model.savedNotes[id];
                delete localStorage[id];
                events.trigger('changeOnNotes', parent);
            }
        },

        deleteNotes: function (event) {
            if (event.type === "up") {
                for (var i in model.savedNotes) {
                    delete model.savedNotes[i];
                }
                localStorage.clear();
                events.trigger('changeOnNotes', { tagName: "DELETEALL" });
            }
        },
        search: function (exec) {
            if (exec.textArea) {
                var textArea = exec.textArea;
                if (textArea.tagName === "INPUT") {
                    if (exec.key == "\\") {
                        event.preventDefault();
                        return;
                    }
                    textArea.stopedTyping = textArea.stopedTyping || null;

                    clearTimeout(textArea.stopedTyping);

                    textArea.stopedTyping = setTimeout(function () {
                        var notesFound = {};
                        for (var i in model.savedNotes)
                            if (((model.savedNotes[i].noteText).search(textArea.value)) >= 0) {
                                notesFound[model.savedNotes[i].noteID] = model.savedNotes[i];
                            }
                        //Trigger the event for the view module
                        events.trigger('changeOnNotes', {
                            tagName: "SEARCH",
                            notesFound: notesFound,
                        });
                    }, 600);
                }
            }
        },
        drag: function (event) {
            if (event.type === "down") {
                event.target.addEventListener("drag", function (dragEvent) {
                    events.trigger("changeOnNotes", {
                        tagName: "MOVED",
                        event: dragEvent,
                        target: event.target.parentNode.parentNode
                    })
                });
                event.target.ondragend = function (eventEnd) {
                    var target = eventEnd.target.parentNode.parentNode;
                    model.savedNotes[target.id].noteLeft = target.style.left.substr(0, 5);
                    model.savedNotes[target.id].noteTop = target.style.top.substr(0, 5);
                }
            }
        },
        undo: function (event) {
            var key = event.key;
            if (event.type == "up" || key == " " || key == 'Enter' || (key == 'z' && event.ctrlKey)) {
                alert("UNDO or CTRL + Z");
            }
        },
        beforeunload: function () {
            for (var i in model.savedNotes) {
                localStorage[i] = JSON.stringify(model.savedNotes[i]);
            }

        },
        execute: function (exec) {
            return (exec.key === 'z' && exec.ctrlKey) ?
                noteManager["undo"].apply(noteManager, arguments) :
                noteManager[exec.name] && noteManager[exec.name].apply(noteManager, arguments);
        }
    };

    events.on('clicked', noteManager.execute);
    events.on('KeyDown', noteManager.execute);
    events.on('moving', noteManager.execute);
    events.on('ExitApp', noteManager.execute);

    return {
        identifier: identifier
    }
});