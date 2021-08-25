define(function () {
  var savedNotes = {};
  var historyStack = JSON.parse(localStorage.historyStack || "[]");

  //Store saved historyStack and Notes on Load
  if (localStorage.length > 0) {
    for (var i in localStorage) {
      if (
        typeof localStorage[i] === "string" &&
        localStorage[i].slice(2, 6) == "note"
      ) {
        savedNotes[i] = JSON.parse(localStorage[i]);
      }
    }
  }

  return {
    savedNotes: savedNotes,
    historyStack: historyStack,
  };
});
