'use strict';

const syuyochiList =["東京/羽田","大阪/伊丹","福岡/博多","仙台","札幌/新千歳","名古屋","那覇"];
const airportList = ["利尻", "稚内", "紋別", "女満別", "旭川", "中標津", "釧路", "帯広", "函館", "奥尻", "青森", "大館能代", "三沢", "秋田", "花巻", "仙台", "山形", "庄内", "福島", "成田", "八丈島", "新潟", "松本", "小松", "静岡", "南紀白浜", "但馬", "隠岐", "岡山", "出雲", "広島", "山口宇部", "徳島", "高松", "高知", "松山", "北九州", "大分", "長崎", "熊本", "天草", "宮崎", "鹿児島", "種子島", "屋久島", "喜界島", "奄美大島", "徳之島", "沖永良部", "与論", "那覇", "北大東", "南大東", "久米島", "宮古", "多良間", "石垣", "与那国"];
const shinkansenStationList = ["新函館北斗","八戸","新青森","盛岡","大宮","岡山","広島","小倉","秋田","新庄","宇都宮","高崎","軽井沢","長野","富山","金沢","新潟","越後湯沢"];
const destinationList = syuyochiList.concat(airportList.concat(shinkansenStationList));
function changetxt(id, val) {
    document.getElementById(val).innerHTML = id.value;
    makeTweetText();
}

function detectKouho() {
    //現在地及び目的地の取得し、候補リストを作成
    const here = document.getElementById("here");
    const hereValue = here.options[here.selectedIndex].value;
    const destination = document.getElementById("destination");
    const destinationValue = destination.options[destination.selectedIndex].value;
    const chance = document.getElementById("chance");
    const chanceValue = chance.options[chance.selectedIndex].value;
    console.log('現在地 = ' + hereValue + ', ' + '目的地 = ' + destinationValue);
    //目的地の候補リスト作成
    let checkeddestinationList = [];
    let isChecked = false;
    if(document.getElementById("isShuyouchi").checked){
        isChecked = true;
        checkeddestinationList = checkeddestinationList.concat(syuyochiList);
    }if (document.getElementById("isAirport").checked){
        isChecked = true;
        checkeddestinationList = checkeddestinationList.concat(airportList);
    }if (document.getElementById("isShinkansen").checked){
        isChecked = true;
        checkeddestinationList = checkeddestinationList.concat(airportList);
    }if (isChecked === false){
        checkeddestinationList = checkeddestinationList.concat(destinationList);
    }
    console.log(checkeddestinationList);
    const hereindex = destinationList.indexOf(hereValue);
    const kouhochi = checkeddestinationList.filter(n => n !== destinationList[hereindex]);
    //const destinationValue = kouhochi.indexOf(destinationValue);
    console.log(kouhochi,isChecked);
    makeRandomList(6, kouhochi, destinationValue, chanceValue);
}

function makepulldownList(name) {
    const destination = document.getElementById(name);
    document.createElement('option');
    for (var i = 0; i < destinationList.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', destinationList[i]);
        option.innerHTML = destinationList[i];
        destination.appendChild(option);
    }

}

function makeRandomList(number, array, destination, chanceNumber) {
    var randomArray = array.slice();
    for (var i = randomArray.length - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = randomArray[i];
        randomArray[i] = randomArray[r];
        randomArray[r] = tmp;
    }
    for (var i = 0; i < number; i++) {
        document.getElementById('deme' + (i + 1)).innerHTML = randomArray[i];
        document.getElementById('deme' + (i + 1)+'sub').innerHTML =  i + 1 +'の目が出たら？';
    }
    //チャンスタイム処理
    if (destination != "None") {
        for (var i = 0; i < chanceNumber; i++) {
            const detecedNumber = Math.floor(Math.random() * number + 1);
            document.getElementById('deme' + (detecedNumber)).innerHTML = destination;
        }
    }
}

function makeImage() {
    //html2canvas実行
    html2canvas(document.getElementById("capture"), {scrollY: -window.scrollY}).then(function (canvas) {
        downloadImage(canvas.toDataURL("image/png"));
    });
}

function downloadImage(data) {
    const fname = document.getElementById("saikoro-title").innerText+".png";
    document.getElementById("getImage").href = data;
    document.getElementById("getImage").download = fname;
    console.log(data);
    document.getElementById("getImage").click(); //自動クリック

}
function tweet() {
    const tweetURL = "https://twitter.com/share\?";
    const url = "url=https://pyu666.github.io/saikoro/&text=";
    const text = document.getElementById("makedtextarea").value.replace(/\r?\n/g, '%0D%0A');
    console.log(text);
    document.getElementById("tweet").href = tweetURL +  url + text + "サイコロの旅ジェネレータで作成:";
    // document.getElementById("tweet").text = text;
    document.getElementById("tweet").click(); //自動クリック

}

function makeTweetText(){
    document.getElementById("makedtextarea").innerText="";
    let texts = document.getElementById("saikoro-title").innerText;
    texts+='\n';
    for (var i = 1;i <= 6;i++) {
        texts += i.toString() +". ";
        texts += document.getElementById('deme' + i.toString()+'sub').innerText;
        texts += " : "
        texts += document.getElementById('deme' + i).innerText+"\n";
    }
    document.getElementById("makedtextarea").value=texts;
}

makepulldownList("here");
makepulldownList("destination");
makeTweetText();

$(function () {
    $("#ikisakibtn").on('click', function () {
        $.LoadingOverlay("show", {
            progress: true
        });
        var count = 0;
        var interval = setInterval(function () {
            if (count >= 100) {
                clearInterval(interval);
                $.LoadingOverlay("hide");
                detectKouho();
                makeTweetText();
                return;
            }
            count += 10;
            $.LoadingOverlay("progress", count);
        }, 200);
    });
});