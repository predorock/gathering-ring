$(function(){
    var agents = [];
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
    var center = new Node (200, 250);
    var links = [];

    ring.linkNodes(network, function (curr, next, prev, idx) {
        if (idx % 2 == 0) {
            agents.push(new Agent(curr, DIRECTIONS.LEFT));
        }
    });

    Raphael(function () {
        var ctx = Raphael("holder");
        draw.init(ctx);
        draw.createRing(network);
        links = draw.createLinks(network);
        draw.createAgents(agents);
    });

    function moveAgents () {
        agents.forEach(function(agent) {
            var to = agent.move()
            if (to !== null) {
                draw.moveAgent(agent.paint, to);
            }
        });  
    }

    $("#agents").text(agents.length);
    $(".nodes").text(network.length);

    $('#round').click(function (ev) {
        moveAgents();      
    });

    $('#link').click(function () {
        ring.linkNodes(network);
        links.forEach(function (l) {
            l.remove();
        })
        links = draw.createLinks(network);
    });

    $("#execution").click(function (ev) {
        var rounds = parseInt($("#rounds").val());
        if (rounds && Number.isInteger(rounds) && rounds > 0) {
            eagerLoop(function (reps) {
                $("#reps").text((rounds - (reps - 1)) - 1);
                moveAgents();
            }, rounds, 2000);
        }
    });
        
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