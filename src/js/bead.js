import { Aim } from "./aim.js";
const GRAVITY = 0.00002;
const SHOOTSPEED = 0.001;
const COR = 0.6;
const FRICTION = 0.02;
const AIRRESIST = 0.0005;
const TIMEUNIT = 10;
const SOUNDNORM = 0.01;

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

        this.soundArray = [];
        for (let i = 0; i < 10; i++){
            const sound = new Audio();
            sound.src = "/src/Blop.mp3";
            sound.addEventListener('ended', () => {
                if (window.chrome){sound.load();}
                sound.muted = true;
                sound.pause();  
            })
            this.soundArray.push(sound);
        }

    }

    draw(ctx){
        ctx.fillStyle = '#fff80a';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        this.aim.draw(ctx);
        
        ctx.beginPath();
        ctx.moveTo(this.stageWidth/2, this.stageHeight/2);
        let gravX = this.stageWidth/2 + this.xa * 2000000;
        let gravY = this.stageHeight/2 + this.ya * 2000000;
        ctx.lineTo(gravX, gravY);
        ctx.strokeStyle = "#feb139"
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "#feb139";
        ctx.arc(gravX, gravY, 5, 0, 2* Math.PI);
        ctx.fill();

        this.update();

    }

    update(){
        if (this.makingAim){
            return;
        }
        let newTime = new Date().getTime();
        this.dt = this.time - newTime; 
        this.xv = (this.xv + this.xa * this.dt * TIMEUNIT) * (1 - AIRRESIST);
        this.yv = (this.yv + this.ya * this.dt * TIMEUNIT) * (1 - AIRRESIST);
        this.newY = this.y + this.yv * this.dt * TIMEUNIT;
        this.newX = this.x + this.xv * this.dt * TIMEUNIT;

        this.wallCollision();

        this.time = newTime;
        this.x = this.newX;
        this.y = this.newY;
    }

    wallCollision(){
        if (this.newY >= this.stageHeight - this.radius){
            this.newY = this.stageHeight - this.radius;
            if (Math.abs(this.yv) > SOUNDNORM) this.playSound();
            this.yv *= -COR;
            this.xv *= (1 - FRICTION);
        }
        else if (this.newY < this.radius){
            this.newY = this.radius;
            if (Math.abs(this.yv) > SOUNDNORM) this.playSound();
            this.yv *= -COR;
            this.xv *= (1 - FRICTION);
        }

        if (this.newX >= this.stageWidth - this.radius){
            this.newX = this.stageWidth - this.radius;
            if (Math.abs(this.xv) > SOUNDNORM) this.playSound();
            this.xv *= -COR;
            this.yv *= (1 - FRICTION);
        }
        else if (this.newX < this.radius){
            this.newX = this.radius;
            if (Math.abs(this.yv) > SOUNDNORM) this.playSound();
            this.xv *= -COR;
            this.yv *= (1 - FRICTION);
        }
        else return false;
        return true;
    }

    ballStopped(){
        return false;
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
        this.yv = (this.y - point.y) * SHOOTSPEED;
        this.xv = (this.x - point.x) * SHOOTSPEED;
    }

    deviceMotion(e){
        let accGravity = e.accelerationIncludingGravity;
        
        let xa = (accGravity.x || 0) / 9.8;
        let ya = (accGravity.y || 0) / 9.8;

        if (!(xa || ya)) {
            this.xa = 0;
            this.ya = GRAVITY;
            return;
        }

        this.xa = -xa * GRAVITY;
        this.ya = ya * GRAVITY;
    
    }

    getDist(point){
        return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
    }

    playSound(){
        for (let i = 0; i < 10; i++){
            if (this.soundArray[i].paused){
                this.soundArray[i].play();
                this.soundArray[i].muted = false;
                break;
            }
        }

    }

}