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
                transform: rotate(<%= noteRot %>deg);
            "
         >
        <div class="noteHeader">
            <text id="drag" class="noteInfo" draggable="true">#<%= noteID %> <%= initInfo %></text>
            <span id="closeNote">X</span>
        </div>
        <textarea id="updateNote" cols="10" rows="10"><%= noteText %></textarea>
        <text id="modID"><%= modInfo %></text>
    </div>`);


    //BIND EVENTS//
    addEventListener("beforeunload", confirmExit);
    addEventListener("resize", function (event) { events.trigger('sizeChanged', wrapper) });
    addEventListener("mousedown", function (event) { events.trigger('clicked', { name: event.target.id, target: event.target, type: "down", info: event }) });
    addEventListener("mouseup", function (event) { events.trigger('clicked', { name: event.target.id, target: event.target, type: "up" }) });
    addEventListener("keydown", function (event) { events.trigger('KeyDown', { name: event.target.id, textArea: event.target, note: event.target.parentNode, key: event.key }) });

    events.on('changeOnNotes', render);
    events.on('sizeChanged', changeSize);

    //Check localStorage for saved notes on load
    (function () {
        localStorage['lastNote'] = localStorage['lastNote'] || 0;
        if (localStorage.length > 0) {
            for (var i in localStorage) {
                if (typeof localStorage[i] === 'string' && localStorage[i].slice(2, 6) == 'note') {
                    var parsedNote = JSON.parse(localStorage[i]);
                    wrapper.innerHTML += template(parsedNote);

                    if (parsedNote.noteID > localStorage['lastNote']) {
                        localStorage['lastNote'] = parsedNote.noteID;
                    }
                }
            }
        }
    }
    )();

    function render(el) {
        switch (el.tagName) {
            case "NOTE": wrapper.innerHTML += template(el); break;
            case "DIV": el.remove(); break;
            case "DELETEALL": wrapper.innerHTML = ""; break;
            case "UPDATED":
                //Updating the note (div) text and modDate instead of removing and replacing
                el.textArea.innerHTML = el.textEntered;
                el.modDate.innerHTML = el.newModDate;
                break;
            case "SEARCH":
                wrapper.innerHTML = "";
                for (var i in el.notesFound) {
                    wrapper.innerHTML += template(el.notesFound[i]);
                }
                break;
            case "MOVED": (function (event) {
                var target = event.target;
                var event = event.event;

                if (event.pageX > 0 && event.pageX > 0) {
                    target.style.left = (((event.pageX - target.offsetWidth / 2) / window.innerWidth) * 100) + '%';
                    target.style.top = (((event.pageY - target.offsetHeight / 5) / window.innerHeight) * 100) + '%';
                }
            })(el);
                break
            default: break;
        }
    }

    function changeSize(wrapper) {
        var divs = wrapper.getElementsByClassName("stickyDiv");
        var offset = wrapper.offsetWidth / 5;

        for (var i = 0; i < divs.length; i++) {
            divs[i].style.width = offset + 'px';
            divs[i].style.height = offset + 'px';
        }
    }
    function confirmExit(event) {
        events.trigger('ExitApp', { name: event.type });

        var confirmationMessage = "You have attempted to leave this page. Are you sure?";
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
    return {
        offset: offset
    }
});