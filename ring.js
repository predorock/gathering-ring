var ring = (function () {
    return {
        linkNodes: linkNodes
    }
    
    function linkNodes (nodes) {
        for(var i = 0; i < nodes.length; i++) {
            var next = null;
            var prev = null;
            if (i == 0) {
                prev = nodes[nodes.length - 1];
            } else {
                prev = nodes[i - 1];
            }

            if (i == (nodes.length - 1)) {
                next = nodes[0];
            } else {
                next = nodes[i + 1];
            }

            nodes[i].setPrev(prev);
            nodes[i].setNext(next);
        }
    };
})();