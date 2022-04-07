// components/container/index.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的初始数据
     */
    data: {
        showContainer: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        show() {
            this.setData({
                showContainer: true
            })
            this.animate('.b', [{
                height: '0'
            }, {
                height: '50vh'
            }], 500)
        },
        hidden() {
            let that = this
            this.animate('.b', [{
                height: '50vh'
            }, {
                height: '0'
            }], 500)
            setTimeout(() => {
                that.setData({
                    showContainer: false
                })
            }, 500);
        },

        none() {
            return
        }
    }
})