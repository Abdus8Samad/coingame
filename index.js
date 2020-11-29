var coins = [
    [],
    [],
    [],
    []
]

var comp = [0,0];
var p = [0,0];
var coins_count = [];
var from = [];
var to = [];
var button = document.getElementsByTagName("button")[0];
var boxes = [[],[],[],[]];
var prev_l = -1;
var prev_b = -1;
var k = 0;
var comp_from = document.getElementById("computer_from");
var comp_to = document.getElementById("computer_to");
var play_from = document.getElementById("player_from");
var play_to = document.getElementById("player_to");

for(let lev=0; lev<4; lev++) {
    for(let no=0; no<=lev; no++) {
        boxes[lev][no] = document.getElementById(String(lev) + String(no));
    }
}

const update_html = () => {
    for(let i=0;i<coins.length;i++){
        for(let j = 0; j<coins[i].length; j++) {
            boxes[i][j].innerHTML = coins[i][j];
        }
    }
}

const move_coin = async (x, y) => {
    await sleep();
    console.log(x, y)
    for(let i=0; i<=x; i++) {
        if(coins[x][i] > 0) {

            coins[x][i]--;
            coins[y][0]++;

            coins_count[x]--;
            coins_count[y]++;

            comp_from.innerHTML = String(x) + "." + String(i);
            comp_to.innerHTML = String(y) + ".0";
            break;
        }
    }
}

const sleep = () => new Promise((resolve,reject) => setInterval(resolve,1500));

const boxRetain = () => boxes.forEach(levs => levs.forEach(box => {box.style.border = "6px solid black";box.style.background = "white"}));

const computer_move = async () => {
    console.log("computer");
    if(coins_count[k] > 0) move_coin(k, 0);
    else {
        if(k == 1) move_coin(3, 2);
        else if(k == 2) move_coin(3, 1);
        else move_coin(2, 1);
    }
    await sleep();
    update_html();
    boxRetain();
    addEvtListeners();
    if(coins_count[1] + coins_count[2] + coins_count[3] == 0) {
        console.log("Computer Wins");
        alert("Computer Wins");
    }
    k = 0;
}

const mouseEnter = (event,lev,no) =>{
    let box = event.target;
    if((prev_l < 0 && coins[lev][no] > 0 && lev > 0) || prev_l > lev) {
        box.style.border = "5px solid darkslategrey";
        box.style.background = "rgba(0,0,0,0.2)";
    }
}

const mouseLeave = (event,lev,no) =>{
    let box = event.target;
    if(prev_l !== lev && prev_b !== no){
        box.style.border = "6px solid black";
        box.style.background = "white";
    }
}

const click = (event,lev,no) =>{
    let box = event.target;
    if(parseInt(box.innerHTML) === 0) return;
    if(prev_l < 0) {
        // First click
        if(lev > 0 && coins[lev][no] > 0) {
            box.style.border = "5px solid darkslategrey";
            box.style.background = "rgba(0,0,0,0.2)";
            // Make lev and no selected
            prev_l = lev;
            prev_b = no;
        }
    }
    else {
        // second click
        if(lev < prev_l) {
            // Make prev_l and prev_b unselected
            box.style.border = "5px solid darkslategrey";
            box.style.background = "rgba(0,0,0,0.2)";
            removeEvtListeners();

            coins[prev_l][prev_b]--;
            coins[lev][no]++;
            
            coins_count[prev_l]--;
            coins_count[lev]++;
            
            k ^= lev;
            k ^= prev_l;
            
            play_from.innerHTML = String(prev_l) + "." + String(prev_b);
            play_to.innerHTML = String(lev) + "." + String(no);
            
            prev_l = -1;
            prev_b = -1;

            update_html();
            computer_move();
        }
    }
}

const removeEvtListeners = () =>{
    for(let lev=0; lev<4; lev++) {
        for(let no=0; no<=lev; no++) {
            let old_element = boxes[lev][no];
            var new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
            boxes[lev][no] = new_element;
        }
    }
}

const addEvtListeners = () =>{
    for(let lev=0; lev<4; lev++) {
        for(let no=0; no<=lev; no++) {
            let box = boxes[lev][no];
            box.addEventListener("mouseenter",(event) => mouseEnter(event,lev,no));
            box.addEventListener("mouseleave",(event) => mouseLeave(event,lev,no));
            box.addEventListener("click",(event) => click(event,lev,no));
        }
    }    
}

const gameStart = () =>{
    boxRetain();
    addEvtListeners();
    prev_b = -1;
    prev_l = -1;
    let sum = 0;
    for(let i=0;i<4;i++){
        for(let j=0;j<=i;j++){
            let rand = Math.floor(Math.random()*2) + 1;
            sum += rand;
            coins[i][j] = rand;
        }
        coins_count.push(sum);
        sum = 0;
    }
    for(let i=0;i<4;i++){
        if(coins_count[i]%2 !== 0){
            k ^= i;
        }
    }
    console.log(k);
    if(k !== 0){
        coins[k][0] += 1;
        coins_count[k] += 1;
        k = 0;
    }
    update_html();
    console.log(coins)
}

button.addEventListener("click",() =>{
    gameStart();
})

gameStart();