// グローバルスコープで map を一度だけ宣言
let map; 
let markers = []; 

window.initMap = function() {
    const center = { lat: 35.682839, lng: 139.759455 };
    // map = new google.maps.Map(...);  // これを削除
    // map = new google.maps.Map(document.getElementById("map"), {
        map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: center,
    });
    // ローカルストレージから保存されたマーカーを地図上に表示
    displayStoredMarkers(map);

    // 地図上のクリックイベントでマーカーを追加
    map.addListener('click', function(event) {
        console.log("クリックイベント発火");  // デバッグ用
        if (confirm('この地点をお気に入りに登録しますか？')) {
            console.log("マーカー登録の確認ダイアログ表示");  // デバッグ用
            addMarker(event.latLng, map, true);
            populateForm(event.latLng);
        }
    });
};

// マーカーを追加する関数
function addMarker(location, map, isUserMarker = false) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'お気に入り',
        icon: isUserMarker ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' : undefined,
        customInfo: {
            info: `<div><p>ハッシュタグ: ${location.hashtag || '登録なし'}</p></div>`
        }
    });

    // マーカーのクリックイベントリスナーを追加
    marker.addListener('click', function() {
        const infoWindow = new google.maps.InfoWindow({
            content: this.customInfo.info
        });
        infoWindow.open(map, marker);
    });

    return marker; // ここで marker を返す
}

// フォームに緯度と経度を表示する関数
function populateForm(location) {
    const latitude = location.lat();
    const longitude = location.lng();
    // URL パラメータを作成
    const url = `input.html?latitude=${latitude}&longitude=${longitude}`;
    
    // URL をコンソールに出力
    console.log("遷移するURL:", url);

    // URL に遷移
    window.location.href = url;
}


// 登録フォームを表示する関数
function openForm(location) {
    const latitude = location.lat(); // 緯度を取得
    const longitude = location.lng(); // 経度を取得
    // URL パラメータを作成
    const url = `input.html?latitude=${latitude}&longitude=${longitude}`;
    
    // URL をコンソールに出力 (デバッグ用)
    console.log("遷移するURL:", url);

    // input.html へ遷移
    window.location.href = url; 
}




// ローカルストレージから保存されたマーカーを地図上に表示する関数
function displayStoredMarkers(map) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(function(favorite) {
        const marker = new google.maps.Marker({ // marker変数に格納
            position: { lat: parseFloat(favorite.latitude), lng: parseFloat(favorite.longitude) },
            map: map,
            title: 'お気に入り',
            customInfo: {
                info: `<div><p>コメント: ${favorite.comment}</p></div>`
            }
        });
        markers.push(marker); // markers配列に追加
    });
}

// お気に入りリストを表示する関数
function displayFavoriteList() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteList = document.getElementById('favorite-items');
    
    favoriteList.innerHTML = ''; // リストをクリア

    favorites.forEach((favorite, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `#${favorite.hashtag}: ${favorite.comment} <button class="delete-button" data-index="${index}">削除</button>`; // 削除ボタンを追加
        listItem.style.cursor = 'pointer';
        
        listItem.addEventListener('click', function() {
            const position = { lat: parseFloat(favorite.latitude), lng: parseFloat(favorite.longitude) };
            map.panTo(position); // 地図を該当の位置に移動
            new google.maps.InfoWindow({
                content: `<div><h3>${favorite.hashtag}</h3><p>${favorite.comment}</p></div>`
            }).open(map, new google.maps.Marker({
                position: position,
                map: map,
            }));
        });

          // 削除ボタンのクリックイベントリスナーを追加
          const deleteButton = listItem.querySelector('.delete-button');
          deleteButton.addEventListener('click', function() {
              deleteFavorite(index); 
              // マーカーも削除 (詳細は後述)
              removeMarker(index);
          });

        favoriteList.appendChild(listItem);
    });
}

// マーカーを削除する関数 
function removeMarker(index) {
    if (markers[index]) {
        markers[index].setMap(null); // 地図上からマーカーを削除
        markers.splice(index, 1); // markers配列からマーカーを削除

        // ローカルストレージからも削除
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}


// お気に入りを削除する関数
function deleteFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1); // 該当アイテムを削除
    localStorage.setItem('favorites', JSON.stringify(favorites)); // 更新
    displayFavoriteList(); // リストを再表示
    location.reload(); // ページをリロード
}

// ページ読み込み時にお気に入りリストを表示
window.addEventListener('DOMContentLoaded', function() {
    displayFavoriteList();
});


// ハートマーカー
function addMarker(location, map, isUserMarker = false) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'お気に入り',
        icon: { // iconプロパティを設定
          url: 'https://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/pink-dot.png', // ハート型のマーカー画像のURL
          scaledSize: new google.maps.Size(30, 30) // サイズを変更
        },
        customInfo: {
            info: `<div><p>ハッシュタグ: ${location.hashtag || '登録なし'}</p></div>`
        }
    });
}