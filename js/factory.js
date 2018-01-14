define(function () {
     // A constructor for defining new notes
     function Note(options) {
        // Defaults
        this.noteID     = options.noteID     || "1";
        this.noteType   = options.noteType   || "note";
        this.tagName    = options.tagName    || "NOTE";
        this.noteClass  = options.noteClass  || "white";
        this.initInfo   = options.initInfo   || new Date().toJSON().substr(2, 14).replace('T', ' ');
        this.modInfo    = options.modInfo    || new Date().toJSON().substr(2, 14).replace('T', ' ');
        this.noteText   = options.noteText   || "";
        this.noteWidth  = options.noteWidth  || "20";
        this.noteHeight = options.noteHeight || "20";
        this.noteLeft   = options.noteLeft   || "10";
        this.noteTop    = options.noteTop    || "10";
        this.noteRot    = options.noteRot    || "5";
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
    var noteFactory = noteFactory || new NotesFactory();

    return{
        noteFactory : noteFactory 
    }
})