/**
 * 读取vue script 中的信息 有三个问题
 * 1. 解析顺序
 * .vue 形成的文件，在script 解析之前
 * 无法直接使用 只包含script 的loader 的内容
 *
 * 需要使用pre ，获取.vue 的源码
 * 2. 注释解析
 * 此处使用正则 用以快速实现
 *
 * 3. 数据通讯
 * 如何将数据分享给 dialogLoader
 * 此处使用最简单的内存共享的方式
 *
 * @param {string} source
 * @param {string} inMap
 */



const _ = require('lodash')
/**
 * 使用 sfc 模块，获取script
 *
 * 注：script 中 可能包含setup 【通过setup-loader 再次解析】
 * 此处使用babel自行解析，而非sfc提供的script解析功能
 *
 * @param {string} source
 * @returns
 */
const compiler = require("vue-template-compiler");

const parser = require("@babel/parser")

// 读取script
const getScript = source => compiler.parseComponent(source).script.content

// 获取第一个注释，此处指 /** */ 的格式
const getComment = source => {
    let ast = parser.parse(source, {
        // 模块加载方式 【es6】
        sourceType: "module",
    })
    /**
     * 所有的注释均在comments中
     * 此处指针对 CommentBlock /*   *\/ 进行解析
     */
    return ast.comments.filter(comment => comment.type === 'CommentBlock')
}

/**
 * json格式 ： 一行一个 k:v
 *
 * CommentBlock 验证：此处接收第一个可被转换的 CommentBlock
 * 当遇见多个或特殊注释时，使用第一个 或 从新定义规则 【可将英文:，替换为中文：或使用特殊服，绕过json】
 *
 * @param {array} comments  所有 CommentBlock
 * @returns
 */
const comment2Json = comments => {

    let json;
    comments.find(comment => {
        try {
            // 此处comment 指 babel的ast 结构
            let str = comment.value
                // 去除前后 /
                .slice(1, -1)
                // 去除起始行* 需要每一行处理 *
                .replace(/^[\s\*]*/mg, '')
                // 将结尾替换为,使用replace 或 split 一样，但不确定尾函数
                .split('\n')
                .join(',')
                // 去除最后一位
                .slice(0, -1)
            // 转为为 json，注 使用JSON.parse 需要key 加上引号
            return json = eval(`a = {${str}}`)
        } catch (error) {
            return
        }
    })
    return json 
}

const getJSON = _.flow([getScript,getComment, comment2Json]);


//  通讯：共享内存
// const { shareData } = require('./lib/shareData')

const shareData = {}

exports.shareData = shareData
exports.default = function (source, inMap) {
    if (!this.resourceQuery) {
        // 写入内容中，读取到的json
        // 此处需要寻找 filePath 的key 值
        shareData[this.resourcePath] =getJSON(source)
    }
    
    this.callback(null, source, inMap);
}