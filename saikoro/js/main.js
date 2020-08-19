'use strict';

const airportList = ["新千歳", "利尻", "稚内", "紋別", "女満別", "旭川", "中標津", "釧路", "帯広", "函館", "奥尻", "青森", "大館能代", "三沢", "秋田", "花巻", "仙台", "山形", "庄内", "福島", "羽田", "成田", "八丈島", "新潟", "松本", "小松", "静岡", "名古屋", "伊丹", "大阪", "神戸", "南紀白浜", "但馬", "隠岐", "岡山", "出雲", "広島", "山口宇部", "徳島", "高松", "高知", "松山", "福岡", "北九州", "大分", "長崎", "熊本", "天草", "宮崎", "鹿児島", "種子島", "屋久島", "喜界島", "奄美大島", "徳之島", "沖永良部", "与論", "那覇", "北大東", "南大東", "久米島", "宮古", "多良間", "石垣", "与那国"];

function changetxt(id, val) {
    document.getElementById(val).innerHTML = id.value;
    makeTweetText();
}

function detectKouho() {
    //現在地及び目的地の取得し、候補リストを作成
    const here2 = document.getElementById("here");
    const hereValue = here2.options[here2.selectedIndex].value;
    const destination = document.getElementById("destination");
    const destinationValue = destination.options[destination.selectedIndex].value;
    const chance = document.getElementById("chance");
    const chanceValue = chance.options[chance.selectedIndex].value;
    console.log('現在地 = ' + hereValue + ', ' + '目的地 = ' + destinationValue);
    //目的地の候補リスト作成
    const hereindex = airportList.indexOf(hereValue);
    const kouhochi = airportList.filter(n => n !== airportList[hereindex]);
    const destinationindex = kouhochi.indexOf(destinationValue);
    makeLandomList(6, kouhochi, destinationindex, chanceValue);
}

function makepulldownList(name) {
    const airport = document.getElementById(name);
    document.createElement('option');
    for (var i = 0; i < airportList.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', airportList[i]);
        option.innerHTML = airportList[i];
        airport.appendChild(option);
    }
}

function makeLandomList(number, array, destinationIndex, chanceNumber) {
    var randomArray = array.slice();
    for (var i = randomArray.length - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = randomArray[i];
        randomArray[i] = randomArray[r];
        randomArray[r] = tmp;
    }
    for (var i = 0; i < number; i++) {
        document.getElementById('deme' + (i + 1)).innerHTML = randomArray[i];
    }
    //チャンスタイム処理
    if (destinationIndex != -1) {
        for (var i = 0; i < chanceNumber; i++) {
            const detecedNumber = Math.floor(Math.random() * number + 1);
            document.getElementById('deme' + (detecedNumber)).innerHTML = array[destinationIndex];
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
    var fname = "testimage.png";
    //それ以外？
    document.getElementById("getImage").href = data; //base64そのまま設定
    document.getElementById("getImage").download = fname;
    console.log(data);//ダウンロードファイル名設定
    //document.getElementById("getImage").click(); //自動クリック

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