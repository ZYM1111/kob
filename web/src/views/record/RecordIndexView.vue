<template>
    <ContentField>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>对战结果</th>
                    <th>对战时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record.record.id">
                    <td>
                        <img :src="record.a_photo" alt="" class="record-user-photo">
                        &nbsp;
                        <span class="record-user-username">{{ record.a_username }}</span>
                    </td>
                    <td>
                        <img :src="record.b_photo" alt="" class="record-user-photo">
                        &nbsp;
                        <span class="record-user-username">{{ record.b_username }}</span>
                    </td>
                    <td>
                        {{ record.result }}
                    </td>
                    <td>
                        {{ record.record.createtime }}
                    </td>
                    <td>
                        <button type="button" class="btn btn-secondary">查看录像</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </ContentField>
</template>

<script>
import ContentField from '../../components/ContentField.vue';
import $ from 'jquery';
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        let current_page = 1;
        let records = ref([]);

        const pull_page = page => {
            current_page = page;
            $.ajax({
                url: "http://127.0.0.1:3000/record/getlist/",
                type: "GET",
                data: {
                    page: page,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    console.log(resp);
                    records.value = resp.records;
                },
                error(resp) {
                    console.log(resp);
                }
            });
        }

        pull_page(current_page);
        return {
            records,
        }
    }
}
</script>

<style scoped>
img.record-user-photo {
    width: 4vh;
    border-radius: 50%;
}

</style>