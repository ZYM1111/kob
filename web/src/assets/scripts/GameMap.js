import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {  
        super();
        this.ctx = ctx; 
        this.parent = parent;   
        this.L = 0; // 一个小方格的边长
        this.rows = 13;
        this.cols = 13;
        this.inner_walls_cnt = 20;
        this.walls = [];
        this.rand_cnt = 1000;
    }

    check_connectivity(g, sx, sy, tx, ty) {
        if (sx === tx && sy === ty) {
            return true;
        }
        g[sx][sy] = true;
        let dx = [0, 0, -1, 1],
            dy = [1, -1, 0, 0];
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i],
                y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) {
                return true;
            }
        }
        return false;
    }

    create_walls() {
        const g = [];
        for (let i = 0; i < this.rows; i++) {
            g[i] = [];
            for (let j = 0; j < this.cols; j++) {
                g[i][j] = false;
            }
        }
        for (let i = 0; i < this.rows; i++) {
            g[i][0] = g[i][this.cols - 1] = true;
        }
        for (let i = 0; i < this.cols; i++) {
            g[0][i] = g[this.rows - 1][i] = true;
        }

        for (let i = 0; i < this.inner_walls_cnt / 2; i++) {
            for (let j = 0; j < this.rand_cnt; j++) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[c][r]) continue;
                if (
                    (r === this.rows - 2 && c === 1) ||
                    (r === 1 && c === this.cols - 2)
                )
                    continue;
                g[r][c] = g[c][r] = true;
                break;
            }
        }

        const g_bk = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(g_bk, this.rows - 2, 1, 1, this.cols - 2))
            return false;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (g[i][j]) this.walls.push(new Wall(i, j, this));
            }
        }
        return true;
    }

    update_size() {
        this.L = parseInt(
            Math.min(
                this.parent.clientWidth / this.cols,
                this.parent.clientHeight / this.rows
            )
        );
        this.ctx.canvas.height = this.L * this.rows;
        this.ctx.canvas.width = this.L * this.cols;
    }

    update() {
        this.update_size();
        this.render();
    }

    render() {
        const color_even = "#a2d149",
            color_odd = "#aad751";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(this.L * c, this.L * r, this.L, this.L);
            }
        }
    }

    start() {
        console.log("hello world");
        for (let i = 0; i < this.rand_cnt; i++) {
            if (this.create_walls()) break;
        }
    }
}
