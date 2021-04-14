import React, { Component } from "react";
import { AppRegistry, View, Modal } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import StartGameChapter from "./app/startGame";
import About from "./app/about";

EStyleSheet.build();

export default class FireELMAn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sceneVisible: false,
      scene: null
    };
  }

  mountScene = scene => {
    this.setState({
      sceneVisible: true,
      scene: scene
    });
  };

  unMountScene = () => {
    this.setState({
      sceneVisible: false,
      scene: null
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TableOfContents
          sceneVisible={this.state.sceneVisible}
          contents={{
            heading: "FireELMAn",
            items: [
              StartGameChapter(this.mountScene),
              {
                heading: "О программе",
                onPress: _ => this.mountScene(<About/>)
              }
            ]
          }}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.sceneVisible}
          onRequestClose={_ => {}}
        >
          {this.state.scene}

          <CloseButton onPress={this.unMountScene} />
        </Modal>
      </View>
    );
  }
}

AppRegistry.registerComponent('FireELMAn', () => FireELMAn);
