const FPS = 1000 / 60;
const GRAVITY = 0.0001;


export class Bead{
    constructor(x, y, radius, stageWidth, stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.originX = x;
        this.originY = y;        
        this.time = new Date().getTime();

    }

    draw(ctx){
        ctx.fillStyle = '#fdd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        this.gravity();

    }

    gravity(){
        if (this.y <= this.stageHeight){ 
            let height = this.stageHeight - this.y;
            this.y += (GRAVITY * ((new Date().getTime() - this.time) ** 2)) / FPS ;
        }
    }

    collide(point){
        if (Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2) <= this.radius){
            return true;
        }
        return false;

    }




}