import {child, get, update, push} from "firebase/database";
import {dbRef} from "../../../firebaseConfig"

export async function room_updateRoom({roomID, roomName, roomDescription, themeImageUrl, last_message, last_message_timestamp, djList, isPublic, isOthersAddSongs}){
  if (roomID === null && roomName === null && roomDescription === null && last_message === null && themeImageUrl == null && last_message_timestamp === null && djList === null && isPublic === null && isOthersAddSongs == null) {
    throw new Error("One or more required parameters are missing or empty in room_updateRoom.");
  }
  const updates = {};

  if(roomID){
    if(roomName){
      updates[`/rooms/${roomID}/room_name`] = roomName
    }
    if(roomDescription){
      updates[`/rooms/${roomID}/room_description`] = roomDescription
    }
    if(themeImageUrl){
      updates[`/rooms/${roomID}/themeImageUrl`] = themeImageUrl
    }
    if(last_message){
      updates[`/rooms/${roomID}/last_message`] = last_message
    }
    if(last_message_timestamp){
      updates[`/rooms/${roomID}/last_message_timestamp`] = last_message
    }
    if(djList){
      updates[`/rooms/${roomID}/djList`] = djList
    }
    if(isPublic){
      updates[`/rooms/${roomID}/isPublic`] = isPublic
    }
    if(isOthersAddSongs){
      updates[`/rooms/${roomID}/isOthersAddSongs`] = isOthersAddSongs
    }
  }
  else {
    const newRoomId = push(child(dbRef, `/rooms`)).key;

    if(roomName){
      updates[`/rooms/${newRoomId}/room_name`] = roomName
    }
    if(roomDescription){
      updates[`/rooms/${newRoomId}/room_description`] = roomDescription
    }
    if(themeImageUrl){
      updates[`/rooms/${roomID}/themeImageUrl`] = themeImageUrl
    }
    if(last_message){
      updates[`/rooms/${newRoomId}/last_message`] = last_message
    }
    if(last_message_timestamp){
      updates[`/rooms/${newRoomId}/last_message_timestamp`] = last_message
    }
    if(djList){
      updates[`/rooms/${newRoomId}/djList`] = djList
    }
    if(isPublic){
      updates[`/rooms/${newRoomId}/isPublic`] = isPublic
    }
    if(isOthersAddSongs){
      updates[`/rooms/${roomID}/isOthersAddSongs`] = isOthersAddSongs
    }
  }

  try {
    await update(dbRef, updates)
    // await console.log("rooms updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function room_getRoom({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_getRoom.");
  }
  try {
    const snapshot = await get(child(dbRef, `/rooms/${roomID}`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function room_removeRoom({roomID}){
  if (roomID === null) {
    throw new Error("roomId is missing in room_removeRoom.");
  }
  const updates = {};
  updates[`/rooms/${roomID}`] = null
  try {
    await update(dbRef, updates)
    // await console.log("room deleted successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}