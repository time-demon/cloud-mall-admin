<!-- 后台 管理员 登录 模块-->
<template>
    <div>
        <h1 class="rightTitle">
            管理后台登录
            <el-tooltip class="item tips" effect="dark" content="将会使用token技术进行验证" placement="left">
                <el-button type="text" icon="el-icon-info"></el-button>
            </el-tooltip>
        </h1>
        <div class="inputBigBox">
            <div class="inputBox">
                <el-input v-model="account" prefix-icon="el-icon-user" placeholder="请输入账号" clearable></el-input>
            </div>
            <div class="inputBox">
                <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="password" show-password clearable>
                </el-input>
            </div>
        </div>
        <div class="moreBox">
            <p @click="">
                忘记密码？
            </p>
            <p @click="">
                忘记账号？
            </p>
            <p @click="more('register')">
                新用户注册
            </p>
        </div>
        <div class="submit">
            <el-button type="primary" @click="login" :loading="loading">{{ loadingText }}</el-button>
        </div>
    </div>

</template>

<script>
import network from '@/network';
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            account: "",
            password: "",
            loading: false,
            loadingText: "登录"
        }
    },
    methods: {
        ...mapMutations(['changeLogin']),
        // 登陆按钮
        login() {
            this.loading = true;
            this.loadingText = "验证中...";

            // 整页加载遮罩
            const loading = this.$loading({
                lock: true,
                text: '验证中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            // 登录验证请求
            network({
                method: "get",
                url: "/admin/getuser",
                params: {
                    account: this.account,
                    password: this.password
                }
            }).then(res => {
                const that = this;
                // 返回参数处理函数
                function loginGo() {
                    if (res.code == 200) {
                        const loading2 = that.$loading({
                            lock: true,
                            text: '登录成功',
                            spinner: 'el-icon-check',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        // that.userToken = 'Bearer ' + res.data[0].token;
                        that.changeLogin({ Authorization: 'Bearer ' + res.data[0].token });// token赋值
                        localStorage.adminName = res.data[0].name;
                        localStorage.adminaccount = res.data[0].account;
                        localStorage.adminLogo = res.data[0].img;

                        setTimeout(() => {
                            loading2.close();
                            that.$router.push("/admin");
                        }, 1000);
                    } else if (res.code == 150) {
                        that.$message({
                            message: '密码错误！请重新输入密码',
                            showClose: true,
                            type: 'error',
                            duration: 2000,
                        });
                        that.password = "";
                    } else {
                        that.$message({
                            message: '账号错误！请重新输入账号',
                            showClose: true,
                            type: 'error',
                            duration: 2000,
                        });
                        that.account = "";
                        that.password = "";
                    }
                };

                // 整页加载遮罩计时关闭
                setTimeout(() => {
                    loading.close();
                    loginGo();// 调用返回参数处理函数
                    this.loading = false;
                    this.loadingText = "登录";
                }, 500);
            })
        },

        // 访问注册页面
        more(type) {
            this.$router.push(type);
        },
    }

}
</script>

<style lang="scss" scoped>
.rightTitle {
    font-size: 28px;
    letter-spacing: 1px;
    font-weight: 400;
    margin-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >.tips {
        font-size: 13px;
    }
}

.inputBigBox {
    margin-bottom: 40px;

    >.inputBox {
        margin: 20px 0;
        position: relative;

    }
}

.moreBox {
    color: #409eff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;

    >p {
        cursor: pointer;
    }

}

.submit {
    margin-top: 50px;

    >button {
        font-size: 18px;
        width: 100%;
        letter-spacing: 1px;
        text-align: center;
    }
}
</style>