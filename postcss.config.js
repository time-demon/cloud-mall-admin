module.exports = () => ({
    plugins: [
        // autoprefixer 自动补齐 CSS3 前缀，适配不同浏览器
        require('autoprefixer')({
            overrideBrowserslist: [
                "last 10 versions", // 所有主流浏览器最近10版本用
            ],
        }),
        require('postcss-pxtorem')({
            rootValue({ file }) {
                // 这里需要动态设置rootValue值，以达到同时适配vant-UI和设计稿
                // 适配vant-UI的设计稿尺寸是375 / 10 = 37.5
                // 适配项目设计稿尺寸是750 / 10 = 75
                // 这里是判断要处理的文件是否是vant组件库的文件，是的话就按375设计稿尺寸走，否则按你项目设计稿的尺寸走，你项目是750就写75，是640就写64，如此类推
                return file.includes('vant') ? 37.5 : 75
            },
            propList: ["*"], //是一个存储哪些将被转换的属性列表，这里设置为['*']全部，假设需要仅对边框进行设置，可以写['*', '!border*']
            unitPrecision: 3, //保留rem小数点多少位
            selectorBlackList: ['el-input', 'el-step', 'no-'],//则是一个对css选择器进行过滤的数组，比如你设置为['el-']，那所有el-类名里面有关px的样式将不被转换，这里也支持正则写法。
            replace: true,
            exclude: (file) => {// 配置不进行单位转换的文件夹
                const ignore = ['src\\views\\mobile', 'src\\components\\mobile']
                for (const str in ignore) {
                    if (file.includes('vant') || file.indexOf(ignore[str]) != -1) {// 如果是vant组件或者是手机端文件夹
                        return false // 进行转换
                    }
                }
                return true //不进行转换
            },

            // function(file) { return file.indexOf('exclude') !== -1; }
            mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
            // minPixelValue: 3, //px小于3的不会被转换
        })
    ]
});
