import Toast from 'react-native-toast-message'

const errorCloseQueueToast = () => {
    Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Please add songs to queue to start jamming!🕺',
        visibilityTime: 2000,
        topOffset: 70,
    })
}

const addQueue = () => {
    Toast.show({
        type: 'success',
        text1: 'Yay!',
        text2: 'Song is added to queue!🥳',
        visibilityTime: 1000,
        topOffset: 70,
    })
}

const emptyQueue = () => {
    Toast.show({
        type: 'info',
        text1: 'Uh Oh',
        text2: 'Your queue is empty, add some songs to start jamming!💃',
        visibilityTime: 2000,
        topOffset: 70,
    })
}

const notDJAlert = () => {
    Toast.show({
        type: 'info',
        text1: 'Sorry!',
        text2: 'Only DJ can add songs to queue!🎧',
        visibilityTime: 2000,
        topOffset: 70,
    })
}

export { errorCloseQueueToast, addQueue, emptyQueue, notDJAlert }
