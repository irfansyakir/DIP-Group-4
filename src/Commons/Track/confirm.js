import React from 'react';
import { Modal, StyleSheet, Text, View} from 'react-native';

export const ConfirmationPopup = ({ isVisible }) => {
    return (
    <View style={styles.modalContainer} pointerEvents="none">
    <Modal animationType='fade' transparent={true} visible={isVisible}>
      <View style={{flex:1,}}></View>
      <View style={{alignItems: 'center',
      height: '50%', 
      width: '100%',}}>

        <View style={styles.modalView}>
        <Text style={styles.textStyle}>Song added in queue!</Text>
        </View>
        
      </View>
    </Modal>
   </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
      alignItems: 'center',
      position: 'absolute',
      height: '100%', 
      width: '100%',
      // backgroundColor:'red'
   },
    modalView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      top: '75%',
      width: '90%', 
      height: 45,
      backgroundColor: 'white',
      borderRadius: 8
   },
   textStyle: {
      color: 'black',
      textAlign: 'center',
      fontSize: 14,
      marginLeft: 20
   }
   });
   