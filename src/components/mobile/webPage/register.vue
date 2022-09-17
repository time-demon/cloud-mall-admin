<!-- 移动端 登录 -->
<template>
    <div>
        <!-- 头部 -->
        <div class="header">
            <van-nav-bar class="header" :title="$route.name" left-text="返回" left-arrow>
                <template #left>
                    <van-icon name="arrow-left" @click="$router.go(-1)">返回</van-icon>
                </template>
                <template #title>
                    注册
                </template>
            </van-nav-bar>
        </div>
        <!-- 头部 -->

        <div class="webBox" v-loading="loading">
            <div class="formBox">
                <h1 class="title">欢迎注册</h1>
                <input type="text" placeholder="账号" v-model="userData.account">
                <input type="password" placeholder="密码" v-model="userData.password">
                <input type="text" placeholder="昵称" v-model="userData.name">
                <input type="text" placeholder="QQ" v-model="userData.qq">
                <input type="text" placeholder="手机号" v-model="userData.hone">
                <button class="submit" @click="submitGo">注册</button>
            </div>
        </div>
    </div>
</template>

<script>
import network from '@/network';
import { Toast } from 'vant';//下拉刷新
export default {
    data() {
        return {
            loading: false,
            userData: {
                account: '',
                password: '',
                name: '',
                qq: '',
                phone: '',
            },
        }
    },
    mounted() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            if (localStorage.getItem('Authorization') != null || localStorage.getItem('Authorization') != undefined) {
                this.$router.push("user")
            }
        }, 500)
    },
    methods: {

        // 登录按钮
        submitGo() {
            if (this.account == '' && this.password == '') {
                Toast('输入框不能为空！');
            } else {
                this.loading = true;
                network({
                    method: 'post',
                    url: '/user/adduser',
                    params: this.userData
                }).then(res => {
                    setTimeout(() => {
                        this.loading = false;
                        if (res.code == 200) {
                            Toast('注册成功！正在跳转登录...');
                            this.loading = true;
                            setTimeout(() => {
                                this.loading = false;
                                this.$router.push("login")
                            }, 500)
                        } else if (res.code == -1) {
                            Toast('账号已被注册！');
                        } else {
                            Toast('未知错误！');
                        }
                    }, 500)
                })
            }
        },

    }
}
</script>

<style lang="scss">
.webBox {
    height: 100%;
    min-height: calc(100vh - 190px);
    display: flex;
    justify-content: center;
    align-items: center;

    .formBox {
        // background: #fff;
        // border: 1px solid #ddd;
        width: 95%;
        border-radius: 4px;
        height: auto;
        padding: 0 100px;

        >.title {
            font-size: 36px;
            text-align: center;
            font-weight: 400;
            margin-bottom: 50px;
        }

        >input {
            border: 1px solid #ddd;
            background: transparent;
            padding: 25px 35px;
            font-size: 25px;
            border-radius: 4px;
            width: 100%;
            margin: 20px 0;
        }

        >input:focus {
            border: 1px solid #8080ff;
        }

        >.submit {
            border-radius: 4px;
            width: 100%;
            border: 0;
            background: #19be6b;
            color: #fff;
            padding: 15px;
            font-size: 40px;
            margin-top: 30px;
        }
    }
}
</style>