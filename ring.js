var ring = (function () {
    return {
        linkNodes: linkNodes,
        removeLink: removeLink
    }
    
    function linkNodes (nodes, hook) {
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

            if (typeof hook === 'function') {
                hook(nodes[i], next, prev, i);
            }
        }
    }

    function removeLink (node) {
        var next = node.getNext();
        next.setPrev(null);
        node.setNext(null);
    }
})();