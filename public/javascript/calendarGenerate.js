// 日曆

// const { json } = require("express");

let today = new Date();
let nowMonth = today.getMonth();
let nowYear = today.getFullYear();

// console.log(today);
// console.log(nowMonth);

// 往上個月

function prevM() {
    let NowYear = (nowMonth === 0) ? nowYear - 1 : nowYear;
    let NowMonth = (nowMonth === 0) ? 11 : nowMonth - 1;
    showCalendar(NowMonth, NowYear);
    clickTd();
    clickId();
    addfake()

    return (nowYear = NowYear, nowMonth = NowMonth);
}

// 往下個月

function nextM() {
    let NowYear = (nowMonth === 11) ? nowYear + 1 : nowYear;
    let NowMonth = (nowMonth + 1) % 12;
    showCalendar(NowMonth, NowYear);
    clickTd();
    clickId();
    addfake()

    return (nowYear = NowYear, nowMonth = NowMonth);
}

// 生成日曆內容 

showCalendar(nowMonth, nowYear);

function showCalendar(month, year) {

    // 當月第一天是周幾
    let firstDay = new Date(year, month).getDay();
    // console.log(firstDay); //3

    // 今天的日期
    let todayDate = today.getDate();

    // 如果一個月中有31天，則“第32天”將是下個月的1號。
    // 如果有30，則“第32天”將是下個月的2號。如果有28，則“第32天”將是下個月的4號。
    // 從32中減去任何一個，您就會得到正確的數字。
    let days = 32 - new Date(year, month, 32).getDate();
    // console.log(days); //31

    let tbl = document.getElementById("myCalendar");

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let numMonths = document.getElementById("myDates");
    let engMonths = document.getElementById("myMonths");
    let myYears = document.getElementById("myYears");

    numMonths.innerHTML = [month + 1];
    engMonths.innerHTML = months[month];
    myYears.innerHTML = year;

    tbl.innerHTML = "";

    let date = 1;

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {

            if (i === 0 && j < firstDay) {
                let col = document.createElement("td");
                let cellText = document.createTextNode("");
                col.appendChild(cellText);
                row.appendChild(col);

                col.className = "tdPass";

            } else if (i === 0 && j === firstDay) {
                let col = document.createElement("td");
                let cellText = document.createTextNode(date);
                col.appendChild(cellText);
                row.appendChild(col);

                col.id = date;

                if ((date < todayDate && year == today.getFullYear() && month == today.getMonth()) || year < today.getFullYear() || (year == today.getFullYear() && month < today.getMonth())) {

                    col.className = "tdPass";

                } else {
                    col.className = "tdFutrue";
                }

                date++;

            } else if (date <= days) {
                let col = document.createElement("td");
                let cellText = document.createTextNode(date);
                col.appendChild(cellText);
                row.appendChild(col);

                col.id = date;

                if ((date < todayDate && year == today.getFullYear() && month == today.getMonth()) || year < today.getFullYear() || (year == today.getFullYear() && month < today.getMonth())) {

                    col.className = "tdPass";

                } else {
                    col.className = "tdFutrue";
                }

                date++;

            } else if (i === 5 && j === 0) {
                break;
            } else {
                let col = document.createElement('td');
                let cellText = document.createTextNode("");
                col.appendChild(cellText);
                row.appendChild(col);
            }

        }

        tbl.appendChild(row);

    }

}

// 呼叫當日彈框

function clickTd() {
    $("td").click(function() {
        $("td[id]").attr("data-toggle", "modal");
        $("td[id]").attr("data-target", "#comfirm2BtnW1340");
    })
}

clickTd();

// 列印當天資料

function clickId() {

    let tdDate = {
        clickDate: "",
        sqlDate: "",
        furDate: ""
    };

    $("td").click(function() {

        // console.log($(this).attr("id"));
        var date = $(this).attr("id");
        var nowDay = parseInt(date)

        // console.log(nowYear + "-" + (nowMonth + 1) + "-" + date);
        tdDate.sqlDate = nowYear + "-" + (nowMonth + 1) + "-" + nowDay;
        tdDate.clickDate = nowYear + "/" + (nowMonth + 1) + "/" + nowDay;
        tdDate.furDate = nowYear + "-" + (nowMonth + 1) + "-" + (nowDay + 1);
        // console.log(tdDate);

        fetch('http://localhost:3200/mCalendar/matterList', {
                method: "post",
                body: JSON.stringify(tdDate),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(function(res) {
                app.clickDate = tdDate.clickDate;
                // console.log(app.clickDate);
                return res.json();
            })
            .then(function({ OrderList, RealOrder, VoteList, RealVote }) {
                this.orderList = JSON.parse(OrderList);
                // console.log(this.orderList);
                // console.log(typeof(this.orderList));
                app.orderList = this.orderList;

                this.realOrder = JSON.parse(RealOrder);
                // console.log(this.realOrder);
                app.realOrder = this.realOrder;

                this.voteList = JSON.parse(VoteList);
                // console.log(this.VoteList);
                // console.log(typeof(this.VoteList));
                app.voteList = this.voteList;

                this.realVote = JSON.parse(RealVote);
                app.realVote = this.realVote;
            })
            .catch((err) => {
                console.log('load data err!!');
            })
            // console.log(app.orderList);
            // console.log(app.realOrder);
            // console.log(app.realVote);
    })
}

clickId();

// 放置假圖標

function addfake(){
    var testa = document.getElementById("myDates").innerHTML;
    console.log(testa);
    if(testa==='8'){
        var tempfake = document.getElementById('21');
        var para = document.createElement("div");
        
        tempfake.appendChild(para);
        para.innerHTML = '<i class="icon-vote textG" style="font-size:36px"></i><i class="icon-vote textY" style="font-size:36px"></i><i class=" icon-claenderstatus textG" style="font-size:36px"></i><i class=" icon-claenderstatus textB" style="font-size:36px"></i>';
    }
}

addfake();