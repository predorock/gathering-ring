$(function(){

    var center = new Node (200, 250);
    var network = [
        new Node (200, 100),
        new Node (95, 145),
        new Node (50, 250),
        new Node (95, 355),
        new Node (200, 400),
        //sx
        new Node (305, 355),
        new Node (350, 250),
        new Node (305, 145),
    ];
    var agents = [];

    var paper = {
        nodes: [],
        agents: [],
        links: []
    }

    ring.linkNodes(network);

    var r = Raphael(function () {
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

            if (idx % 2 == 0) {
                paper.agents.push(
                    new GraphicAgent(
                        new Agent(gNode, DIRECTIONS.LEFT), 
                        draw.drawAgent(node)
                    )
                )
            }
        });

        ring.linkNodes(paper.nodes);
        $(".agents").text(paper.agents.length);
        $(".nodes").text(paper.nodes.length);
    });
    

    //UI SETUP -----------------------------------------------------
    var rounds = 0;
    function moveAgents () {
        paper.agents.forEach(function(agent) {
            var to = agent.move()
            if (to !== null) {
                draw.moveAgent(agent.getGraphic(), to);
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
        moveAgents();      
    });

    $('button[name=\'execute-more-rounds\']').click(function (ev) {
        var roundsToDo = $("input[type=\'number\'][name=\'rounds-to-do\']").val();
        roundsToDo = parseInt(roundsToDo);
        if (roundsToDo && Number.isInteger(roundsToDo) && roundsToDo > 0) {
            eagerLoop(function (reps) {
                incrementRounds();
                updateRounds();
                moveAgents();
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