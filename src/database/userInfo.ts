import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase"

export async function getUserInfo(userId: string) {
    // ユーザーIDを指定すると、そのユーザーIDに紐づいたユーザー情報が返ってくる関数
    // ex)  useEffect(()=>{
    //     const getUserdata = async(userId:string)=>{
    //       const userdata = await getUserInfo(userId)
    //       console.log(userdata)      
    //     }
    //     getUserdata("LBjWSgWKKmyAc5gckvGf")
    //   },[])
    // これでuserdataにはオブジェクトが入る
    
    if (!userId) {
        return {}
    }
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
        return {};
    }
    const userData = userDoc.data();

    return userData
}


export async function createOrupdateUserInfo(userId: string, data:{
    alreadyRead?:string[]
    email?:string
    prefernce?:number[]
    readList?:{}
    userName?:string
}) {
    // ユーザーIDを指定すると、そのユーザーIDに紐づいたユーザー情報を更新、作成する関数
    // ex)    const data = { userName: "Tomoki" };
    // createOrupdateUserInfo("LBjWSgWKKmyAc5gckvGf", data)
    
    if (!userId) {
        return {}
    }
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, {
        ...data
    }, { merge: true });
}

export async function setInitialUserInfo(userId: string, email:string) 
{
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, {
        createdAt:serverTimestamp(),
        alreadyRead:[],
        userName:email,
        email:email,
        preference:[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
        readList:{}
    }, { merge: true });
}


export async function markDialogueAsRead(userId: string, contentId: string) {
    console.log("yobareta")
    if (!userId) return;

    // 1. 既存のユーザー情報を取得
    const userData = await getUserInfo(userId);

    // 2. alreadyRead に追加（重複チェック）
    const alreadyRead: string[] = userData.alreadyRead || [];
    if (!alreadyRead.includes(contentId)) {
        alreadyRead.push(contentId);
    }

    // 3. readList に追加（今日の日付キーで配列管理）
    const todayKey = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "20251018" の形式
    const readList = { ...(userData.readList || {}) };

    if (!readList[todayKey]) {
        readList[todayKey] = [];
    }

    if (!readList[todayKey].includes(contentId)) {
        readList[todayKey].push(contentId);
    }

    // 4. Firestore に更新
    await createOrupdateUserInfo(userId, {
        alreadyRead,
        readList
    });

    console.log(`User ${userId} updated: alreadyRead=${alreadyRead}, readList=${JSON.stringify(readList)}`);
}

// export async function setInitialUserInfo(email:string) {
//     const userRef = collection(db, "users")
//     const Ref = await addDoc(userRef, {
//         createdAt:serverTimestamp(),
//         alreadyRead:[],
//         userName:email,
//         email:email,
//         prefernce:[0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
//         readList:{}
//     });
//     const userid = Ref.id
//     console.log(userid)
//     return userid
// }
