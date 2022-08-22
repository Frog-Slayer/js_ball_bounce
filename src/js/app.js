import { Bead } from "./bead.js";
import { Point } from "./point.js";

export class App{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        this.isInit = false;

        this.canvas.addEventListener('click', this.init.bind(this), { once: true});
        requestAnimationFrame(this.animate.bind(this));

    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;
        this.ctx.scale(1, 1);
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

    onDeviceMotion(e){
        this.bead.deviceMotion(e);
    }

    animate(){
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        if(!this.isInit) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = "normal normal 40px Bungee";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("Click to Bounce!", this.stageWidth/2, this.stageHeight/2);
        }
        if (this.isInit) this.bead.draw(this.ctx);        
    }

    init(){

        this.makingAim = false; 
        this.mousePos = new Point();
        this.isInit = true;
        this.bead = new Bead(this.stageWidth/2, this.stageHeight/2, 50, this.stageWidth, this.stageHeight, this.makingAim);

        this.canvas.addEventListener('pointerdown', this.onDown.bind(this),false);
        this.canvas.addEventListener('pointermove', this.onMove.bind(this),false);
        this.canvas.addEventListener('pointerup', this.onUp.bind(this),false);

        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this),false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this),false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this),false);
        
        window.addEventListener('devicemotion', this.onDeviceMotion.bind(this), false);
    }
}

window.onload = () => {
    new App();
}