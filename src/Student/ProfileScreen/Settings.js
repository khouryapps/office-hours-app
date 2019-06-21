import React from 'react'
import {Text, Container, Button, Icon, Left, Header} from 'native-base'

export default class Settings extends React.Component {

    render() {
        return <Container>
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => this.props.navigation.navigate('Home')}
                    >
                        <Icon name="arrow-back" />
                    </Button>
                </Left>
            </Header>
            <Text> These would be settings </Text>
        </Container>
    }
}