module.exports = {   // 追加webpack loader配置   
    configureWebpack: config => {

        config.module.rules.push({
            // 约定，只解析 dialog 组件
            test: /\.dialog\.vue$/,
            // 此处需要放到最前
            enforce: 'pre',
            // loader 源码
            loader: './loader/promiseDialogCommentLoader.js'
        })


        config.module.rules.push({
            // 约定，只解析 dialog 组件      
            test: /\.dialog\.vue$/,
            // .vue 规则有很多，此处放在最后解析      
            enforce: 'post',
            // loader 源码       
            loader: './loader/promiseDialogLoader.js'
        })
    }
}