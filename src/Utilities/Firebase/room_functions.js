import {child, get, update, push, remove, ref} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

export async function room_updateRoom({roomID, roomName, last_message, last_message_timestamp, djList, isPublic, usersObject}){
  if (roomID === null && roomName === null && last_message === null && last_message_timestamp === null && djList === null && isPublic === null) {
    throw new Error("One or more required parameters are missing or empty in room_updateRoom.");
  }
  const updates = {};

  if(roomID){
    if(roomName){
      updates[`/rooms/${roomID}/room_name`] = roomName
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
    if(usersObject){
      updates[`/rooms/${roomID}/users`] = usersObject
    }
  }
  else {
    const newRoomId = push(child(dbRef, `/rooms`)).key;

    if(roomName){
      updates[`/rooms/${newRoomId}/room_name`] = roomName
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
      updates[`/rooms/${roomID}/isPublic`] = isPublic
    }
    if(usersObject){
      updates[`/rooms/${roomID}/users`] = usersObject
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

export async function room_addUser({roomID, userID, username}){
  if (roomID === null || userID === null || username === null) {
    throw new Error("One or more required parameters are missing or empty in room_addUser.");
  }
  const updates = {};
  updates[`/rooms/${roomID}/users/${userID}`] = {
    username: username
  }

  try {
    await update(dbRef, updates)
  }catch (e) {
    console.log("error in room_addUser")
    throw e
  }
}

export async function room_removeUser({roomID, userID}){
  if (roomID === null || userID === null) {
    throw new Error("One or more required parameters are missing or empty in room_addUser.");
  }
  try {
    remove(ref(db, `/rooms/${roomID}/users/${userID}`))
      .then(() => {
        console.log("user deleted from room successfully")
      })
      .catch(error => {
        console.log("Error in deleting user")
        throw error
      });
  }catch (e) {
    console.log("error in room_addUser")
    throw e
  }
}