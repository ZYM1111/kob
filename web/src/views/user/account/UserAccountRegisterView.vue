<template>
    <ContentField>
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <input type="text" class="form-control" id="username" placeholder="请输入用户名" v-model="username">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input type="password" class="form-control" id="password" placeholder="请输入密码"
                            v-model="password">
                    </div>
                    <div class="mb-3">
                        <label for="confirmedPassword" class="form-label">确认密码</label>
                        <input type="password" class="form-control" id="confirmedPassword" placeholder="请再次输入密码"
                            v-model="confirmedPassword">
                    </div>
                    <div class="error-message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">提交</button>
                </form>
            </div>
        </div>
    </ContentField>
</template>

<script>
import ContentField from '../../../components/ContentField.vue';
import { ref } from 'vue';
import router from '@/router/index';
import $ from 'jquery';

export default {
    components: {
        ContentField
    },
    setup() {
        let username = ref('')
        let password = ref('')
        let confirmedPassword = ref('')
        let error_message = ref('')

        const register = () => {
            $.ajax({
              url: "https://app7324.acapp.acwing.com.cn/api/user/account/register/",
                type: "post",
                data: {
                    username: username.value,
                    password: password.value,
                    confirmedPassword: confirmedPassword.value,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        router.push({ name: "user_account_login" });
                    } else {
                        error_message.value = resp.error_message;
                    }
                },
            });
        }

        return {
            username,
            password,
            confirmedPassword,
            error_message,
            register,
        }
    }
}

</script>

<style scoped>
button {
    width: 100%;
}

div.error-message {
    color: red;
}
</style>