define(function(){
    var myStorage = window.localStorage;
    var savedNotes = {};
    return {
        myStorage : myStorage,
        savedNotes : savedNotes
    }
})