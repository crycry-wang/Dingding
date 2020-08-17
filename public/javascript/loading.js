//loading
function onReady(callback) {
    var intervalId = window.setInterval(function () {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 1000);
}
function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
}
onReady(function () {
    setVisible('.load', true);
    setVisible('#loading', false);
});

//進場淡入淡出
// $(document).ready(function () {
//     $('body').css('display', 'none');
//     $('body').fadeIn(2000); //一開始淡入
//     $('a.link').click(function (event) { //點選 class 為 link 的 a 元件時觸發
//         event.preventDefault(); //取消事件預設動作
//         newLocation = this.href;
//         $('body').fadeOut(1000, newpage); //點選後淡出
//     });

//     function newpage() {
//         window.location = newLocation;
//     }
// });