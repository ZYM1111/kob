<template>
  <PlayGround v-if="$store.state.pk.status === 'playing'" />
  <MatchGround v-if="$store.state.pk.status === 'matching'" />
  <ResultBoard v-if="$store.state.pk.loser != 'none'" />
  <div class="user-color"
    v-if="$store.state.pk.status === 'playing' && parseInt($store.state.user.id) === parseInt($store.state.pk.a_id)">左下角
  </div>
  <div class="user-color"
    v-if="$store.state.pk.status === 'playing' && parseInt($store.state.user.id) === parseInt($store.state.pk.b_id)">右上角
  </div>
</template>

<script>
import PlayGround from '../../components/PlayGround.vue';
import MatchGround from '../../components/MatchGround.vue';
import ResultBoard from '../../components/ResultBoard.vue';

import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();
      const socketUrl = `wss://app7324.acapp.acwing.com.cn/websocket/${store.state.user.token}/`;
        let socket = null;
        store.commit("updateLoser", "none");
        store.commit("updateIsRecord", false);
        onMounted(() => {
            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            });
            socket = new WebSocket(socketUrl);
            socket.onopen = () => {
                console.log("web connected!");
                store.commit("updateSocket", socket);
            };
            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                if (data.event === "start-matching") {
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                    }, 1000);
                    store.commit("updateGame", data.game);
                } else if (data.event === "move") {
                    console.log(data);
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                } else if (data.event === "result") {
                    console.log(data);
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    if (data.loser === "A" || data.loser === "all") {
                        snake0.status = "die";
                    }
                    if (data.loser === "B" || data.loser === "all") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
                }

            };
            socket.onclose = () => {
                console.log("web disconnected!");
            };
        });
        onUnmounted(() => {
            socket.close();
            store.commit("updateStatus", "matching");
        });
    }
}
</script>

<style scoped>
div.user-color {
  text-align: center;
  color: white;
  font-size: 30px;
  font-weight: 600;
}
</style>