import React from 'react';

import { Text, Card, CardItem, Button } from 'native-base'
import { Image } from "react-native";

export default class ShowTicket extends React.Component {

    generate_button = (current_status) => {
        const {id, showButtonOnStatus} = this.props
        if (showButtonOnStatus === current_status) {
            if (current_status === "Open") {
                return (
                    <Button onPress={() => this.props.updateTicket(id, "In Progress")}>
                        <Text>Begin Helping</Text>
                    </Button>
                )
            }
            else if (current_status === "In Progress") {
                return (
                    <Button warning onPress={() => this.props.updateTicket(id, "Closed")}>
                        <Text>Fishing Helping</Text>
                    </Button>
                )
            }
        } else {
            return null
        }
    };

    render() {
        const { id, creator, question, tags, status} = this.props;
        return (
            <Card>
                <CardItem>
                    <Image
                        style={{width: 50, height: 50}}
                        source={{uri: creator.photo_url}}
                        />
                </CardItem>
                <CardItem>
                    <Text>Name: {creator.full_name}</Text>
                </CardItem>
                <CardItem>
                    <Text>Question: {question}</Text>
                </CardItem>
                {tags.length ? (<CardItem>
                        <Text>Tags: {tags}</Text>
                    </CardItem>)
                    : null}
                <CardItem>
                    <Text>Status: {status}</Text>
                </CardItem>
                <CardItem>
                    {this.generate_button(status)}
                </CardItem>
            </Card>
        )
    }
}