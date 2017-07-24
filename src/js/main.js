$(function(){

    var center = new Node ("center", 250, 250);
    var network = [
        new Node ("I", 250, 100),
        new Node ("B", 145, 145),
        new Node ("C", 100, 250),
        new Node ("D", 145, 355),
        new Node ("E", 250, 400),
        //sx
        new Node ("F", 355, 355),
        new Node ("G", 400, 250),
        new Node ("H", 355, 145),
    ];
    var agents = [];

    var paper = {
        nodes: [],
        agents: [],
        links: []
    }

    var ctx = null;
    var statusLegenda = null;

    ring.linkNodes(network);

    Raphael(function () {
        ctx = Raphael("holder");
        statusLegenda = ctx.set();
        draw.init(ctx);

        draw.setCenter(center);
        ctx.circle(center.x, center.y, 4).attr({stroke:'none', fill:"#0f0"});

        network.forEach(function (node, idx) {
            var gNode = new GraphicNode(node, draw.drawNode(node));
            var linkTo = draw.drawLink(node, node.getNext(), "green");
            var linkFrom = draw.drawLink(node, node.getPrev(), "red", true);

            linkTo.node.onclick = function (ev) {
                linkTo.hide();
                node.next = null;
            }

            linkFrom.node.onclick = function (ev) {
                linkFrom.hide();
                node.prev = null;
            }
            paper.nodes.push(gNode);
            paper.links.push(linkTo);
            paper.links.push(linkFrom);
        });

        paper.agents = generateAgents(4, paper.nodes);

        $(".agents").text(paper.agents.length);
        $(".nodes").text(paper.nodes.length);

        //legenda
        ctx.path([["M", 500, 30], ["L", 550, 30]])
            .attr({stroke: "red", "stroke-width": 2, "stroke-linecap": "round"})
        ctx.text(560, 28, "out link")
            .attr({'text-anchor': 'start', fill:"white"});

        ctx.path([["M", 500, 60], ["L", 550, 60]])
            .attr({stroke: "green", "stroke-width": 2, "stroke-linecap": "round"})
        ctx.text(560, 58, "in link")
            .attr({'text-anchor': 'start', fill:"white"});

        refreshStatus(ctx);
    });

    function refreshStatus() {
        statusLegenda.remove();
        paper.agents.forEach(function(agent, idx) {
            var text = agent.toString() + ' ON ' + agent.getCurrentNode().toString();
            statusLegenda.push(
                ctx.text(500, 90 + 30*idx, text)
            );
        });
        statusLegenda.attr({'text-anchor': 'start', fill: "#fff"});
    }
    

    //UI SETUP -----------------------------------------------------
    var rounds = 0;
    function moveAgents (agents) {
        agents.forEach(function(agent) {
            var to = agent.move()
            if (to !== null) {
                draw.moveAgent(agent, to);
            }
        });  
        refreshStatus(ctx);
    }

    function updateRounds() {
        $(".rounds-number").text(rounds);
    }

    function incrementRounds () {
        rounds++;
    }

    function resetRounds(){
        rounds--;
    }

    $('button[name=\'execute-round\']').click(function (ev) {
        incrementRounds();
        updateRounds();
        moveAgents(paper.agents);      
    });

    $('button[name=\'execute-more-rounds\']').click(function (ev) {
        var roundsToDo = $("input[type=\'number\'][name=\'rounds-to-do\']").val();
        roundsToDo = parseInt(roundsToDo);
        if (roundsToDo && Number.isInteger(roundsToDo) && roundsToDo > 0) {
            eagerLoop(function (reps) {
                incrementRounds();
                updateRounds();
                moveAgents(paper.agents);
            }, roundsToDo, 2000);
        }
    });

    $('button[name=\'reset\']').click(function () {
        paper.links.forEach(function (link) {
            if (link) {
                link.show();
            }
        });
        paper.nodes.forEach(function (node) {
            node.reset();
        });
        ring.linkNodes(paper.nodes);
    });

    $('input[type=\'radio\'][name=\'agents-direction\']').change(function(ev) {
        var dir = parseInt($(this).val());
        paper.agents.forEach(function(agent) {
            agent.setDirection(dir);
        });
    });

    updateRounds();
        
});

function generateAgents (numOfAgents, nodes) {
    var agents = [];
    if (numOfAgents > nodes.length /2) {
        throw new Error ("number of agents is too high");
    } else {
        
        var positions = nodes.map(function(n, i) {return i});

        agents = positions
            .shuffle()
            .slice(0, numOfAgents)
            .map(function(pos, idx) {
                var newAgent = new Agent("A" + idx, nodes[pos], DIRECTIONS.LEFT);
                return new GraphicAgent(newAgent, 
                    draw.drawAgent(newAgent, nodes[pos])
                )
            });
    }
    return agents;
}

function eagerLoop (fn, reps, delay) {
    fn(reps);
    timeoutLoop(fn, reps-1, delay);
}

function timeoutLoop(fn, reps, delay) {
  if (reps > 0) {
    setTimeout(function() {
                fn(reps);
                timeoutLoop(fn, reps-1, delay);
    }, delay);
  }
}