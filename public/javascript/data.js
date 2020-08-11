let data = {
    groupName: "隨便吃團",
    orderArrivedTime: "2020/07/06 16:20",
    orderDeadline: "2020/06/22 12:00",
    selectedStore: "1" - 1,
    selectedGroup: "",
    searchCondition:"",
    scheduledOrder:"",
    voteDeadline:"",
    voteName:"",

    MultipleSelect:false,
    // totalQuality:0,
    // total: 0,
    storeList: [
        { storeID: 1, storeName: "太初麵食", storeScore: 4.3, storePhoto: "/image/store/Taichung/太初麵食/index.jpeg", },
        { storeID: 2, storeName: "隨主飡_法式水煮專賣賣賣賣賣賣賣賣賣賣", storeScore: 3.1, storePhoto: "/image/store/Taichung/隨主飡_法式水煮專賣/index.jpeg", },
        { storeID: 3, storeName: "朴大哥的韓式炸雞_逢甲總店", storeScore: 3.9, storePhoto: "/image/store/Taichung/朴大哥的韓式炸雞_逢甲總店/index.jpeg", }
    ],
    randaomCard: "",
    countCard: "",
    productQuantity: "",
    orderList: [
        { orderID: 1, groupName: "隨便吃團", storeName: "太初麵食", orderArrivedTime: "2020/06/22 12:00", storePhoto: "/image/store/Taichung/太初麵食/index.jpeg" },
        { orderID: 2, groupName: "吃到飽團", storeName: "隨主飡_法式水煮專賣", orderArrivedTime: "2020/07/06 16:20", storePhoto: "/image/store/Taichung/太初麵食/index.jpeg" }
    ],
    voteList: [
        { voteID: 1, voteName:"阿信慶生聚會" ,groupName: "被程式耽誤的通靈王", storeName: "太初麵食", voteDeadLine: "2020/06/22 12:00", storePhoto: "/image/store/Taichung/太初麵食/index.jpeg" },
        { voteID: 2, voteName:"貴婦們的下午茶" ,groupName: "就愛烤肉團", storeName: "隨主飡_法式水煮專賣", voteDeadLine: "2020/07/06 16:20", storePhoto: "/image/store/Taichung/太初麵食/index.jpeg" }
    ],
    productList: [
        { productID: 1, quality:0,productName: "咔啦雞腿堡", productPrice: "65", productPhoto: "/image/store/Taichung/肯德基KFC_台中公益/咔啦雞腿堡.jpeg" },
        { productID: 2, quality:0,productName: "回味麻辣乾麵套餐", productPrice: "95", productPhoto: "/image/store/Taichung/太初麵食/回味麻辣乾麵套餐.jpeg" },
        { productID: 3, quality:0,productName: "老北京御膳里肌麵套餐", productPrice: "145", productPhoto: "/image/store/Taichung/太初麵食/老北京御膳里肌麵套餐.jpeg" }
    ],
    groupList: [
        { groupID: 1, groupName: "隨便吃團" },
        { groupID: 2, groupName: "吃到飽團" }
    ],
}