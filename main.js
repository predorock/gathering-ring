$(function(){

    var center = new Node ("center", 200, 250);
    var network = [
        new Node ("I", 200, 100),
        new Node ("B", 95, 145),
        new Node ("C", 50, 250),
        new Node ("D", 95, 355),
        new Node ("E", 200, 400),
        //sx
        new Node ("F", 305, 355),
        new Node ("G", 350, 250),
        new Node ("H", 305, 145),
    ];
    var agents = [];

    var paper = {
        nodes: [],
        agents: [],
        links: []
    }

    ring.linkNodes(network);

    Raphael(function () {
        var ctx = Raphael("holder");
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
        ctx.path([["M", 400, 30], ["L", 450, 30]])
        .attr({stroke: "red", "stroke-width": 2, "stroke-linecap": "round"})
        ctx.text(470, 28, "out link").attr({fill:"white"});

        ctx.path([["M", 400, 60], ["L", 450, 60]])
        .attr({stroke: "green", "stroke-width": 2, "stroke-linecap": "round"})
        ctx.text(470, 58, "in link").attr({fill:"white"});
        console.log("paper", paper);
    });
    

    //UI SETUP -----------------------------------------------------
    var rounds = 0;
    function moveAgents (agents) {
        agents.forEach(function(agent) {
            var to = agent.move()
            if (to !== null) {
                draw.moveAgent(agent, to);
            }
        });  
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