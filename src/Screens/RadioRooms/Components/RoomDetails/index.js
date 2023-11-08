import {useEffect} from "react";

export const RoomDetails = ({route, navigation}) => {
    //can just make this page look like the telegram room details
    const { roomName, roomUserIDList, roomDJIDList } = route.params;

    useEffect(() => {
        console.log('rooomname: ', roomName)
        console.log('roomUserIDs: ', roomUserIDList)
        console.log('roomDJs: ', roomDJIDList)
    }, []);
    return(
      <></>
    )
}