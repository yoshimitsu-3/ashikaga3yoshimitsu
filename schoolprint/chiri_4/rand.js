var elem = document.getElementById("box");
var elem_txt = document.getElementById("text");

elem.innerHTML = '<p class="text1">innerHTMLを使って画面に表示させる</p>';
elem.insertAdjacentHTML('beforeend','<p class="text2">insertAdjacentHTMLを使って表示</p>');
elem_txt.textContent = "textContentを使ってテキストを表示";

document.write("document.writeを使ってテキストを表示させる（位置を指定できない）");
