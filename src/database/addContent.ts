import { createOrupdateContentsInfo } from "./contentsInfo"

// export async function createOrupdateContentsInfo(contentsId: string, data:{
//     dialogue?:{
//         speaker: string;
//         line: string;
//     }[]
//     title?:string
//     type?: string
//     field?:number[]
//     text?:string
//     source?:string
// }) {
//     // コンテンツIDを指定すると、そのコンテンツIDに紐づいたコンテンツ情報を更新、作成する関数
//     // ex)    const data = { title: "フランス革命" };
//     // createOrupdateContentsInfo("LBjWSgWKKmyAc5gckvGf", data)
    
//     if (!contentsId) {
//         return {}
//     }
//     const contentsRef = doc(db, "contents", contentsId)
//     await setDoc(contentsRef, {
//         ...data,
//         createdAt: serverTimestamp(),
//     }, { merge: true });
// }

export const addcontents = () => {
    const text = "フランス革命に関する本文"

    const dialogue = [
        {
            "speaker": "student",
            "line": "先生、今日は革命って聞いたけど、まさかバスティーユ牢獄に突撃とかはしませんよね！？怖いんですけど！"
        },
        {
            "speaker": "teacher",
            "line": "ああ、それこそが1789年7月14日に起こった「バスティーユ襲撃」さ！フランス革命の始まりだよ。"
        },
        {
            "speaker": "student",
            "line": "へぇ〜！怒り爆発！でも何にそんな怒ってたの？パンが高かったとか？"
        },
        {
            "speaker": "teacher",
            "line": "その通り！国の財政はボロボロ。貴族と聖職者は税金を免除されて、庶民だけが苦しんでたんだ。"
        },
        {
            "speaker": "student",
            "line": "うわー、まるで税金VIPパスね…。それで庶民が「もう限界！」って？"
        },
        {
            "speaker": "teacher",
            "line": "そうそう。第三身分が怒って全国三部会で立ち上がり、「国民こそ国家だ！」とテニスコートの誓いをしたのさ。"
        },
        {
            "speaker": "student",
            "line": "でもうまくいったんですか？王様ルイ16世が「やれやれ…」って許してくれたの？"
        },
        {
            "speaker": "teacher",
            "line": "うーん、それがね、対応が遅れて民衆は暴走。革命はどんどんヒートアップしちゃったんだ。"
        },
        {
            "speaker": "student",
            "line": "そのうち「貴族ざまぁ！」って感じに？"
        },
        {
            "speaker": "teacher",
            "line": "封建制も特権もなくして、自由・平等・博愛！憲法もできて近代国家の基礎ができたんだ。"
        },
        {
            "speaker": "student",
            "line": "でもロベスピエールの恐怖政治とか、ギロチンとか怖い話もありますよね！"
        },
        {
            "speaker": "teacher",
            "line": "そう、“ギロチン社会”の到来さ。敵を粛清し過ぎて、彼自身もギロチンに…。革命が自分を食べちゃったわけだ。"
        },
        {
            "speaker": "student",
            "line": "うわぁ…。革命ってスリル満点。でもそれがフランスの近代化につながったんですね！"
        },
        {
            "speaker": "teacher",
            "line": "その通り！貴族の特権は消えて能力主義の時代へ。最終的にはナポレオンが登場して新体制を樹立するんだ。"
        },
        {
            "speaker": "student",
            "line": "おお〜、映画みたい！じゃあ結論、フランス革命って？"
        },
        {
            "speaker": "teacher",
            "line": "貴族の革命であり、ブルジョワの革命であり、民衆と農民の革命でもあった――つまり『みんなで起こした超コラボ革命』だね！"
        },
        {
            "speaker": "student",
            "line": "なるほど！革命って、怒りと理想のミックスジュースだったんですね！"
        },
        {
            "speaker": "teacher",
            "line": "ふふ、いいまとめだ。次回はナポレオン編！帽子の角度について熱く語ろう！"
        }
    ]

    const field = [0.55, 0.0, 0.02, 0.15, 0.0, 0.03, 0.05, 0.10, 0.05, 0.05]

    const title = "フランス革命"

    const contentsId = "francekakumei"

    const source = "「フランス革命」『ウィキペディア日本語版』(最終更新 2025年10月18日, https://ja.wikipedia.org/wiki/フランス革命"


    const data = { title: title, type: "knowledge", dialogue: dialogue, field: field, text: text, source: source }

    createOrupdateContentsInfo(contentsId, data)
}

