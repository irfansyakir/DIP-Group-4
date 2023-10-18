import {child, get, update, push} from "firebase/database";
import {dbRef} from "../../../firebaseConfig";

export async function queue_updateQueue({roomID, queueList = null}){
  const updates = {};
  console.log("inside the queue function: ", roomID, queueList)

  if (!roomID) {
    const newRoomId = push(child(dbRef, `/queues`)).key;
    updates[`/queue/${newRoomId}`] = queueList
  }
  else{
    updates[`/queue/${roomID}`] = queueList
  }

  try {
    await update(dbRef, updates)
    await console.log("queue updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function queue_getQueue({roomID}){
  if (!roomID) {
    throw new Error("roomID is missing in queue_getQueue.");
  }
  try {
    const snapshot = await get(child(dbRef, `/queue/${roomID}`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function queue_removeQueue({roomID}){
  if (!roomID) {
    throw new Error("roomID is missing in queue_removeQueue.");
  }
  const updates = {};
  updates[`/queue/${roomID}`] = null
  try {
    await update(dbRef, updates)
    // await console.log("queue deleted successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

// TrackInfo -> Add to queue button
export async function queue_addToQueue({roomID, trackId}){
  if (!roomID) {
    throw new Error("roomID is missing in queue_addToQueue.");
  }
  try {
    await push(child(dbRef, `queue/${roomID}/`), trackId);
    await console.log("song added successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}