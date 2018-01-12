define(['underscore', 'events'], function (_, events) {
    var wrapper = document.getElementById("wrapper");
    var offset = (wrapper.offsetWidth / 5);
    var template = _.template(
        `<div id="<%= noteID %>" class="stickyDiv <%= noteClass %>" 
            style=
            "
                width:<%= noteWidth %>px;
                height:<%= noteHeight %>px;
                left:<%= noteLeft %>%;
                top:<%= noteTop %>%;
            "
         >
        <text>#<%= noteID %> <%= initInfo %></text>
        <button id="closeButton">X</button>
        <textarea cols="10" rows="10"><%= noteText %></textarea>
        <text id="modID"><%= modInfo %></text>
    </div>`);

    //BIND EVENTS//
    addEventListener("resize", function (event) {events.trigger('sizeChanged', wrapper)});
    addEventListener("change", function (event) {events.trigger('noteUpdated', event.target)});
    addEventListener("click", function (event) {
        var target = event.target
        switch (target.id) {
            case "createButton": events.trigger('noteCreated', "Create clicked!"); break;
            case "closeButton": events.trigger('noteDeleted', target.parentNode); break;
            case "deleteButton": events.trigger('allDeleted', "Delete all clicked!");; break;
            default: break;
        }
    });

    events.on('changeOnNotes', render);

    function render(element) {
        switch (element.tagName) {
            case "NOTE": wrapper.innerHTML += template(element); break;
            case "DIV": element.remove(); break;
            case "DELETEALL": wrapper.innerHTML = ""; break;
            case "UPDATED":
            //Updating the note (div) properties instead of removing and replacing
                element.oldNoteArea.innerHTML = element.newNote.noteText;
                element.oldNoteMod.innerHTML = element.newNote.modInfo;
                element.oldNote.style.left = element.newNote.noteLeft+"%";
                element.oldNote.style.top = element.newNote.noteTop+"%";
                break;
            default: break;
        }
    }
    return {
        offset: offset
    }
});