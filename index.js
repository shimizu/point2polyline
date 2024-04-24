const fs = require("fs");
const turf = require("@turf/turf") 


// コマンドライン引数からファイルのパスを取得します。
const filePath = process.argv[2];

// ファイルパスが指定されていない場合、エラーメッセージを表示して処理を終了します。
if (!filePath) {
    console.log("読み込みファイルを指定してください");
    process.exit();
}

const data = JSON.parse(fs.readFileSync(filePath));


const p = data.features.map((d,i) => {
    d.sequence = i;
    d.properties.lng = d.geometry.coordinates[0];
    d.properties.lat = d.geometry.coordinates[1];

    return d.properties
})

let polylines = []
for (let i = 0; i < p.length - 1; i++) {
    if (i == 0) continue;


    const line = turf.lineString(
        [
            [p[i].lng, p[i].lat, p[i].ele || 0],
            [p[i + 1].lng, p[i + 1].lat, p[i + 1].ele || 0],
        ],
        p[i]
    )

    polylines.push(line)
}

const fc_polyline = turf.featureCollection(polylines);
console.log(JSON.stringify(fc_polyline))