import { createOrupdateNewsContentsInfo } from "./newscontentInfo"

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
    const text = "JPHacks大阪優勝はなんとのアレ、主催者の来年の意向も発表"

    const dialogue = [
        {
          "speaker": "student",
          "line": "先生、JPHACKSってニュースで見たんですけど、どんなイベントなんですか？"
        },
        {
          "speaker": "teacher",
          "line": "いい質問だね。JPHACKSは、学生がチームを組んで48時間でサービスやアプリを開発する、国内最大級のハッカソンなんだ。"
        },
        {
          "speaker": "student",
          "line": "48時間で!? すごいスピードですね！今年はどんな作品が優勝したんですか？"
        },
        {
          "speaker": "teacher",
          "line": "優勝したのは『迷子たこ焼きレーダー改』というアプリだよ。AIとGPSを使って、今いる場所の近くにあるたこ焼き屋台をリアルタイムで案内してくれるんだ。"
        },
        {
          "speaker": "student",
          "line": "たこ焼きレーダー！？大阪らしくて面白いですね！"
        },
        {
          "speaker": "teacher",
          "line": "そうなんだ。審査員からも『大阪の文化と最新技術の融合』って高く評価されたそうだよ。"
        },
        {
          "speaker": "student",
          "line": "会場も盛り上がってたんでしょうね！"
        },
        {
          "speaker": "teacher",
          "line": "うん、徹夜でコードを書いたり、差し入れのたこ焼きを巡って争奪戦になったり、かなり熱気に包まれていたらしいよ。"
        },
        {
          "speaker": "student",
          "line": "まさに青春のハッカソンって感じですね！次回もあるんですか？"
        },
        {
          "speaker": "teacher",
          "line": "主催者は『次回は宇宙人も参加できる国際版を検討中』って冗談交じりに話していたよ。ますますスケールが大きくなりそうだね。"
        },
        {
          "speaker": "student",
          "line": "宇宙人まで！？楽しみですね！"
        }
      ]
    const field = [0.2, 0.15, 0.3, 0.0, 0.1, 0.05, 0.0, 0.15, 0.05, 0.0]

    const title = "JPHacks大阪優勝はなんとのアレ、主催者の来年の意向も発表"

    const contentsId = "jphacks"

    const source = "created by Ko"


    const data = { title: title, type: "news", dialogue: dialogue, field: field, text: text, source: source }

    createOrupdateNewsContentsInfo(contentsId, data)
}

