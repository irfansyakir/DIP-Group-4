import {child, get, ref, update, push, query, orderByChild} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

export async function message_setMessage({roomID, username, message, timestamp}) {
  if (roomID === undefined || username === undefined || message === undefined || timestamp === undefined) {
    throw new Error("One or more required parameters are missing or empty in message_setMessage.");
  }

  const updates = {};
  const newMessageId = push(child(dbRef, `/messages/${roomID}`)).key;

  updates[`messages/${roomID}/${newMessageId}`] = {
    username: username,
    message: message,
    timestamp: timestamp
  }

  updates[`rooms/${roomID}/last_message`] = `${username}: ${message}`
  updates[`rooms/${roomID}/last_message_timestamp`] = timestamp

  try {
    await update(dbRef, updates)
    // await console.log("message set successfully.")
  }catch (e) {
    console.log("error in setMessage")
    throw e
  }
}

export async function message_removeAllMessageInRoom({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in removing message function.");
  }
  const updates = {};
  updates[`/messages/${roomID}`] = null
  try {
    await update(dbRef, updates)
    // await console.log("room deleted successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function message_getMessage({roomID}) {
  if (roomID === null) {
    throw new Error("roomId is missing in message_getMessage.");
  }
  try {
    let sortedMessages = []
    const messagesQueryRef = await query(ref(db, `messages/${roomID}`), orderByChild(`timestamp`));
    const snapshot = await get(messagesQueryRef);

    //sorting
    snapshot.forEach(individualMessage => {
      sortedMessages.push(individualMessage)
    })
    return sortedMessages;
  }catch (e) {
    console.log("error in getMessage")
    throw e
  }
}