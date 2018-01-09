myStorage = window.localStorage;
(function () {
    var count = 1; //notes identifier
    /*
     * Get random values for position, rotate and color
     */
    function getRand(to, from, opt) {
        return opt == undefined ?
            Math.floor(Math.random() * to) + from :
            opt == "rotate" ?
                "rotate(" + (Math.floor(Math.random() * to) - from) + "deg)" :
                (function () {
                    var colors = ['red', 'white', 'yellow', 'green', 'RoyalBlue'];
                    return colors[getRand(colors.length, 0)];
                })()
    }
    /*
     *  Taking values from the saved notes, or creating new ones
     */
    window.createNote = function (noteID, noteText, created, mod, color, trans, top, left) {
        var wrapper = document.getElementById("wrapper");
        var div = document.createElement("div");
        var closeButton = document.createElement("button"); closeButton.id = "closeButton"; closeButton.appendChild(document.createTextNode("X"));
        var text = document.createElement("textarea");
        var modText = document.createElement("text"); modText.id = "modID";

        div.identifier = count = noteID || count; count++;
        div.createdTime = created || new Date().toJSON().substr(2, 14).replace('T', ' ');
        div.modDate = modText.textContent = mod || div.createdTime;
        div.className = "stickyDiv"; div.style.backgroundColor = div.noteColor = color || (getRand(5, 0, "color")); div.style.transform = div.noteTrans = trans || (getRand(10, 5, "rotate"));

        text.cols = "10"; text.rows = "10";
        text.value = div.noteText = noteText || "";

        div.appendChild(document.createTextNode("#" + div.identifier + " |" + div.createdTime + "|"));
        div.appendChild(closeButton);
        div.appendChild(text);
        div.appendChild(modText);

        wrapper.appendChild(div);

        //DEFAULT VALUES FOR WIDTH AND HEIGTH DEPENDING ON THE WINDOW's WIDTH////
        div.style.width = (wrapper.offsetWidth / 5) + 'px';
        div.style.height = (wrapper.offsetWidth / 5) + 'px';

        //DEFAULT VALUES FOR TOP AND LEFT//
        div.style.top = div.noteTop = (top || getRand(70, 0) + "%");
        div.style.left = div.noteLeft = (left || getRand(80, 0) + "%");
    }
    window.deleteNotes = function () {
        document.getElementById("wrapper").innerHTML = "";
    }

    window.updateNote = function () {
        target = event.target;
        parent = target.parentNode;
        if (target.type == "textarea") {
            parent.noteText = target.value;
            parent.children.modID.textContent = parent.modDate = new Date().toJSON().substr(2, 14).replace('T', ' ');
        }
    }
    /* 
     * Save the information when the users tries to exit
     */
    window.onbeforeunload = confirmExit;
    function confirmExit() {

        function Notes() { }; // Constructor for Notes

        window.localStorage.clear(); // Clearing the localStorage before add new info

        var collectNotes = (document.getElementById("wrapper").children); //collect all notes

        for (var i = 0; i < collectNotes.length; i++) {
            var current = collectNotes[i];
            var note = new Notes();
            //saving the relevant information
            note.identifier = current.identifier;
            note.noteText = current.noteText;
            note.createdTime = current.createdTime;
            note.modDate = current.modDate;
            note.noteColor = current.noteColor;
            note.noteTrans = current.noteTrans;
            note.top = current.noteTop;
            note.left = current.noteLeft;

            // converting the note object with its properties to string and saving on myStorage's new entry
            myStorage[i] = (JSON.stringify(note));
        }
        return "You have attempted to leave this page. Are you sure?";
    }
    /*
     * handling the event for the three posible buttons
     */
    window.addEventListener("click", function () {
        switch (event.target.id) {
            case "closeButton":
                event.target.parentNode.remove()
                break;
            case "createButton":
                createNote();
                break;
            case "deleteButton":
                deleteNotes();
                break;
            default:
                break;
        }
    });

    ///////////////FIXING WIDTH AND HEIGTH WHEN RESIZING THE WINDOW///////////////////////////////////////////////
    function changeSize() {
        var divs = document.getElementsByClassName("stickyDiv");
        for (var i = 0; i < divs.length; i++) {
            divs[i].style.width = (wrapper.offsetWidth / 5) + 'px';
            divs[i].style.height = (wrapper.offsetWidth / 5) + 'px';
        }
    }
    window.addEventListener("resize", changeSize);
    window.addEventListener("change", updateNote);
    ///////////////FIXING WIDTH AND HEIGTH WHEN RESIZING THE WINDOW///////////////////////////////////////////////

    /* 
     * Populate the wrapper with the saved notes (on windows load)
     */
    window.onload = function () {
        for (var savedNotes in myStorage) {
            var sNote = (JSON.parse(myStorage[savedNotes]));
            createNote(
                sNote.identifier,
                sNote.noteText,
                sNote.createdTime,
                sNote.modDate,
                sNote.noteColor,
                sNote.noteTrans,
                sNote.top,
                sNote.left
            );
        }
    }
})();