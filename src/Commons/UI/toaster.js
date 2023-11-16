import Toast from 'react-native-toast-message'

const errorCloseQueueToast = () => {
    Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'Please add songs to queue to start jamming!🕺',
    })
}

export { errorCloseQueueToast }
