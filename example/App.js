/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Button,
  View,
  ToastAndroid,
  Alert,
  Platform
} from "react-native";

import MCReactModule from "react-native-marketingcloudsdk";

class RegistrationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactKey: '',
            contactKeyEdit: '',
            attributes: '',
            attrKeyEdit: '',
            attrValEdit: '',
            tags: '',
            tagEdit: '',
        };
        this.setContactKey = this.setContactKey.bind(this);
        this.setAttribute = this.setAttribute.bind(this);
        this.clearAttribute = this.clearAttribute.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.addTag = this.addTag.bind(this);
    }

    async componentDidMount(): void {
        this.updateRegistrationData();
    }

    async updateRegistrationData() {
        let contactKey = await MCReactModule.getContactKey();
        let attrs = await MCReactModule.getAttributes();
        let tags = await MCReactModule.getTags();
        this.setState({
            contactKey: contactKey,
            attributes: attrs,
            tags: tags,
        });
    }

    setContactKey() {
        MCReactModule.setContactKey(this.state.contactKeyEdit);
        this.updateContactKey();
        LoggingComponent.notifyMessage("ContactKey Set");
    }

    async updateContactKey() {
        let contactKey = await MCReactModule.getContactKey();
        this.setState({
            contactKey: contactKey,
        });
    }

    setAttribute() {
        MCReactModule.setAttribute(this.state.attrKeyEdit, this.state.attrValEdit);
        this.updateAttributes();
        LoggingComponent.notifyMessage("Attribute Set");
    }

    clearAttribute() {
        MCReactModule.clearAttribute(this.state.attrKeyEdit);
        this.updateAttributes();
        LoggingComponent.notifyMessage("Attribute Cleared");
    }

    async updateAttributes() {
        let attrs = await MCReactModule.getAttributes();
        this.setState({
            attributes: attrs,
        });
    }

    removeTag() {
        MCReactModule.removeTag(this.state.tagEdit);
        this.updateTags();
        LoggingComponent.notifyMessage("Tag Removed");
    }

    addTag() {
        MCReactModule.addTag(this.state.tagEdit);
        this.updateTags();
        LoggingComponent.notifyMessage("Tag Added");
    }

    async updateTags() {
        let tags = await MCReactModule.getTags();
        this.setState({
            tags: tags,
        });
    }

    render() {
        return (
            <View style={styles.verticalContainer}>
                <Text style={styles.heading}>Registration</Text>
                <Text style={styles.smallHeading}>Contact Key</Text>
                <TextInput style={styles.input}
                           onChangeText={value => this.setState({contactKeyEdit: value})}/>
                <View style={[styles.horizontalContainer, {justifyContent: 'flex-end'}]}>
                    <Button title={"Set Contact Key"}
                            onPress={this.setContactKey}/>
                </View>
                <Text style={styles.body}>{this.state.contactKey}</Text>

                <Text style={styles.smallHeading}>Attributes</Text>
                <TextInput style={styles.input}
                           onChangeText={value => this.setState({attrKeyEdit: value})}/>
                <TextInput style={styles.input}
                           onChangeText={value => this.setState({attrValEdit: value})}/>
                <View style={[styles.horizontalContainer, {justifyContent: 'flex-end'}]}>
                    <Button title={"Clear Attribute"}
                            onPress={this.clearAttribute}/>
                    <View style={{padding: 10}}/>
                    <Button title={"Set Attribute"}
                            onPress={this.setAttribute}/>
                </View>
                <Text style={styles.body}>{JSON.stringify(this.state.attributes, undefined, 2)}</Text>

                <Text style={styles.smallHeading}>Tags</Text>
                <TextInput style={styles.input}
                           onChangeText={value => this.setState({tagEdit: value})}/>
                <View style={[styles.horizontalContainer, {justifyContent: 'flex-end'}]}>
                    <Button title={"Remove Tag"}
                            onPress={this.removeTag}/>
                    <View style={{padding: 10}}/>
                    <Button title={"Add Tag"}
                            onPress={this.addTag}/>
                </View>
                <Text style={styles.body}>{JSON.stringify(this.state.tags, undefined, 2)}</Text>

            </View>
        );
    }
}

class PushComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushEnabled: false,
            pushToken: '',
            toggleEnabled: false
        };
        this.togglePush = this.togglePush.bind(this);
    }

    async componentDidMount(): void {
        this.updatePushData();
    }

    togglePush() {
        if (this.state.pushEnabled) {
            MCReactModule.disablePush();
            LoggingComponent.notifyMessage("Push Disabled");
        } else {
            MCReactModule.enablePush();
            LoggingComponent.notifyMessage("Push Enabled");
        }
        this.updatePushData()
    }

    async updatePushData() {
        let enabled = await MCReactModule.isPushEnabled();
        let token = await MCReactModule.getSystemToken();
        this.setState({
            pushEnabled: enabled,
            pushToken: token
        });
    }

    render() {
        return (
            <View style={styles.verticalContainer}>
                <Text style={styles.heading}>Push</Text>
                <Button disabled={this.state.toggleEnabled}
                        title={this.state.pushEnabled ? "Disable Push" : "Enable Push"}
                        onPress={this.togglePush}/>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.smallHeading}>Push Token: </Text>
                    <Text style={styles.body} selectable={true}>{this.state.pushToken}</Text>
                </View>
            </View>
        );
    }
}

class LoggingComponent extends Component {
    constructor(props) {
        super(props);
        LoggingComponent.enableLogging = LoggingComponent.enableLogging.bind(this);
        LoggingComponent.disableLogging = LoggingComponent.disableLogging.bind(this);
        LoggingComponent.printSdkState = LoggingComponent.printSdkState.bind(this);
        LoggingComponent.track = LoggingComponent.track.bind(this);
    }


     static notifyMessage(msg) {
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
          Alert.alert(msg);
        }
      }

    static enableLogging() {
        MCReactModule.enableVerboseLogging();
        LoggingComponent.notifyMessage("Logging Enabled");
    }

    static disableLogging() {
        MCReactModule.disableVerboseLogging();
        LoggingComponent.notifyMessage("Logging Disabled");
    }

    static printSdkState() {
        MCReactModule.logSdkState();
        LoggingComponent.notifyMessage("Check Platform Logs for Output");
    }

    static track() {
        MCReactModule.track("ScreenViewed", { "ScreenName" : "HomeScreen" });
        LoggingComponent.notifyMessage("ScreenViewed Tracked");
    }

    render() {
        return (
            <View style={styles.verticalContainer}>
                <Text style={styles.heading}>Logging</Text>
                <Button title="Enable Logging"
                        onPress={LoggingComponent.enableLogging}/>
                <View height={4}/>
                <Button
                    title="Disable Logging"
                    onPress={LoggingComponent.disableLogging}/>
                <View height={4}/>
                <Button
                    title="Print SdkState"
                    onPress={LoggingComponent.printSdkState}/>
                <View height={4}/>
                <Button
                    title="Track ScreenViewed 4 HomeScreen"
                    onPress={LoggingComponent.track}/>
            </View>
        );
    }
}

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.verticalContainer}>
                    <RegistrationComponent/>
                    <PushComponent/>
                    <LoggingComponent/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    verticalContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 8,
    },
    horizontalContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 8,
    },
    heading: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    smallHeading: {
        fontSize: 20,
        margin: 10,
        marginRight: 4,
    },
    body: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 14,
        marginTop: 10,
        margin: 4,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        height: 40,
        marginBottom: 2,
    }
});
