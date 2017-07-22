var draw = (function (Raphael, ring) {
    
    var _ctx = null;
    var _ring = [];
    var _agents = [];
    var _links = [];
    
    return {
        init: init,
        createRing: createRing,
        createLinks:createLinks,
        createAgents: createAgents,
        moveAgent: moveAgent
    }

    function _drawNode (node) {
        _ctx.text(node.x + 40, node.y, '(' + node.x + ', ' + node.y +')');
        return _ctx.circle(node.x, node.y, 8)
            .attr({stroke: "none", fill: "#666"});
    }

    function _drawAgent (agentNode) {
        return _ctx.circle(
            agentNode.x,
            agentNode.y,
            10
        ).attr({stroke: "#fff", "stroke-width": 4});
    }

    function _drawLink (from, to) {
        var linkTo = ["M", from.x, " ", from.y].join("");
            linkTo = [linkTo, "L", to.x, " ", to.y].join("")
        return _ctx.path(linkTo).attr({stroke: "red", "stroke-width": 3, "stroke-linecap": "round"});
    }

    function init(ctx) {
        if (!ctx) {
            Raphael(function () {
                _ctx = Raphael("holder");
            });
        } else {
            _ctx = ctx;
        }
    }

    function createRing (nodes) {
        _ring = nodes.map(function (n) {
            var node = _drawNode(n);
            n.paint = n;
            return n;
        });
        return _ring;
    }

    function createAgents (agents) {
        _agents = agents.map(function (agent) {
            var a = _drawAgent(agent.currentNode);
            agent.paint = a;
            return agent;
        });
        return _agents;
    }

    function moveAgent (agent, to) {
        agent.stop()
            .animate({
                "100%": {cx: to.x, cy: to.y, easing:''}
            }, 1000);
    }
    
    function createLinks (nodes) {
        _links = nodes.map(function (node) {
            var link = _drawLink(node, node.getNext());

            link.node.onclick = function () {
                ring.removeLink(node);
                removeLink(node);
            }

            node.link = link;
            return link;
        });
        return _links;
    }

    function removeLink (node) {
        node.link.remove();
    }

})(Raphael, ring);