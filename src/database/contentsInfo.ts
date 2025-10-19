import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase"
import { getUserInfo } from "./userInfo";

export async function getContentsInfo(contentsId: string) {
    //   useEffect(()=>{
    //         const getContentsdata = async(contentsId:string)=>{
    //         const contentsdata = await getContentsInfo(contentsId)
    //         console.log(contentsdata)      
    //         }
    //         getContentsdata("nn5LmfypHP3N2nJ39S0U")
    //     },[])

    if (!contentsId) {
        return {}
    }
    const contentsRef = doc(db, "contents", contentsId)
    const contents = await getDoc(contentsRef);
    if (!contents.exists()) {
        return {};
    }
    const contentsData = contents.data();
    return contentsData
}

export async function getContentsCollectionInfo() {
    const contentsRef = collection(db, "contents")
    const snapshot = await getDocs(contentsRef);

    const contents = snapshot.docs.map(doc => ({
        id: doc.id,   // ドキュメントID
        title: doc.data().title,
        dialogue: doc.data().dialogue
    }));

    return contents;
}

export async function createOrupdateContentsInfo(contentsId: string, data: {
    dialogue?: {
        speaker: string;
        line: string;
    }[]
    title?: string
    type?: string
    field?: number[]
    text?: string
    source?: string
}) {
    // コンテンツIDを指定すると、そのコンテンツIDに紐づいたコンテンツ情報を更新、作成する関数
    // ex)    const data = { title: "フランス革命" };
    // createOrupdateContentsInfo("LBjWSgWKKmyAc5gckvGf", data)

    if (!contentsId) {
        return {}
    }
    const contentsRef = doc(db, "contents", contentsId)
    await setDoc(contentsRef, {
        ...data,
        createdAt: serverTimestamp(),
    }, { merge: true });
}


// --- コサイン類似度を計算する関数 ---
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return normA === 0 || normB === 0 ? 0 : dot / (normA * normB)
}

// export async function getRecommendedContents(userId: string, n: number = -1) {
//     // ① ユーザーデータを取得
//     const userData = await getUserInfo(userId)
//     if (!userData || !userData.preference || !userData.alreadyRead) {
//         console.warn("User data is incomplete")
//         return []
//     }

//     const user_preference: number[] = userData.preference
//     const alreadyRead: string[] = userData.alreadyRead

//     // n >= 0 の場合は単一成分ベクトルを使用
//     const vectorLength = user_preference.length
//     const targetVector = (n >= 0 && n < vectorLength)
//         ? Array(vectorLength).fill(0).map((_, i) => (i === n ? 1 : 0))
//         : user_preference // -1 の場合は従来の嗜好ベクトル

//     // ② Firestoreから全コンテンツを取得
//     const contentsRef = collection(db, "contents")
//     const snapshot = await getDocs(contentsRef)

//     // ③ 未読のものだけに絞って類似度を計算
//     const contents = snapshot.docs
//         .filter(doc => !alreadyRead.includes(doc.id))
//         .map(doc => {
//             const data = doc.data()
//             const similarity = cosineSimilarity(targetVector, data.field)
//             return {
//                 id: doc.id,
//                 title: data.title,
//                 dialogue: data.dialogue,
//                 field: data.field,
//                 similarity,
//             }
//         })

//     // ④ 類似度の高い順に並べて上位50件を返す
//     const top50 = contents
//         .sort((a, b) => b.similarity - a.similarity)
//         .slice(0, 50)

//     return top50
// }

export async function getRecommendedContents(userId: string, n: number = -1) {
    // ① ユーザーデータ取得
    const userData = await getUserInfo(userId)
    if (!userData || !userData.preference || !userData.alreadyRead) {
        console.warn("User data is incomplete")
        return []
    }
    const epsilon = userData.randomness || 50

    const user_preference: number[] = userData.preference
    const alreadyRead: string[] = userData.alreadyRead

    // n >= 0 の場合は単一成分ベクトルを使用
    const vectorLength = user_preference.length
    const targetVector =
        n >= 0 && n < vectorLength
            ? Array(vectorLength)
                .fill(0)
                .map((_, i) => (i === n ? 1 : 0))
            : user_preference

    // ② Firestoreからランダムに20件取得
    const contentsRef = collection(db, "contents")
    const snapshot = await getDocs(query(contentsRef, orderBy("title"), limit(20)))

    // ③ 未読のみフィルタ＆類似度計算
    const contents = snapshot.docs
        .filter((doc) => !alreadyRead.includes(doc.id))
        .map((doc) => {
            const data = doc.data()
            const similarity = cosineSimilarity(targetVector, data.field)
            return {
                id: doc.id,
                title: data.title,
                dialogue: data.dialogue,
                field: data.field,
                similarity,
            }
        })

    // ④ 類似度でソート
    const sortedContents = contents.sort((a, b) => b.similarity - a.similarity)

    // ⑤ ε-greedy法
    // n >= 0 の場合 → 通常の類似度上位推薦
    // n == -1 の場合 → ε確率で上位から選び、(1 - ε)確率でランダムに選ぶ
    let selected: typeof contents = []

    if (n === -1) {
        if (Math.random()*100 < epsilon) {
            console.log("上位")
            // εの確率で上位推薦（探索）
            selected = sortedContents.slice(0, 5)
        } else {
            console.log("下位")
            // 1 - εの確率でランダム推薦（多様性）
            const shuffled = [...contents].sort(() => Math.random() - 0.5)
            selected = shuffled.slice(0, 5)
        }
    } else {
        selected = sortedContents.slice(0, 5)
    }
    console.log(selected)

    return selected
}