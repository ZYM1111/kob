import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";

export class GameMap extends AcGameObject {
    constructor(ctx, parent, store) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
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

    create_walls() {
        const g = this.store.state.pk.gamemap;
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (g[i][j]) this.walls.push(new Wall(i, j, this));
            }
        }
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
        this.create_walls();
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
