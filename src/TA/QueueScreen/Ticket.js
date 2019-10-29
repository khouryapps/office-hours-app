import React from 'react';

import { Card, Button } from "@ant-design/react-native"
import { Image, Text,} from "react-native";

export default class Ticket extends React.Component {

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

    getTagColor = () => {
        const {status} = this.props;
        if (status === "Open") {
            return "deepskyblue"
        } else if (status === "In Progress") {
            return "limegreen"
        }
    }

    render() {
        const { id, creator, question, tags, status} = this.props;
        return (
            <Card>
                <Card.Header
                    title={creator.full_name}
                    thumbStyle={{width: 60, height: 60}}
                    thumb={creator.photo_url}
                    extra={this.generate_button(status)}
                />
                <Card.Body>
                    <Text>Question: {question}</Text>
                {/*{tags.length ? (<CardItem>*/}
                {/*        <Text>Tags: {tags}</Text>*/}
                {/*    </CardItem>)*/}
                {/*    : null}*/}
                </Card.Body>
                <Card.Footer content={<Button style={{alignSelf: 'flex-start', borderColor: this.getTagColor()}}  size="small">
                    <Text style={{color: this.getTagColor()}}>{status}</Text></Button>}/>
            </Card>
        )
    }
}
