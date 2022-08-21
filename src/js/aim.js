const ANGLE = 0.05 * Math.PI;

export class Aim{
    constructor(x, y, radius, stageWidth, stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = 0;
        this.startAngle = 0;
        this.endAngle = 0;
        this.targetX = x;
        this.targetY = y;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = '#d61742';
        ctx.moveTo(this.targetX, this.targetY);
        ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
        ctx.fill();
    }

    change(x, y, point){
        this.x = x;
        this.y = y;
        this.targetX = point.x;
        this.targetY = point.y;
        this.radius = this.getDist(point) / 4 * 3;
        this.setAngle(point); 
    }

    getDist(point){
        return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
    } 

    setAngle(point){
        if (point.x- this.x === 0) {
            if (point.y <= this.y) this.angle = 0.5 * Math.PI;
            else this.angle = 1.5 * Math.PI;
            return;
        }
        let tan = (point.y - this.y) / (point.x - this.x);
        this.angle = Math.atan(tan);
        if (point.x < this.x) this.angle = this.angle + Math.PI;
        this.startAngle = this.angle - ANGLE;
        this.endAngle = this.angle + ANGLE;
    }

    setRadius(radius){
        this.radius = radius;
    }


}