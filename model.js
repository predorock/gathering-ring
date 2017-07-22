const DIRECTIONS = {
    LEFT: 0,
    RIGHT:1
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.next = null;
        this.prev = null;
        this.paint = null;
        this.link = null;
    }

    setNext (next) {
        this.next = next;
    }

    setPrev (prev) {
        this.prev = prev;
    }

    getNext () {
        return this.next;
    }

    getPrev () {
        return this.prev;
    }
}

class Agent {
    
    constructor(initialNode, initDirection) {
        this.currentNode = initialNode;
        this.direction = initDirection;
        this.paint = null;
    }

    move () {
        var to = null;
        switch(this.direction) {
            case DIRECTIONS.LEFT:
                to = this.currentNode.getNext();
            break;
            case DIRECTIONS.RIGHT:
                to = this.currentNode.getPrev();
        }
        if (to !== null) {
            this.currentNode = to;
        }
        return to;
    }
}