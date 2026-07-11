// ページの読み込み完了時に要素を自動生成して実行
window.addEventListener('DOMContentLoaded', () => {
    // 1. 復習用ボタンとカードのHTMLを自動作成
    const container = document.createElement('div');
    container.innerHTML = `
        <!-- 💡 position: sticky を削除し、通常のボタンとして配置 -->
        <div style="text-align: center; margin: 30px 0;">
            <button id="review-start-btn" style="padding: 12px 24px; font-size: 1.1rem; cursor: pointer; background-color: #e67e22; color: white; border: none; border-radius: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); font-weight: bold; display: none;">
                ❌ 不正解の問題（<span id="wrong-count-display">0</span>問）を復習する
            </button>
        </div>
        <!-- 復習画面（デザインはそのまま） -->
        <div id="review-screen" style="display: none; max-width: 500px; margin: 20px auto; padding: 20px; border: 2px solid #e67e22; border-radius: 10px; background-color: #fff9f4; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: bold; border-bottom: 1px solid #ffebdc; padding-bottom: 5px; color: #e67e22;">
                <span>🔥 弱点復習モード</span>
                <div>残り <span id="review-index">1</span> / <span id="review-total">0</span> 問</div>
            </div>
            <div id="review-question" style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 25px; min-height: 80px; color: #333;"></div>
            <div id="review-answer" style="display: none; font-size: 1.2rem; font-weight: bold; color: #d9534f; margin-bottom: 25px; min-height: 30px; padding: 10px; background-color: #fdf7f7; border-left: 5px solid #d9534f;"></div>
            <div style="text-align: center;">
                <button id="review-show-btn" style="padding: 10px 20px; font-size: 1rem; cursor: pointer; background-color: #0275d8; color: white; border: none; border-radius: 4px;">👁️ 答えを見る</button>
                <button id="review-next-btn" style="display: none; padding: 10px 20px; font-size: 1rem; cursor: pointer; background-color: #5cb85c; color: white; border: none; border-radius: 4px;">➡️ 次の問題へ</button>
            </div>
        </div>
    `;
    // 💡 insertBefore ではなく appendChild に変更することで、ページの一番下（表の後ろ）に追加します
    document.body.appendChild(container);

    setupEventListeners();
    setupTableButtons();
});


let wrongList = [];
let currentReviewIndex = 0;

function setupTableButtons() {
    const rows = document.querySelectorAll('table tr');
    let isHeaderProcessed = false;

    rows.forEach((row) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length >= 3) {
            const isHeaderRow = Array.from(cells).slice(0, 3).some(cell => {
                const text = cell.textContent.trim();
                return text === "番号" || text === "問題" || text === "解答";
            });

            if (isHeaderRow && !isHeaderProcessed) {
                const td = document.createElement('td');
                td.textContent = "チェック";
                td.style.padding = "8px";
                td.style.backgroundColor = "#eee";
                td.style.whiteSpace = "nowrap";
                td.style.verticalAlign = "middle";
                td.style.textAlign = "center";
                td.style.fontWeight = "bold";
                row.appendChild(td);
                isHeaderProcessed = true;
                return;
            }

            const qText = cells[1].textContent.trim();
            const aText = cells[2].textContent.trim();
            if (qText === "" || isHeaderRow) return;

            const actionCell = document.createElement('td');
            actionCell.style.textAlign = "center";
            actionCell.style.padding = "5px";
            actionCell.style.whiteSpace = "nowrap";
            actionCell.style.verticalAlign = "middle";

            const cBtn = document.createElement('button');
            cBtn.textContent = "⭕";
            cBtn.style.cssText = "margin-right:5px; cursor:pointer; padding:4px 8px; background:#fff; border:1px solid #ccc; border-radius:3px;";
            
            const wBtn = document.createElement('button');
            wBtn.textContent = "❌";
            wBtn.style.cssText = "cursor:pointer; padding:4px 8px; background:#fff; border:1px solid #ccc; border-radius:3px;";

            cBtn.addEventListener('click', () => {
                row.style.backgroundColor = "#e8f8f5";
                cBtn.style.background = "#5cb85c";
                cBtn.style.color = "#fff";
                wBtn.style.background = "#fff";
                wBtn.style.color = "#000";
                removeFromWrongList(qText);
            });

            wBtn.addEventListener('click', () => {
                row.style.backgroundColor = "#fdf2f2";
                wBtn.style.background = "#d9534f";
                wBtn.style.color = "#fff";
                cBtn.style.background = "#fff";
                cBtn.style.color = "#000";
                addToWrongList(qText, aText);
            });

            actionCell.appendChild(cBtn);
            actionCell.appendChild(wBtn);
            row.appendChild(actionCell);
        }
    });
}

function addToWrongList(q, a) {
    if (!wrongList.some(item => item.q === q)) { wrongList.push({ q, a }); }
    updateReviewButton();
}

function removeFromWrongList(q) {
    wrongList = wrongList.filter(item => item.q !== q);
    updateReviewButton();
}

function updateReviewButton() {
    document.getElementById('wrong-count-display').textContent = wrongList.length;
    document.getElementById('review-start-btn').style.display = wrongList.length > 0 ? 'inline-block' : 'none';
}

function setupEventListeners() {
    document.getElementById('review-start-btn').addEventListener('click', () => {
        currentReviewIndex = 0;
        wrongList.sort(() => Math.random() - 0.5);
        document.getElementById('review-total').textContent = wrongList.length;
        document.querySelector('table').style.display = 'none';
        document.getElementById('review-start-btn').style.display = 'none';
        document.getElementById('review-screen').style.display = 'block';
        showReviewQuestion();
    });

    document.getElementById('review-show-btn').addEventListener('click', () => {
        document.getElementById('review-answer').style.display = 'block';
        document.getElementById('review-show-btn').style.display = 'none';
        document.getElementById('review-next-btn').style.display = 'inline-block';
    });

    document.getElementById('review-next-btn').addEventListener('click', () => {
        currentReviewIndex++;
        if (currentReviewIndex < wrongList.length) {
            showReviewQuestion();
        } else {
            alert('不正解の復習がすべて完了しました！元の表に戻ります。');
            location.reload();
        }
    });
}

function showReviewQuestion() {
    const current = wrongList[currentReviewIndex];
    document.getElementById('review-index').textContent = currentReviewIndex + 1;
    document.getElementById('review-question').textContent = current.q;
    document.getElementById('review-answer').textContent = current.a;
    document.getElementById('review-answer').style.display = 'none';
    document.getElementById('review-show-btn').style.display = 'inline-block';
    document.getElementById('review-next-btn').style.display = 'none';
}
