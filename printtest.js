let targets = document.getElementsByClassName("hole");
for(let i = 0; i < targets.length; i++){
  targets[i].addEventListener("click",function() {this.classList.toggle("open");}, false);
}


/*
document.getElementById("hole").onclick = function() {
  this.classList.toggle("open");
}
*/
/*
let targets = document.getElementsByClassName("btn02");
for(let i = 0; i < targets.length; i++){
  targets[i].addEventListener("click",() => {
        alert("CLASS: クリックされました。");
  }, false);
}
*/
