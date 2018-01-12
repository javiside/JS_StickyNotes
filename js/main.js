//PRESENTER:
require(['model', 'view', 'underscore', 'events'], function (model, view, _, events) {

    var identifier = 0; //notes identifier
    var wrapper = view.wrapContainer;
    var offSet = wrapper.offsetWidth / 5;
    var getNewNotenDate = function () { return new Date().toJSON().substr(2, 14).replace('T', ' ') };

    //BIND EVENTS//
    addEventListener("click", handleClick);

    events.on('noteCreated', saveNewNoteData);
    events.on('changeOnNotes', render);

    function handleClick(event) {
        var eID = event.target.id;
        switch (eID) {
            case "closeButton": closeNote(); break;
            case "createButton": createNote(); break;
            case "deleteButton": deleteNotes(); break;
            default: break;
        }
        if (eID == "closeButton" || eID == "createButton" || eID == "deleteButton"){
            events.trigger('changeOnNotes', model.savedNotes);
        }
    }

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
        // A constructor for defining new notes
        function Note(options) {
            // Defaults
            this.noteID = options.noteID || ++identifier;
            this.noteClass = options.noteClass || getRand(0, 5, "color");
            this.initInfo = options.initInfo || getNewNotenDate();
            this.modInfo = options.modInfo || initInfo;
            this.noteText = options.noteText || "";
            this.noteStyle =
                "width: " + offSet + 'px;' + "height:" + offSet + 'px;' +
                "left:" + getRand(0, 80) + "%;" + "top: " + getRand(0, 70) + "%;";
        }

        // Define a skeleton note factory
        function NotesFactory() { };

        // DEFINE THE PROTYTPES AND UTILITIES FOR THIS FACTORY
        // Our default noteClass is Note
        NotesFactory.prototype.noteClass = Note;

        // Our Factory method for creating new Note instances
        NotesFactory.prototype.createNotes = function (options) {
            switch (options.noteType) {
                case "note":
                    this.noteClass = Note;
                    break;
                default:
                    break;
            }
            return new this.noteClass(options);
        };

        // Create an instance of our factory that makes notes
        var noteFactory = new NotesFactory();

        var note = noteFactory.createNotes({
            noteType: "note",
            noteID: ++identifier,
            noteClass: getRand(0, 5, "color"),
            initInfo: getNewNotenDate(),
            modInfo: getNewNotenDate(),
            noteText: "",
        });

        //trigger the event when a new note has been created
        events.trigger('noteCreated', note);
    }

    //Save note's data
    function saveNewNoteData(note) {
        model.savedNotes[note.noteID] = note;
    }

    function closeNote() {
        var id = event.target.parentNode.id;
        delete model.savedNotes[id];
    }

    function deleteNotes(){
        wrapper.innerHTML = "";
        for (var i in model.savedNotes) {
            delete model.savedNotes[i];
        }
    }
    function render(savedNotes) { //TODO refactorize render function

        wrapper.innerHTML = "";
        for (var i in savedNotes) {
            wrapper.innerHTML += view.noteTemplate(savedNotes[i]);
        }
        console.dir(model.savedNotes)
    }

})
