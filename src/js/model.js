const DIRECTIONS = {
    LEFT: 0,
    RIGHT:1
}

class Node {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.next = null;
        this.prev = null;
    }

    getName () {
        return this.name;
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
    reset () {
        this.next = null;
        this.prev = null;
    }
    toString () {
        return this.getName() + ' (' + this.x + ', ' + this.y + ')';
    }
}

class Agent {
    
    constructor(name, initialNode, initDirection) {
        this.name = name;
        this.currentNode = initialNode;
        this.direction = initDirection;
    }

    getName () {
        return this.name;
    }

    getCurrentNode () {
        return this.currentNode;
    }

    setDirection(direction) {
        if (direction === DIRECTIONS.LEFT || direction === DIRECTIONS.RIGHT) {
            this.direction = direction;
        }
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

    toString () {
        return "Agent " + this.name;
    }
}