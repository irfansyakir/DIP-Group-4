import {child, get, update, push, remove, ref} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

export async function room_updateRoom({roomID, roomName, roomDescription, themeImageUrl, last_message, last_message_timestamp, dj, isPublic, users, isOthersAddSongs}){
  if (roomID === null && roomName === null && last_message === null && themeImageUrl == null && last_message_timestamp === null && isOthersAddSongs === null && roomDescription === null && dj === null && isPublic === null && users === null) {
    //this is atrocious but too lazy to change
    throw new Error("One or more required parameters are missing or empty in room_updateRoom.");
  }
  const updates = {};

  if(!roomID){
    roomID = push(child(dbRef, `/rooms`)).key;
  }
  if(roomName !== undefined){
    updates[`/rooms/${roomID}/room_name`] = roomName
  }
  if(roomDescription !== undefined){
    updates[`/rooms/${roomID}/room_description`] = roomDescription
  }
  if(themeImageUrl !== undefined){
    updates[`/rooms/${roomID}/themeImageUrl`] = themeImageUrl
  }
  if(last_message !== undefined){
    updates[`/rooms/${roomID}/last_message`] = last_message
  }
  if(last_message_timestamp !== undefined){
    updates[`/rooms/${roomID}/last_message_timestamp`] = last_message
  }
  if(dj !== undefined){
    updates[`/rooms/${roomID}/dj`] = dj
  }
  if(isPublic !== undefined){
    updates[`/rooms/${roomID}/isPublic`] = isPublic
  }
  if(users !== undefined){
    updates[`/rooms/${roomID}/users`] = users
  }
  if(isOthersAddSongs !== undefined){
    updates[`/rooms/${roomID}/isOthersAddSongs`] = isOthersAddSongs
  }

  try {
    await update(dbRef, updates)
    //returns roomID
    return roomID
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

export async function room_getAllRooms(){
  try {
    const snapshot = await get(child(dbRef, `/rooms`));
    return await snapshot.val()
  }catch (e) {
    console.log(e)
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