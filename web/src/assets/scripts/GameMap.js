import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0; // 一个小方格的边长
        this.rows = 13;
        this.cols = 14;
        this.inner_walls_cnt = 20;
        this.walls = [];
        this.rand_cnt = 1000;

        this.snakes = [
            new Snake({ id: 0, r: this.rows - 2, c: 1, color: "red" }, this),
            new Snake({ id: 1, r: 1, c: this.cols - 2, color: "blue" }, this),
        ];
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
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c])
                    continue;
                if (
                    (r === this.rows - 2 && c === 1) ||
                    (r === 1 && c === this.cols - 2)
                )
                    continue;
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
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
        if (this.check_ready()) this.next_step();
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
        for (let i = 0; i < this.rand_cnt; i++) {
            if (this.create_walls()) break;
        }
        this.add_listening_events();
    }

    check_valid(cell) {
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) {
                return false;
            }
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (
                    snake.cells[i].r === cell.r &&
                    snake.cells[i].c === cell.c
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    add_listening_events() {
        this.ctx.canvas.focus();
        console.log("hello");
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", (e) => {
            if (e.key === "w") snake0.set_direction(0);
            else if (e.key === "d") snake0.set_direction(1);
            else if (e.key === "s") snake0.set_direction(2);
            else if (e.key === "a") snake0.set_direction(3);
            else if (e.key === "ArrowUp") snake1.set_direction(0);
            else if (e.key === "ArrowRight") snake1.set_direction(1);
            else if (e.key === "ArrowDown") snake1.set_direction(2);
            else if (e.key === "ArrowLeft") snake1.set_direction(3);
            else console.log("other");
        });
    }

    check_ready() {
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {
        for (const sanke of this.snakes) {
            sanke.next_step();
        }
    }
}
