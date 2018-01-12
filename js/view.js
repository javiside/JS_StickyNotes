define(['underscore'], function (_) {
    var createButton = document.getElementById("createButton");
    var deleteButton = document.getElementById("deleteButton");
    var wrapper = document.getElementById("wrapper");
    var template = _.template(
        `<div id="<%= noteID %>" class="stickyDiv <%= noteClass %>" style="<%= noteStyle %>">
        <text>#<%= noteID %> <%= initInfo %></text>
        <button id="closeButton">X</button>
        <textarea cols="10" rows="10"><%= noteText %></textarea>
        <text id="modID"><%= modInfo %></text>
    </div>`);
    return {
        createButton: createButton,
        deleteButton: deleteButton,
        wrapContainer: wrapper,
        noteTemplate: template
    }
});