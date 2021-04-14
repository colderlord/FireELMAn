import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default class About extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <LinearGradient
        colors={["#000000", "#ff0000"]}
        style={css.linearGradient}
      >
        <Text>Наша команда:</Text>
        

      </LinearGradient>
    );
  }
}

const css = StyleSheet.create({
  linearGradient: {
    flex: 1
  }
});