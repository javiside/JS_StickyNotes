define(['events'], function(events){
    events.on('sizeChanged', changeSize);

    function changeSize(wrapper){
        var divs = wrapper.getElementsByClassName("stickyDiv");
        var offset = wrapper.offsetWidth / 5;
        
        for (var i = 0; i < divs.length; i++) {
            divs[i].style.width = offset + 'px';
            divs[i].style.height = offset + 'px';
        }
    }
})