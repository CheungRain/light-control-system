import {createRouter,createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/main',
        name: 'main',
        component: () => import('../App'),
    },
    {
        path: '/',
        name: 'IndexPage',
        meta:{
            title:"首页"
        },
        component: () => import('../views/IndexPage'),
    },
    {
        path: '/test',
        name: 'testPage',
        meta:{
            title:"首页"
        },
        component: () => import('../views/testPage'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
// 导航守卫
// 参数1 : to 目标路由对象
// 参数2 : from 来源路由对象
// 参数3 : next() 下一步

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
export default router
