import {child, get, update, push, query, ref} from "firebase/database";
import {dbRef, db} from "../../../firebaseConfig";

export async function userQueue_updateQueue({userID, userQueueList = null}){
  const updates = {};
  // console.log("inside the userQueue function: ", userID, userQueueList)

  if (!userID) {
    const newUserID = push(child(dbRef, `/user_queue`)).key;
    updates[`/user_queue/${newUserID}`] = userQueueList
  }
  else{
    updates[`/user_queue/${userID}`] = userQueueList 
  }

  try {
    await update(dbRef, updates)
    await console.log("userQueue updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function userQueue_getQueue({userID}){
  if (!userID) {
    throw new Error("userID is missing in userQueue_getQueue.");
  }
  try {
    const snapshot = await get(child(dbRef, `/user_queue/${userID}`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function userQueue_removeQueue({userID}){
  if (!userID) {
    throw new Error("userID is missing in userQueue_removeQueue.");
  }
  const updates = {};
  updates[`/user_queue/${userID}`] = null
  try {
    await update(dbRef, updates)
    // await console.log("userQueue deleted successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

// Test
// export async function userQueue_addToQueue({userID, trackId}){
//   if (!userID) {
//     throw new Error("userID is missing in userQueue_addToQueue.");
//   }
//   try {
//     await push(child(dbRef, `userQueue/${userID}/`), trackId);
//     await console.log("song added successfully")
//   }catch (e) {
//     console.log(e)
//     throw e
//   }
// }