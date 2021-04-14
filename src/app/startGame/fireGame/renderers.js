import React, { Component } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Bonus1, Bonus2, Bonus3, Bonus4, Bonus5 } from "./Bonuses"

import flame1 from "./images/flame1.png";
import flame2 from "./images/flame2.png";
import flame3 from "./images/flame3.png";
import flame4 from "./images/flame4.png";
import flame5 from "./images/flame5.png";
import flame6 from "./images/flame6.png";
import flame12 from "./images/flame12.png";
import flame22 from "./images/flame22.png";
import flame32 from "./images/flame32.png";
import flame42 from "./images/flame42.png";
import flame52 from "./images/flame52.png";
import flame62 from "./images/flame62.png";
import flamepoison from "./images/flamepoison.png";
import water from "./images/water.png";
import gameoverimg from "./images/fine.jpg";

class Flame extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount () {
    this.animate()
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  getFlame() {
    const { flameRate, flamelvl } = this.props;
    if (flamelvl == 3) {
      return flamepoison;
    }
    switch(flameRate) {
      case 1:
        return flamelvl == 1 ? flame1 : flame12;
      case 2:
        return flamelvl == 1 ? flame2 : flame22;
      case 3:
        return flamelvl == 1 ? flame3 : flame32;
      case 4:
        return flamelvl == 1 ? flame4 : flame42;
      case 5:
        return flamelvl == 1 ? flame5 : flame52;
      case 6:
        return flamelvl == 1 ? flame6 : flame62;
    }
    return flame1;
  }

  render() {
    const width = this.props.flameSize;
    const height = this.props.flameSize;
    const x = this.props.posX;
    const y = this.props.posY;
    const movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 5, 0]
    })
    return (
			<View
				style={
					{
						position: "absolute",
						left: x,
						top: y,
						width: width,
						height: height
					}
				}
			>
      <Animated.Image style={{
          marginLeft: movingMargin,
          width: width,
          height: height
        }} source={this.getFlame()} />
      </View>
    );
  }
}

class Score extends Component {
  constructor(props) {
    super(props);
  }

  render() {
		const {sum, size} = this.props;
		const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
		const y = this.props.body.position.y;
    return (
			<View
        style={
          {
            position: "absolute",
            top: 0,
						height: height,
          }
        }
      >
        <Text style={{ color: "white" }}>
          Счет: {sum}
        </Text>
			</View>
    );
  }
}

class Bonuses extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {sum, size, body} = this.props;
		const width = size[0];
    const height = size[1];
    const x = body.position.x - width / 2;
    const y = body.position.y - height;
    const bonusH = height/1.5;
    return (
			<View
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
						height: height
          }
        }
      >
        <View style={{
            alignContent: "center",
            alignItems: "center"
          }}>
            <Text style={{ color: "white" }}>
              Счет бонусов: {sum}
            </Text>
        </View>
        <View style={{
            position:"relative",
            alignContent: "center",
            alignItems: "center"
          }}>
          <Bonus key="bonus1" type={Bonus1} height={bonusH} isActive={sum >= Bonus1.cost} position={0}/>
          <Bonus key="bonus2" type={Bonus2} height={bonusH} isActive={sum >= Bonus2.cost} position={1}/>
          <Bonus key="bonus3" type={Bonus3} height={bonusH} isActive={sum >= Bonus3.cost} position={2}/>
          <Bonus key="bonus4" type={Bonus4} height={bonusH} isActive={sum >= Bonus4.cost} position={3}/>
          <Bonus key="bonus5" type={Bonus5} height={bonusH} isActive={sum >= Bonus5.cost} position={4}/>
        </View>
			</View>
    );
  }
}

class Bonus extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {height, position, isActive, type } = this.props;

    const op = isActive ? 1 : 0.3;

    return (
			<View
        style={
          {
            position: "absolute",
            left: position * height * 1.5
          }
        }
      >
        <Image style={{
          width: height,
          height: height,
          opacity: op
        }} source={type.imgSrc} />
			</View>
    );
  }
}

class GameOver extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { gameOver } = this.props;
    if (gameOver) {
      return (
        <View style={{ zIndex: 99999, position: "relative", top: 40 }}>
          <Image source={gameoverimg} />
        </View>
      );
    } else {
      return null;
    }
  }
}

class Water extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount () {
    this.animate()
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  render() {
    const width = this.props.flameSize;
    const height = this.props.flameSize;
    const x = this.props.posX;
    const y = this.props.posY;
    const movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 5, 0]
    })
    return (
			<View
				style={
					{
						position: "absolute",
						left: x,
						top: y,
						width: width,
						height: height
					}
				}
			>
      <Animated.Image style={{
          marginLeft: movingMargin,
          width: width,
          height: height
        }} source={water} />
      </View>
    );
  }
}

const css = EStyleSheet.create({
  $borderHeight: "0.5%",
  $fontHeight: "5%",
  $lineHeight: "5%",
  $letterSpacingWidth: "1.3%",
  text: {
    backgroundColor: "transparent",
    letterSpacing: "$letterSpacingWidth",
    color: "#FFF",
    fontSize: "$fontHeight",
    lineHeight: "$lineHeight",
    fontWeight: "bold"
  }
});

export {
	Flame,
	Score,
  Bonuses,
  GameOver,
  Water
};
