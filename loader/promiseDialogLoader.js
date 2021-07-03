const {shareData} = require('./promiseDialogCommentLoader')
// 默认参数，ui库的 通用配置
// 注：包含多个默认设置点 【createDialog 中也有】
const df = {
    title: 'name',
    width: 400
}

/**
 * 解析.dialog 组件
 * 此处与sfc 有关
 * vue 文件会通过query进行拆分
 * 此处只需要没有query 的组合文件
 *
 * @param {string} source  源码
 */
exports.default = function (source) {
    if (this.resourceQuery) {
        this.callback(null, source);
        return;
    }

    // 处理文件
    /**
     * 此处直接删除最后一行
     * 而后组合script 即可
     * 其中有个问题 dialog 的组件参数
     * 组件参数的问题 下次解决
     */
    let arr = source.split('\n')
    const options = shareData[this.resourcePath] || df
    arr[arr.length - 1] =
        `
    import { createPromiseDialog } from "@/utils/createPromiseDialog";
    export default createPromiseDialog(script,${JSON.stringify(options)})
    `
    this.callback(null, arr.join('\n'));
}