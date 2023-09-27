import {child, get, ref, update, push, query, orderByChild} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

export async function message_setMessage({roomId, username, message, timestamp}) {
  if (!roomId || !username || !message || !timestamp) {
    throw new Error("One or more required parameters are missing or empty in message_setMessage.");
  }

  const updates = {};
  const newMessageId = push(child(dbRef, `/messages/${roomId}`)).key;

  updates[`messages/${roomId}/${newMessageId}`] = {
    username: username,
    message: message,
    timestamp: timestamp
  }

  updates[`rooms/${roomId}/last_message`] = `${username}: ${message}`
  updates[`rooms/${roomId}/last_message_timestamp`] = timestamp

  try {
    await update(dbRef, updates)
    // await console.log("message set successfully.")
  }catch (e) {
    console.log("error in setMessage")
    throw e
  }
}

export async function message_getMessage({roomId}) {
  if (!roomId) {
    throw new Error("roomId is missing in message_getMessage.");
  }
  try {
    let sortedMessages = []
    const messagesQueryRef = await query(ref(db, `messages/${roomId}`), orderByChild(`timestamp`));
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