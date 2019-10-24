// import React from "react";
// import {Body, Button, Container, Header, Icon, Left, Right, Text, Title, View} from "native-base";
// import {Modal, StyleSheet} from "react-native";
//
//
// export default class QueueCode extends React.Component {
//
//     render() {
//         return (
//             <Container>
//                 <View style={styles.container}>
//                     <Modal
//                         visible={this.props.modalVisible}
//                         animationType={'slide'}
//                         onRequestClose={() => this.props.closeModal()}>
//                         <Header>
//                             <Left style={{flex: 1}}>
//                                 <Button iconLeft transparent onPress={() => this.props.closeModal()}>
//                                     <Icon name='arrow-back'/>
//                                 </Button>
//                             </Left>
//                             <Body style={{flex: 1}}>
//                                 <Title>Queue Code</Title>
//                             </Body>
//                             <Right style={{flex: 1}}/>
//                         </Header>
//                         <View style={styles.modalContainer}>
//                             <View style={styles.innerContainer}>
//                                 <Title>Code: {this.props.queueCode}</Title>
//                                 <Title/>
//                                 <Text>Make sure this is written on the board so students can join the queue.</Text>
//                             </View>
//                         </View>
//
//                     </Modal>
//                 </View>
//             </Container>
//         )
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: 'white',
//     },
//     innerContainer: {
//         alignItems: 'center',
//     },
// });
