import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        super();
        this.gamemap = gamemap;
        this.r = r;
        this.c = c;
        this.color = "#b37226";
    }

    start() {}

    update() {
        this.render();
    }

    render() {
        const ctx = this.gamemap.ctx,
            L = this.gamemap.L;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}
