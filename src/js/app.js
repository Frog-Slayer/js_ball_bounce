import { Bead } from "./bead.js";
import { Point } from "./point.js";

export class App{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.makingAim = false; 
        this.mousePos = new Point();

        this.bead = new Bead(100, 300, 50, this.stageWidth, this.stageHeight, this.makingAim);
        
        requestAnimationFrame(this.animate.bind(this));
        

        this.canvas.addEventListener('pointerdown', this.onDown.bind(this),false);
        this.canvas.addEventListener('pointermove', this.onMove.bind(this),false);
        this.canvas.addEventListener('pointerup', this.onUp.bind(this),false);

        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this),false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this),false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this),false);
        
        window.addEventListener('deviceorientation', this.onDeviceOrientaiton.bind(this), false);
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
        
        if (this.bead.collide(this.mousePos)){
            this.makingAim = true;
            this.bead.changeAim(this.mousePos);
        }
        else this.makingAim = false;
    }

    onMove(e){
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
        
        if (this.makingAim) this.bead.changeAim(this.mousePos);
    }

    onUp(e){
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;

        if (this.makingAim) this.bead.shoot(this.mousePos);
        this.makingAim = false;
    }

    onTouchStart(e){
        this.mousePos.x = e.changedTouches[0].clientX;
        this.mousePos.y = e.changedTouches[0].clientY;
        
        if (this.bead.collide(this.mousePos)){
            this.makingAim = true;
            this.bead.changeAim(this.mousePos);
        }
        else this.makingAim = false;
    }

    onTouchMove(e){
        this.mousePos.x = e.changedTouches[0].clientX;
        this.mousePos.y = e.changedTouches[0].clientY;
        
        if (this.makingAim) this.bead.changeAim(this.mousePos);
    }

    onTouchEnd(e){
        this.mousePos.x = e.changedTouches[0].clientX;
        this.mousePos.y = e.changedTouches[0].clientY;
        if (this.makingAim) this.bead.shoot(this.mousePos);
        this.makingAim = false;
    }

    onDeviceOrientaiton(e){
        let alpha = e.alpha || 0;
        let beta = e.beta || 0;
        let gamma = e.gamma || 0;
        this.bead.tilt(alpha, beta, gamma);
    }





    animate(t){
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.bead.draw(this.ctx);
        
    }
}

window.onload = () => {
    new App();
}