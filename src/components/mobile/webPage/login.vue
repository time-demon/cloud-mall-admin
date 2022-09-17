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
                    登录
                </template>
            </van-nav-bar>
        </div>
        <!-- 头部 -->

        <div class="webBox" v-loading="loading">
            <div class="formBox">
                <h1 class="title">欢迎登录</h1>
                <input type="text" placeholder="账号" v-model="account">
                <input type="password" placeholder="密码" v-model="password">
                <button class="submit" @click="submitGo">登录</button>
                <p class="register" @click="$router.push('register')">注册</p>
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
            account: '',
            password: '',
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
                    method: 'get',
                    url: '/admin/getuser',
                    params: {
                        account: this.account,
                        password: this.password,
                    }
                }).then(res => {
                    setTimeout(() => {
                        this.loading = false;
                        if (res.code == 200) {
                            Toast('登录成功！');
                            localStorage.setItem('Authorization', 'Bearer ' + res.data[0].token);// token赋值
                            localStorage.adminName = res.data[0].name;
                            localStorage.adminaccount = res.data[0].account;
                            localStorage.adminLogo = res.data[0].img;
                            this.$router.push('user');
                        } else if (res.code == 150) {
                            Toast('密码错误！');
                        } else if (res.code == -1) {
                            Toast('账号错误！');
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

        >.register {
            font-size: 16px;
            text-align: right;
            padding: 20px 0;
        }

        >.register:hover {
            text-decoration: dotted;
        }
    }
}
</style>