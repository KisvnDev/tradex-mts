import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

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
    height: 160,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  captureInside2: {
    borderWidth: 4,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.BLACK,
    width: '95%',
    height: '95%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: 360,
    height: 360,
    borderRadius: 180,
    overflow: 'hidden',
  },
  cameras: {
    flex: 1,
  },
  timerText: {
    color: Colors.WHITE,
    fontSize: 25,
    fontWeight: 'bold',
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
});
