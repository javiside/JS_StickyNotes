//PRESENTER:
define(['view', 'model', 'factory', 'underscore', 'events'], function (view, model, factory, _, events) {
    var identifier = localStorage['lastNote']; //notes identifier
    var getNewNotenDate = function () { return new Date().toJSON().substr(2, 14).replace('T', ' ') };

    var noteManager = {
        createNote: function (event) {
            if (event.type === "up" || event.type === "undo") {
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
                var note = (function (model, undoEvent) {
                    if (event.type === "undo") {
                        return factory.noteFactory.createNotes(undoEvent.note);
                    }
                    else {
                        identifier++; //every time we create a new note, we increment the identifier
                        var newNote = factory.noteFactory.createNotes({
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
                        model.historyStack.push({ name: "undoCreate", id: newNote.noteID.toString(), type: "undo" });
                        return newNote;
                    }
                })(model, event);

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

                        var savedNote = model.savedNotes[note.id];

                        //Save the previous info for the undo
                        model.historyStack.push({ name: "undoEdit", noteID: savedNote.noteID.toString(), prevText: savedNote.noteText, prevMod: savedNote.modInfo, type: "undo" });

                        //Save the new info
                        savedNote.noteText = textArea.value;
                        savedNote.modInfo = getNewNotenDate();
                        //Trigger the event for the view module
                        events.trigger('changeOnNotes', {
                            tagName: "UPDATED",
                            textEntered: savedNote.noteText,
                            newModDate: savedNote.modInfo,
                            targetID: textArea.parentNode.id,
                            modDate: note.children.modID
                        });
                    }, 600);
                }
            }
        },
        restoreText: function(event){
            var prevText = event.prevText;
            var prevMod = event.prevMod;
            model.savedNotes[event.noteID].noteText = prevText;
            model.savedNotes[event.noteID].modDate = prevMod;
            events.trigger('changeOnNotes', {
                tagName: "UPDATED",
                textEntered: prevText,
                newModDate: prevMod,
                targetID: event.noteID,
            });

        },
        closeNote: function (event) {
            if (event.type === "up" || event.type === "undo") {
                if (event.type === "undo"){
                    var id = event.id;
                }
                if (event.type !== "undo") {
                    var id = event.target.parentNode.parentNode.id;
                    model.historyStack.push({ name: "undoClose", note: model.savedNotes[id], type: "undo" });
                }
                delete model.savedNotes[id];
                delete localStorage[id];
                events.trigger('changeOnNotes', { tagName: "CLOSE", id: id });
            }
        },

        deleteAll: function (event) {
            if (event.type === "up" || event.type === "undo") {
                var saveAll = [];
                if (event.type !== "undo") {
                    for (var i in model.savedNotes) {
                        saveAll.push(model.savedNotes[i])
                        delete model.savedNotes[i];
                    }
                    model.historyStack.push({ name: "undoDeleteAll", deletedNotes: saveAll, type: "undo" });
                }
                events.trigger('changeOnNotes', { tagName: "DELETEALL" });
            }
        },
        restoreAll(event) {
            for (var i in event.deletedNotes) {
                this.saveNewNoteData(event.deletedNotes[i]);
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
            if (event.type === "down" || event.type === "undo") {
                var target = event.target.parentNode.parentNode;
                
                var initialLeft = target.style.left.substr(0, 2);
                var initialTop = target.style.top.substr(0, 2);
                if (event.type !== "undo") {
                event.target.addEventListener("drag", function (dragEvent) {
                    events.trigger("changeOnNotes", {
                        tagName: "MOVED",
                        event: dragEvent,
                        targetID: target.id
                    })
                });
                    event.target.ondragend = function (eventEnd) {
                        var target = eventEnd.target.parentNode.parentNode;
                        model.savedNotes[target.id].noteLeft = target.style.left.substr(0, 5);
                        model.savedNotes[target.id].noteTop = target.style.top.substr(0, 5);
                    }
                    model.historyStack.push({ name: "undoDrag", targetID: target.id, initialLeft: initialLeft, initialTop: initialTop, type: "undo" });

                }
                else{alert("should move back")}
            }
        },
        moveBack: function(event){
            var id = event.targetID;
            model.savedNotes[id].noteLeft = event.initialLeft;
            model.savedNotes[id].noteTop = event.initialTop;
            events.trigger('changeOnNotes', { tagName: "MOVEBACK", targetID: event.targetID, initialLeft: event.initialLeft, initialTop: event.initialTop});
        },
        undo: function (event) {
            var key = event.key;
            if (event.type == "up" || key == " " || key == 'Enter' || (key == 'z' && event.ctrlKey)) {
                if (model.historyStack.length > 0) {
                    var stack = model.historyStack;
                    var last = stack[stack.length - 1];

                    switch (last.name) {
                        case "undoCreate":
                            model.historyStack.pop();
                            this.closeNote(last);
                            break;
                        case "undoClose":
                            model.historyStack.pop();
                            this.createNote(last);
                            break;
                        case "undoDeleteAll":
                            model.historyStack.pop();
                            this.restoreAll(last);
                            break;
                        case "undoDrag":
                            model.historyStack.pop();
                            this.moveBack(last);
                            break;
                        case "undoEdit":
                            model.historyStack.pop();
                            this.restoreText(last);
                            break;

                        default:
                            break;
                    }
                } else { alert("No more undo items") }
            }
        },
        beforeunload: function () {
            for (var i in model.savedNotes) {
                localStorage[i] = JSON.stringify(model.savedNotes[i]);
            }
            localStorage.historyStack = JSON.stringify(model.historyStack);
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