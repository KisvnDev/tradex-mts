import { StyleSheet } from 'react-native';
import { Colors, width } from 'styles';

export default StyleSheet.create({
  containers: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.BLACK,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    alignSelf: 'center',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionImage: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionImage3: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // cameraBottom: {
  //   flex: 0,
  // },
  // cameraBottom2: {
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // },
  // cameraTop: {
  //   flex: 0,
  //   // flexDirection: 'row',
  //   // alignItems: 'center',
  //   // backgroundColor: 'blue',
  // },
  // cameraTop2: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  OTPContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  OTPContainerContainer: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  OTPBody: {
    backgroundColor: Colors.WHITE,
    width: width * 0.8,
    height: 350,
    justifyContent: 'center',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  note: {
    flex: 2,
    padding: 10,
  },
  cameraBottom: {
    flex: 0,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cameraTop: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  captureInside: {
    borderWidth: 4,
    borderColor: Colors.BLACK,
    backgroundColor: Colors.WHITE,
    width: '95%',
    height: '95%',
    borderRadius: 40,
  },
  cameraNote: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 20,
  },
  cameraTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  cameraFlash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 50,
    paddingLeft: 20,
  },
  cameraQuit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 50,
    paddingRight: 20,
  },
  cameraNoteText: {
    color: Colors.WHITE,
    textAlign: 'center',
  },
  retakeButtonContainerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  retakeButtonContainer: {
    width: 130,
    height: 50,
    backgroundColor: '#FFC059',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  continueButtonContainer: {
    width: 130,
    height: 50,
    backgroundColor: '#0061B9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  retakeButtonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  // cameraStyle: {
  //   // width,
  //   // height: width / 1.57,
  // },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.4,
    backgroundColor: Colors.BLACK,
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryArea: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  resendText: {
    fontWeight: 'bold',
    color: Colors.PRIMARY_1,
  },
  resendText2: {
    color: Colors.WHITE,
  },
  modalContent: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
