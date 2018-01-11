//PRESENTER:

require(['model', 'view', 'underscore'], function (model, view, _) {

    var identifier = 0; //notes identifier
    var wrapper = view.wrapContainer;

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
        var noteID = ++identifier;
        var noteClass = getRand(0, 5, "color");
        var initInfo = new Date().toJSON().substr(2, 14).replace('T', ' ');
        var modInfo = initInfo;
        var noteText = "";

        // saveNewNoteData(); TODO
        renderNote(noteID, noteClass, initInfo, modInfo, noteText);
    }

    function renderNote(noteID, noteClass, initInfo, modInfo, noteText) {
        var offSet = wrapper.offsetWidth / 5;
        var noteStyle = 
        "width: "+offSet+ 'px;'+
        "height:"+offSet+ 'px;'+
        "top: "+getRand(0, 70) + "%;"+
        "left:"+getRand(0, 80) + "%;";

        wrapper.innerHTML +=
            view.noteTemplate({
                noteClass: noteClass,
                noteStyle: noteStyle,
                topInfo: ("#" + noteID + " " + initInfo),
                noteText: noteText,
                modInfo: modInfo
            });
    }
    createNote(); //TODO implement observer pattern to bind click events
})
