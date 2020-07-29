// 日曆

// const e = require("express");

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
    return (nowYear = NowYear, nowMonth = NowMonth);
}

// 往下個月

function nextM() {
    let NowYear = (nowMonth === 11) ? nowYear + 1 : nowYear;
    let NowMonth = (nowMonth + 1) % 12;
    showCalendar(NowMonth, NowYear);
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

                if ((date < todayDate && year == today.getFullYear() && month == today.getMonth()) || year < today.getFullYear() || (year == today.getFullYear() && month < today.getMonth())) {

                    col.className = "tdPass";

                }else{
                    col.className = "tdFutrue";
                }

                date++;

            } else if (date <= days) {
                let col = document.createElement("td");
                let cellText = document.createTextNode(date);
                col.appendChild(cellText);
                row.appendChild(col);

                if ((date < todayDate && year == today.getFullYear() && month == today.getMonth()) || year < today.getFullYear() || (year == today.getFullYear() && month < today.getMonth())) {

                    col.className = "tdPass";

                }else{
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

                // col.className = "tdPass";

            }

        }

        tbl.appendChild(row);

    }

    // if (month <= nowMonth && date < today) {

    //     col.className = "tdPass";

    // } else {
    //     col.className = "tdFutrue";
    // }

}


// calender.insertAdjacentHTML(`beforeend`, `<div class="day"></div>`);