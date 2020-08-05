let data = {
    orderList: [
        { groupName: '資策會便當團', src: '/image/store/Taichung/朴大哥的韓式炸雞_逢甲總店/index.jpeg', storeName: '清潭洞', onTime: '2020/08/20 12:00', checkOn: 'true' },
        { groupName: '隨便吃團', src: '/image/store/Taichung/朴大哥的韓式炸雞_逢甲總店/index.jpeg', storeName: '屋馬', onTime: '2020/08/20 18:00', checkOn: '' }
    ],
    voteList: [
        { titleName: '聚餐吃什麼?', groupName: '火鍋團', timeOut: '2020/08/20 12:00', checkOn: 'true' },
        { titleName: '貴婦們的下午茶', groupName: '就愛烤肉團', timeOut: '2020/08/20 16:00', checkOn: '' }
    ]
}

new Vue({
    el: '#app',
    data: data
})