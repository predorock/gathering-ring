class GraphicAgent {

    constructor (agent, graphicObject) {
        this.agent = agent;
        this.graphicObject = graphicObject;
    }

    getName () {
        return this.agent.getName();
    }

    getCurrentNode() {
        return this.agent.getCurrentNode();
    }

    getGraphic () {
        return this.graphicObject;
    }

    move () {
        return this.agent.move();
    }

    setDirection (dir) {
        this.agent.setDirection(dir);
    }

    toString () {
        return this.agent.toString()
    }
}

class GraphicNode {
    
    constructor(node, graphicObject) {
        this.node = node;
        this.x = node.x;
        this.y = node.y;
        this.graphicObject = graphicObject;
    }

    getName () {
        return this.node.getName();
    }

    getGraphic () {
        return this.graphicObject;
    }

    setNext (next) {
        this.node.setNext(next);
    }

    setPrev (prev) {
        this.node.setPrev(prev);
    }

    getNext () {
        return this.node.getNext()
    }

    getPrev () {
        return this.node.getPrev();
    }

    reset () {
        return this.node.reset();
    }

    toString () {
        return this.node.toString()
    }
}

class GraphicLink {
    constructor (link, nodeA, nodeB) {
        this.link = link;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
    }
}

var draw = (function (Raphael) {
    
    var _ctx = null;
    var _center = null;
    var _focusDistance = 60;
    
    return {
        init:        _init,
        setCenter:   _setCenter,
        drawAgent:   _drawAgent,
        drawNode:    _drawNode,
        drawLink:    _drawLink,
        removeLink:  _removeLink,
        moveAgent:   _moveAgent,
        focusPoints: _focusPoints,
        setFocusDistance: _setFocusDistance
    }

    function _distance (a,b) {
        return Math.sqrt(
            Math.abs(Math.pow(a.x - b.x, 2)) +
            Math.abs(Math.pow(a.y - b.y, 2))
        );
    }

    function _middlePoint (a, b) {
        return {
            x: (a.x + b.x)/2,
            y: (a.y + b.y)/2
        };
    }

    function _movePoint(a, b, amount) {
        var d = _distance(a, b),
            ratio = (d + amount)/d;
        return {
            x: ((1 - ratio) * a.x) + (ratio * b.x),
            y: ((1 - ratio) * a.y) + (ratio * b.y)
        };
    }

    function _drawNode (node) {
        
        return _ctx.set(
            _ctx.circle(node.x, node.y, 8)
                .attr({stroke: "none", fill: "#666"}),
            _ctx.text(node.x + 40, node.y, node.toString())
        )
    }

    function _drawAgent (agent, agentNode) {
        return _ctx.set(
            _ctx.circle(agentNode.x, agentNode.y,10)
                .attr({stroke: "#fff", "stroke-width": 4}),
            _ctx.text(agentNode.x, agentNode.y - 40, agent.toString())
                .attr({fill: "#fff"})
        )
    }

    function _drawLink (from, to, color, changeFocus) {

        var path  = null;
        var focus = null;
        color = color ? color : "red";
        if (_center !== null) {
            var f = changeFocus ? -1 : 1;
            var middle = _middlePoint(from, to);
            focus  = _movePoint(_center, middle, f * _focusDistance);
            path = [["M", from.x, from.y], ["Q", focus.x, focus.y, to.x, to.y]];
        } else {
            path = [["M", from.x, from.y], ["L", to.x, to.y]];
        }
        var link = _ctx.path(path).attr({stroke: color, "stroke-width": 3, "stroke-linecap": "round"});
        link.focus = focus;
        return link;
    }

    function _init(ctx) {
        if (!ctx) {
            Raphael(function () {
                _ctx = Raphael("holder");
            });
        } else {
            _ctx = ctx;
        }
    }

    function _setCenter (p) {
        _center = p;
    }

    function _moveAgent (agent, to) {
        agent.getGraphic()
            .stop()
            .animate({
                "100%": {cx: to.x, cy: to.y, x: to.x, y: to.y - 40, easing:''}
            }, 1000);
    }

    function _removeLink (link) {
        return link.remove();
    }

    function _focusPoints (links) {
        return links.map(function (link) {
            return link.focus;
        });
    }

    function _setFocusDistance (x) {
        if (Number.isInteger(x) && Number.isFinite(x) && x < 100) {
            _focusDistance = x;
        }
    }

})(Raphael);