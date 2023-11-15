import {child, get, ref, update, remove} from "firebase/database";
import {db, dbRef} from "../../../firebaseConfig"

async function userExist({userID}){
  const snapshot = await get(child(dbRef, `users/${userID}`))
  return snapshot.exists()
}

export async function user_updateUser({userID, username, roomsObjects}){
  if (userID === null || username === null || roomsObjects === null) {
    throw new Error("One or more required parameters are missing or empty in user_updateUser.");
  }
  const updates = {};

  if(userID){
    updates[`/users/${userID}`] = userID
  }
  if(username){
    updates[`/users/${userID}/${username}`] = username
  }
  if(roomsObjects){
    updates[`/users/${userID}/rooms}`] = roomsObjects
  }

  try {
    await update(dbRef, updates)
    // await console.log("rooms updated successfully")
  }catch (e) {
    console.log(e)
    throw e
  }
}

export async function user_getRooms({userID}) {
  if (userID === null) {
    throw new Error("userID is missing or empty in user_getRooms.");
  }
  try {
    const snapshot = await get(child(dbRef, `/users/${userID}/rooms/`));
    return await snapshot.val()
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function user_getUsername({userID}) {
  if (userID === null) {
    throw new Error("userID is missing or empty in user_getUsername.");
  }
  try {
    const snapshot = await get(child(dbRef, `/users/${userID}/username/`));
    return await snapshot.val()
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function user_addToRoom({userID, arrayOfRoomIDs}){
  if (userID === null || arrayOfRoomIDs === null) {
    throw new Error("One or more required parameters are missing or empty in user_addToRoom.");
  }
  const updates = {};

  await arrayOfRoomIDs.forEach(roomId => {
    updates[`/users/${userID}/rooms/${roomId}`] = true
  })

  try {
    if (!(await userExist(userID))) {
      console.log("user does not exists");
    }
    else{
      await update(dbRef, updates)
      // await console.log("user added to rooms successfully")
    }
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function user_removeFromRooms({userID, arrayOfRoomIDs}){
  if (userID === null || arrayOfRoomIDs === null) {
    throw new Error("One or more required parameters are missing or empty in user_removeFromRooms.");
  }
  const updates = {};

  arrayOfRoomIDs.forEach(roomId => {
    updates[`/users/${userID}/rooms/${roomId}`] = null
  })

  try {
    if (!(await userExist(userID))) {
      console.log("user does not exists");
    }
    else{
      await update(dbRef, updates)
      // await console.log("user removed from rooms successfully")
    }
  }catch (e) {
    console.log(e)
    throw e
  }
}
export async function user_removeUser({userID}){
  if (userID === null) {
    throw new Error("userID is missing or empty in user_removeUser.");
  }
  try {
    if (!(await userExist(userID))) {
      console.log("user does not exists");
    }
    else {
      remove(ref(db, `users/${userID}`))
        .then(() => {
          // console.log("user deleted successfully")
        })
        .catch(error => {
          console.log("Error in deleting user")
          throw error
        });
    }
  }catch (e) {
    console.log(e)
    throw e
  }
}