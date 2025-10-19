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
    console.log("実行")
    const text = "パンを「斤」で数える理由"

    const dialogue = [
        {
            "speaker": "student",
            "line": "先生、パン屋さんでパンを「一斤ください」って言うけど、なんで「斤」なんて単位で数えるんですか？"
        },
        {
            "speaker": "teacher",
            "line": "いい質問だね！それはパンが日本に伝わった明治時代まで遡るんだ。外国の単位が関係しているんだよ。"
        },
        {
            "speaker": "student",
            "line": "へぇ、外国の単位ですか？"
        },
        {
            "speaker": "teacher",
            "line": "そう。当時、イギリス人が売っていたパンの基本サイズは「1ポンド」だったんだ。でも、当時の日本人には『ポンド』って言われてもピンとこないよね。"
        },
        {
            "speaker": "student",
            "line": "確かに！今でもポンドってあまり使わないですもんね。"
        },
        {
            "speaker": "teacher",
            "line": "そこで、日本に昔からあった重さの単位「斤（きん）」を代わりに使ったんだ。1ポンド（約450g）と1斤（約600g）は少し違うけど、一番近い単位だったからね。"
        },
        {
            "speaker": "student",
            "line": "なるほど！ポンドの代わりに斤って呼ぶことにしたんですね！"
        },
        {
            "speaker": "teacher",
            "line": "その通り。でも面白いことに、今の食パンの『1斤』は、そのどちらの重さでもないんだよ。"
        },
        {
            "speaker": "student",
            "line": "え、そうなんですか！？じゃあ、今の1斤は何グラムなんですか？"
        },
        {
            "speaker": "teacher",
            "line": "パン業界のルールで「340g以上」と決められているんだ。焼くと水分が飛んで軽くなるから、その分を考えた重さなんだね。"
        },
        {
            "speaker": "student",
            "line": "そうだったんだ！じゃあ「斤」は、もう重さの単位じゃなくて、食パンのサイズを表す呼び名みたいなものなんですね！"
        },
        {
            "speaker": "teacher",
            "line": "大正解！歴史の中で単位の意味が変わってきた、面白い例だね。"
        }
    ]

    const field = [0.45, 0.05, 0.0, 0.0, 0.0, 0.35, 0.0, 0.1, 0.0, 0.05]

    const title = "パンはなぜ「斤」で数えるの？"

    const contentsId = "pannokazoekata"

    const source = ""


    const data = { title: title, type: "knowledge", dialogue: dialogue, field: field, text: text, source: source }

    createOrupdateContentsInfo(contentsId, data)
}

