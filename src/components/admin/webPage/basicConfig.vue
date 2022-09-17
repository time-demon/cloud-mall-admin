<!-- 后台  个人设置-->
<template>
    <div>

        <webPageTitle></webPageTitle>

        <div class="webConfigFormBox">
            <el-form :model="webConfigForm" ref="webConfigForm" label-width="100px" class="demo-webConfigForm"
                v-loading="loading">

                <div class="demo-webConfigFormBox">
                    <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <div class="avatarBox">
                            <img v-if="RegExp(/http/).test(webConfigForm.webLogo)" :src="webConfigForm.webLogo"
                                class="avatar">
                            <img v-if="RegExp(/http/).test(webConfigForm.webLogo) == false"
                                :src="'http://localhost:3000/upload/' + webConfigForm.webLogo" class="avatar">
                            <i v-else class="el-icon-upload avatar-uploader-icon"></i>
                        </div>
                        <!-- <img v-if="webConfigForm.webLogo" :src="webConfigForm.webLogo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->

                    </el-upload>
                    <el-form-item label="站点名称" prop="webName">
                        <el-input v-model="webConfigForm.webName" clearable></el-input>
                    </el-form-item>


                    <el-form-item label="副标题" prop="sub_webName">
                        <el-input v-model="webConfigForm.sub_webName" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="客服QQ" prop="webQq">
                        <el-input v-model="webConfigForm.webQq" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="备案信息" prop="filingInformation">
                        <el-input v-model="webConfigForm.filingInformation" clearable></el-input>
                    </el-form-item>

                </div>


                <el-form-item>
                    <el-button type="primary" @click="submitForm('webConfigForm')">立即修改</el-button>
                </el-form-item>

            </el-form>
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
            webConfigForm: {
                webName: '',
                sub_webName: '',
                webLogo: '',
                webQq: '',
                filingInformation: '',
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
                url: '/webConfig/getData',
            }).then(res => {
                if (res.code == 200) {
                    this.webConfigForm = res.data[0];
                }
            })
        },

        submitForm(formName) {
            this.loading = true;
            network({
                method: 'put',
                url: '/webConfig/update',
                params: this.webConfigForm
            }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                        this.$notify({
                            title: '成功',
                            message: '修改成功！',
                            type: 'success'
                        });
                        localStorage.adminName = this.webConfigForm.name;
                        localStorage.adminLogo = this.webConfigForm.webLogo;
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
            this.webConfigForm.webLogo = res.url;
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
.webConfigFormBox {

    >.demo-webConfigForm {
        >.demo-webConfigFormBox {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
        }

    }
}

@media screen and (max-width:768px) {
    .demo-webConfigFormBox {
        display: block !important;
    }

    .el-form-item__content {
        background: orange !important;
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