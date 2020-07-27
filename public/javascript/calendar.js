// 日曆

let today = new Date();
let nowMonth = today.getMonth();
let nowYear = today.getFullYear();

// console.log(today);
// console.log(nowMonth);

// 往上個月

function prevM(){
    let NowYear = (nowMonth === 0) ? nowYear - 1 : nowYear;
    let NowMonth = (nowMonth === 0) ? 11 : nowMonth - 1;
    showCalendar(NowMonth, NowYear);
    return (nowYear = NowYear, nowMonth = NowMonth);
}

// 往下個月

function nextM(){
    let NowYear = (nowMonth === 11) ? nowYear + 1 : nowYear;
    let NowMonth = (nowMonth + 1) % 12;
    showCalendar(NowMonth, NowYear);
    return (nowYear = NowYear, nowMonth = NowMonth);
}

// 生成日曆內容 

showCalendar(nowMonth, nowYear);

function showCalendar(month, year){
    
    // 當月第一天是周幾
    let firstDay = new Date(year, month).getDay();
    // console.log(firstDay); //3
    
    // 如果一個月中有31天，則“第32天”將是下個月的1號。
    // 如果有30，則“第32天”將是下個月的2號。如果有28，則“第32天”將是下個月的4號。
    // 從32中減去任何一個，您就會得到正確的數字。
    let days = 32 - new Date(year, month, 32).getDate();
    // console.log(days); //31
    
    let tbl =document.getElementById("myCalendar");
    let YandM = document.getElementById("YearAndMonth");

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    YandM.insertAdjacentHTML(`beforeend`, `<span id="yaM" class="mr-xs"></span><span id="YAM" class=""></span><span id="Yam" class="ml-xs"></span>`);
    let titleyaM =document.getElementById("yaM");
    let titleYAM =document.getElementById("YAM");
    let titleYam =document.getElementById("Yam");
    
    yaM.innerHTML = [month+1]+ " " + months[month] + "";
    YAM.innerHTML = "|" + "";
    Yam.innerHTML = year;

    tbl.innerHTML = "";

    let date = 1;

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            
            if(i === 0 && j < firstDay ){
                let col =document.createElement("td");
                let cellText = document.createTextNode("");
                col.appendChild(cellText);
                row.appendChild(col);
            }else if( i === 0 && j === firstDay){
                let col =document.createElement("td");
                let cellText = document.createTextNode(date);
                col.appendChild(cellText);
                row.appendChild(col);
                date++;
            }else if(date <= days){
                let col = document.createElement("td");
                let cellText = document.createTextNode(date);
                col.appendChild(cellText);
                row.appendChild(col);
                date++;
            }else if(i === 5 && j === 0){
                break;
            }else{
                let col = document.createElement("td");
                let cellText = document.createTextNode("");
                col.appendChild(cellText);
                row.appendChild(col);
                // break;
            }
        }

        tbl.appendChild(row);
    }

}


// calender.insertAdjacentHTML(`beforeend`, `<div class="day"></div>`);