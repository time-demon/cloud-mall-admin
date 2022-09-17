<!-- 移动端 个人中心 -->
<template>
    <div v-loading="loading">
        {{ adminData.name }}
    </div>
</template>

<script>
import network from '@/network';

export default {
    data() {
        return {
            loading: false,
            adminData: [],
        }
    },
    mounted() {
        // localStorage.clear();
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            if (localStorage.getItem('Authorization') == null || localStorage.getItem('Authorization') == undefined) {
                this.$router.push("login");
            } else {
                console.log(localStorage);
                network({
                    method: 'get',
                    url: '/admin/getuser',
                    params: {
                        token: localStorage.getItem('Authorization').replace(/Bearer /ig, ''),
                        account: localStorage.getItem('adminaccount')
                    }
                }).then(res => {
                    if (res.code == 200) {
                        this.adminData = res.data[0];
                    }
                })
            }

        }, 500)
    },
    methods: {

        // 访问个人中心
        user() {
            if (this.$route.path == '/admin') {
                this.$router.push('mobile/user')
            } else {
                this.$router.push('user')
            }
        }
    },
}
</script>

<style lang="scss">
</style>