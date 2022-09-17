<!-- 后台  个人设置-->
<template>
    <div>

        <webPageTitle></webPageTitle>

        <div class="adminFormBox">
            <div class="leftBox">
                <el-form :model="adminForm" ref="adminForm" label-width="100px" class="demo-adminForm"
                    v-loading="loading">

                    <div style="display: grid;grid-template-columns: repeat(2, 1fr);">
                        <div>
                            <el-form-item label="用户名" prop="name">
                                <el-input v-model="adminForm.name" clearable></el-input>
                            </el-form-item>

                            <el-form-item label="账号" prop="account">
                                <el-input v-model="adminForm.account" disabled></el-input>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label="" prop="name">
                                <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                    <div class="avatarBox">
                                        <img v-if="RegExp(/http/).test(adminForm.img)" :src="adminForm.img"
                                            class="avatar">
                                        <img v-if="RegExp(/http/).test(adminForm.img) == false"
                                            :src="'http://localhost:3000/upload/' + adminForm.img" class="avatar">
                                        <i v-else class="el-icon-upload avatar-uploader-icon"></i>
                                    </div>
                                </el-upload>
                            </el-form-item>
                        </div>
                    </div>


                    <el-form-item label="密码" prop="password">
                        <el-input v-model="adminForm.password" clearable></el-input>
                    </el-form-item>


                    <el-form-item label="QQ" prop="qq">
                        <el-input v-model="adminForm.qq" clearable></el-input>
                    </el-form-item>


                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="adminForm.phone" clearable></el-input>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="submitForm('adminForm')">立即修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="rightBox">
            </div>
        </div>
    </div>
</template>
<script>
import webPageTitle from '@/components/admin/webPageTitle.vue';
import network from "@/network";// 引入axios网络模块
export default {
    components: {
        webPageTitle
    },
    data() {
        return {
            loading: false,
            adminForm: {
                img: '',
                name: '',
                account: '',
                passsword: '',
                qq: '',
                phone: '',
                _id: '',
            },
        };
    },
    mounted() {
        this.dataRender();
        console.log(localStorage);
    },
    methods: {

        // 渲染用户信息
        dataRender() {
            network({
                method: 'get',
                url: '/admin/getuser',
                params: {
                    account: localStorage.getItem('adminaccount'),
                    token: localStorage.getItem('Authorization').replace(/Bearer /ig, ''),
                }
            }).then(res => {
                if (res.code == 200) {
                    this.adminForm.img = res.data[0].img;
                    this.adminForm.name = res.data[0].name;
                    this.adminForm.account = res.data[0].account;
                    this.adminForm.password = res.data[0].password;
                    this.adminForm.qq = res.data[0].qq;
                    this.adminForm.phone = res.data[0].phone;
                    this.adminForm._id = res.data[0]._id;
                }
            })
        },

        submitForm(formName) {
            this.loading = true;
            network({
                method: 'put',
                url: '/admin/update',
                params: this.adminForm
            }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                        this.$notify({
                            title: '成功',
                            message: '修改成功！',
                            type: 'success'
                        });
                        localStorage.adminName = this.adminForm.name;
                        localStorage.adminLogo = this.adminForm.img;
                        window.location.href = "";
                        this.loading = false;
                    }, 500)
                } else {
                    setTimeout(() => {
                        this.$notify({
                            title: '失败',
                            message: '修改失败！',
                            type: 'error'
                        });
                        this.dataRender();
                        this.loading = false;
                    }, 500)
                }
            })
        },

        // 图片上传 上传成功后
        handleAvatarSuccess(res, file) {
            this.adminForm.img = res.url;
        },
        // 图片上传 上传前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG或Png 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

    },
}
</script>

<style lang="scss" scoped>
.adminFormBox {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    >div {
        width: 90%;
    }
}

.avatar-uploader img {
    border-radius: 50%;
    width: auto;
    max-height: 100px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: var(--themeBackColor);
}


.avatar-uploader-icon {
    background: #fff;
    opacity: .5;
    border-radius: 4px;
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.avatarBox {
    position: relative;
}

.avatar {
    width: 150px;
    height: 150px;
    display: block;
    box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
}
</style>