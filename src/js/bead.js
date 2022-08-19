import { Aim } from "./aim.js";

const GRAVITY = 0.00004;
const PER = 0.0005;
const COR = 0.7;
const FRICTION = 0.02;
const FPS = 400/60;

export class Bead{
    constructor(x, y, radius, stageWidth, stageHeight, makingAim){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.makingAim = makingAim;
        this.aim = new Aim(x, y, 0, stageWidth, stageHeight);

        this.newX = x;
        this.newY = y;

        this.xv = 0;
        this.yv = 0;

        this.xa = 0;
        this.ya = GRAVITY;

        this.time = new Date().getTime();
        this.dt = 0;
    }

    draw(ctx){
        ctx.fillStyle = '#fdd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        this.update();
        this.aim.draw(ctx);
    }

    update(){
        if (this.makingAim){
            return;
        }
        this.newTime = new Date().getTime();
        this.newY = this.y + this.yv * (this.time - this.newTime) / FPS;
        this.newX = this.x + this.xv * (this.time - this.newTime) / FPS;

        this.containerCollision();

        this.x = this.newX;
        this.y = this.newY;

        this.xv += this.xa * (this.time - this.newTime) / FPS;
        this.yv += this.ya * (this.time - this.newTime) / FPS;
    }

    containerCollision(){
        if (this.newY >= this.stageHeight - this.radius){
            this.newY = this.stageHeight - this.radius;
            this.yv *= -COR;
            this.xv *= (1 - FRICTION);

        }
        else if (this.newY < this.radius){
            this.newY = this.radius;
            this.yv *= -COR;
            this.xv *= (1 - FRICTION);
        }
        if (this.newX >= this.stageWidth - this.radius){
            this.newX = this.stageWidth - this.radius;
            this.xv *= -COR;
            this.yv *= (1 - FRICTION);
        }
        else if (this.newX < this.radius){
            this.newX = this.radius;
            this.xv *= -COR;
            this.yv *= (1 - FRICTION);
        }
    }


    collide(point){
        return this.getDist(point) <= this.radius;
    }

    changeAim(point){
        this.makingAim = true;
        this.aim.change(this.x, this.y, point);
    }
    
    shoot(point){
        this.time = new Date().getTime();
        this.makingAim = false;
        this.aim.setRadius(0);
        this.yv = (this.y - point.y) * PER;
        this.xv = (this.x - point.x) * PER;
    }

    getDist(point){
        return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
    }

}