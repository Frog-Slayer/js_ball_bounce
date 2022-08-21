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
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
    }

    draw(ctx){
        ctx.fillStyle = '#fdd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.stageWidth/2, this.stageHeight/2);
        ctx.lineTo(this.stageWidth/2 + this.xa / this.getDist2({x: this.xa, y: this.ya}, {x: 0, y: 0}) * 200, 
                    this.stageHeight/2 + this.ya / this.getDist2({x: this.xa, y: this.ya}, {x: 0, y: 0}) * 200);
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2;
        ctx.stroke();

        this.update();
        this.aim.draw(ctx);
    }

    update(){
        if (this.makingAim){
            return;
        }
        let newTime = new Date().getTime();
        this.dt = this.time - newTime; 
        this.xv += this.xa * this.dt / FPS;
        this.yv += this.ya * this.dt / FPS;
        this.newY = this.y + this.yv * this.dt / FPS;
        this.newX = this.x + this.xv * this.dt / FPS;

        this.containerCollision();

        this.x = this.newX;
        this.y = this.newY;
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

    tilt(alpha, beta, gamma){
        if (!(alpha || beta || gamma)){
            return;
        }
        let alphaRad = (alpha) * Math.PI / 180;
        let betaRad  = (beta) * Math.PI / 180;
        let gammaRad = (gamma) * Math.PI / 180;
        let acc = {x : 0, y: 0, z: GRAVITY};
        acc = this.yaw(this.pitch(this.roll(acc, alphaRad), betaRad), gammaRad);
        this.alpha = alpha;
        this.beta = beta;
        this.gamma= gamma;

        this.xa = acc.x;
        this.ya = acc.y;
    }

    yaw(acc, alpha){
        let newX = Math.cos(alpha) * acc.x- Math.sin(alpha) * acc.y;
        let newY = Math.sin(alpha) * acc.x + Math.cos(alpha) * acc.y;
        let newZ = acc.z;
        return {x :newX, y: newY, z: newZ};
    }

    pitch(acc, beta){
        let newX = acc.x;
        let newY = Math.cos(beta) * acc.y - Math.sin(beta) * acc.z;
        let newZ = Math.sin(beta) * acc.y + Math.cos(beta) * acc.z;
        console.log(newX, newY, newZ);
        return {x : newX, y : newY, z : newZ};
    }

    roll(acc, gamma) {
        let newX = Math.cos(gamma) * acc.x + Math.sin(gamma) * acc.z;
        let newY = acc.y;
        let newZ = -Math.sin(gamma) * acc.x + Math.cos(gamma) * acc.z;
        return {x: newX, y: newY, z: newZ};
    }

    getDist(point){
        return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
    }

    getDist2(point1, point2){
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y)**2);
    }

}