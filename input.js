document.addEventListener('DOMContentLoaded', function() {
    // URL パラメータから緯度と経度を取得
    const urlParams = new URLSearchParams(window.location.search);
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');
  
    if (latitude && longitude) {
        // フォームの緯度と経度フィールドに値を設定
        const latField = document.getElementById('latitude');
        const lonField = document.getElementById('longitude');
        if (latField && lonField) {
            latField.value = latitude;
            lonField.value = longitude;
        }
    }
  
    // フォームの要素を取得
    const form = document.getElementById('favorite-form');
    if (form) {
        // フォームの送信イベントを処理
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // フォームのデフォルト送信を防ぐ
    
            const latitude = document.getElementById('latitude').value;
            const longitude = document.getElementById('longitude').value;
            const hashtag = document.getElementById('hashtag').value;
            const comment = document.getElementById('comment').value;
        
            // データをローカルストレージに保存
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites.push({ latitude, longitude, hashtag, comment });
            localStorage.setItem('favorites', JSON.stringify(favorites));
          
            // データをコンソールに表示
            console.log(`緯度: ${latitude}, 経度: ${longitude}, ハッシュタグ: ${hashtag}, コメント: ${comment}`);
            
            
            // 確認メッセージを表示
            // alert('登録されました');


            // 確認メッセージを表示
            Swal.fire({
                icon: 'success',
                title: '登録されました',
                showConfirmButton: false,
                timer: 1500 // 1.5秒後に自動で閉じる
            });
            

          // 登録完了後に index.html にリダイレクトし、リロードする
             window.location.href = 'index.html';

        });
    } else {
        console.error('フォームが見つかりません');
    }
});
