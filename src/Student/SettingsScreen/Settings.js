import React from 'react'
import {Text, Container, Button, Icon, Left, Header} from 'native-base'

export default class Settings extends React.Component {

    render() {
        const { goBack } = this.props.navigation;
        return <Container>
            <Header>
                <Left>
                    <Button
                        transparent
                        onPress={() => goBack(null)}
                    >
                        <Icon name="arrow-back" />
                    </Button>
                </Left>
            </Header>
            <Text> These would be settings </Text>
        </Container>
    }
}