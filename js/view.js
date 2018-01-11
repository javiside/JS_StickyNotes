define(['underscore'], function (_) {
    var createButton = document.getElementById("createButton");
    var deleteButton = document.getElementById("deleteButton");
    var wrapper = document.getElementById("wrapper");
    var template = _.template(
        `<div class="stickyDiv <%= noteClass %>" style="<%= noteStyle %>">
        <text id="topInfo"><%= topInfo %></text>
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