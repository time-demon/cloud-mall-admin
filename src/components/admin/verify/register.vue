<!-- 后台 管理员 注册 模块-->
<template>
    <div>
        <h1 class="rightTitle">
            欢迎注册！
            <el-button type="text" class="login" icon="el-icon-back" @click="login('login')">返回登陆</el-button>
        </h1>
        <div class="inputBigBox">
            <div class="inputBox">
                <el-input v-model="account" prefix-icon="el-icon-user" placeholder="请输入账号" clearable></el-input>
            </div>
            <div class="inputBox">
                <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="password" show-password clearable>
                </el-input>
            </div>
            <div class="inputBox">
                <el-input placeholder="请再次输入密码" prefix-icon="el-icon-lock" v-model="password2" clearable></el-input>
                <p class="inputTips">{{ pwdTip }}</p>
            </div>
            <div class="inputBox">
                <el-input v-model="name" prefix-icon="el-icon-milk-tea" placeholder="起个昵称吧..." clearable></el-input>
            </div>
            <div class="inputBox">
                <el-input v-model="qq" prefix-icon="el-icon-qq" placeholder="QQ" clearable></el-input>
            </div>
            <div class="inputBox">
                <el-input v-model="phone" prefix-icon="el-icon-mobile-phone" placeholder="手机号" clearable></el-input>
            </div>
        </div>
        <!-- <div class="more">
        </div> -->
        <div class="submit">
            <el-button type="primary" @click="register" :loading="loading">{{ loadingText }}</el-button>
        </div>
    </div>
</template>

<script>
import network from '@/network';
export default {
    data() {
        return {
            name: '',
            account: "",
            password: "",
            password2: "",
            pwdTip: "",
            qq: '',
            img: '',
            phone: '',
            loading: false,
            loadingText: "立即注册"
        }
    },

    watch: {
        password(newName, oldName) {
            this.pwdTip = newName != this.password2 ? "两次密码不一样，请重新输入！" : "";
        },
        password2(newName, oldName) {
            this.pwdTip = newName != this.password ? "两次密码不一样，请重新输入！" : "";
        },
    },

    methods: {

        // 访问登录页面
        login(type) {
            this.$router.push(type);
        },

        // 注册按钮
        register() {
            this.loading = true;
            this.loadingText = "验证中...";

            // 整页加载遮罩
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            network({
                method: "post",
                url: "/user/adduser",
                params: {
                    account: this.account,
                    password: this.password,
                    qq: this.qq,
                    name: this.name,
                    phone: this.phone,
                    img: `https://q1.qlogo.cn/headimg_dl?dst_uin=${this.qq}&spec=100`,
                }
            }).then(res => {
                const that = this;
                // 返回参数处理函数
                function registerGo() {
                    if (res.code == 200) {
                        that.$message({
                            message: '注册成功！请登录...',
                            showClose: true,
                            type: 'success',
                            duration: 1000,// 关闭时间
                        });
                        that.login('login');
                    } else if (res.code = -1) {
                        that.$message({
                            message: '账号已被注册，请重新输入账号',
                            showClose: true,
                            type: 'error',
                            duration: 2000,
                        });
                    } else {
                        that.$message({
                            message: '未知错误！',
                            showClose: true,
                            type: 'error',
                            duration: 2000,
                        });
                    }
                };

                // 整页加载遮罩计时关闭
                setTimeout(() => {
                    loading.close();
                    registerGo();// 调用返回参数处理函数
                    this.loading = false;
                    this.loadingText = "注册";
                }, 1000);
            });
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

    >.login {
        font-size: 13px;
    }
}

.inputBigBox {
    margin-bottom: 40px;

    >.inputBox {
        margin: 20px 0;
        position: relative;

        >.inputTips {
            position: absolute;
            font-size: 12px;
            color: red;
        }

    }
}

.more {
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