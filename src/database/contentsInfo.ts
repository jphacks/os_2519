import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase"

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


export async function createOrupdateContentsInfo(contentsId: string, data:{
    dialogue?:{
        speaker: string;
        line: string;
    }[]
    title?:string
    type?: string
    field?:number[]
    text?:string
    source?:string
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

