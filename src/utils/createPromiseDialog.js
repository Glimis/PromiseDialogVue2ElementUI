/**
 * 创建弹出对象
 * 
 * 基础promise，将弹出框逻辑整合在一个函数中
 */
import Vue from 'vue';
import { Dialog } from 'element-ui'

/**
 * 将dialog 转换为函数的格式
 *
 * vue2 + element : 不同的版本或ui库有一定区别
 * 此处根据dialog的api进行实现，不看源码
 * 
 * @example
 * // 1. 创建函数式弹框
 * const xxxDialog = createPromiseDialog(cmp,config)
 * // 2. 业务调用
 * // ....
 * await xxxDialog(params)
 * 
 * @param {*} cmp vueComponent vue组件
 * @param {*} config  dialog 调用参数【组件库】
 */
export function createPromiseDialog(cmp, config = { title: 'xxewxx' }) {
    // 返回执行函数 params:调用参数
    return (params) => {
        // 返回执行后的Promise
        return new Promise((resolve, reject) => {
            // 1. 创建挂载节点
            let el = document.createElement('div')



            // 2. 创建vue实例
            const app = new Vue({
                data: {
                    visible: true,
                },
                methods: {
                    // 摧毁组件实例
                    destory() {
                        this.visible = false;
                        app.$el.parentElement && app.$el.parentElement.removeChild(app.$el)
                    }
                },
                render(h) {

                    return h(Dialog, {
                        props: {
                            visible: this.visible,
                            ...config
                        },
                        on: {
                            // 监听 所有关闭关闭 esc/蒙层
                            close: () => {
                                // 兜底，reject 只会执行一次
                                reject({
                                    type: 'dialogClose'
                                })
                                this.destory()
                            }
                        }
                    }, [h(cmp, {
                        on: {
                            // 取消操作
                            cancel: () => {
                                reject({
                                    type: 'dialogCancel'
                                })
                                this.destory()
                            },
                            // 确定操作
                            ok: (data) => {
                                resolve(data)
                                this.destory()
                            }
                        }
                    })])
                }
            }).$mount(el);

            // 4. 布局挂载
            document.body.appendChild(app.$el)
        })
    }
}