import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
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

// --- ユーザー嗜好に基づいて未読コンテンツを推薦 ---
export async function getRecommendedContents(userId: string) {
    // ① ユーザーデータを取得
    const userData = await getUserInfo(userId)
    if (!userData || !userData.preference || !userData.alreadyRead) {
        console.warn("User data is incomplete")
        return []
    }

    const user_preference: number[] = userData.preference
    const alreadyRead: string[] = userData.alreadyRead

    // ② Firestoreから全コンテンツを取得
    const contentsRef = collection(db, "contents")
    const snapshot = await getDocs(contentsRef)

    // ③ 未読のものだけに絞って類似度を計算
    const contents = snapshot.docs
        .filter(doc => !alreadyRead.includes(doc.id))
        .map(doc => {
            const data = doc.data()
            const similarity = cosineSimilarity(user_preference, data.field)
            return {
                id: doc.id,
                title: data.title,
                dialogue: data.dialogue,
                field: data.field,
                similarity,
            }
        })

    // ④ 類似度の高い順に並べて上位50件を返す
    const top50 = contents
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 50)

    return top50
}