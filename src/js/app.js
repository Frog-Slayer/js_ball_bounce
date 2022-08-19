import { Bead } from "./bead.js";
import { Point } from "./point.js";

export class App{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        
        this.mousePos = new Point();

        this.bead = new Bead(100, 300, 50, this.stageWidth, this.stageHeight);
        requestAnimationFrame(this.animate.bind(this));
    
        this.canvas.addEventListener('pointerdown', this.onDown.bind(this),false);
        this.canvas.addEventListener('pointermove', this.onMove.bind(this),false);
        this.canvas.addEventListener('pointerup', this.onUp.bind(this),false);
    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2);
    }

    onDown(e){
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    }

    onMove(e){
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        
    }

    onUp(e){
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    }




    animate(t){
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        if (this.bead.collide(this.mousePos)) {
            console.log("asd");
        }
        this.bead.draw(this.ctx);
    }
}

window.onload = () => {
    new App();
}