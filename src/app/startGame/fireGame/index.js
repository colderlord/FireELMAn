import React, { Component } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import LinearGradient from "react-native-linear-gradient";
import Matter from "matter-js";
import { Score, Bonuses, GameOver } from "./renderers";
import { CreateFireTimer, PutOutFire, PutBonus, TimerFunc, Init, GameOverFunc } from "./systems";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

export default class FireGame extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    Init(this.props.difficulty);
    TimerFunc();
  }

  render() {
    const { width, height } = Dimensions.get("window");
    const flameSize = Math.trunc(Math.max(width, height) * 0.075);

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const body = Matter.Bodies.rectangle(width / 2, -1000, flameSize, flameSize, { frictionAir: 0.021 });
    const score = Matter.Bodies.rectangle(width / 2, flameSize / 3 , width / 2, flameSize / 3, { isStatic: true });
    const bonuses = Matter.Bodies.rectangle(width / 2, height - flameSize / 2 , width, flameSize, { isStatic: true });

    Matter.World.add(world, [body, score, bonuses]);

    return (
      <LinearGradient
        colors={["#000000", "#ff0000"]}
        style={css.linearGradient}
      >
        <GameEngine
          systems={[CreateFireTimer, PutOutFire, PutBonus, GameOverFunc]}
          entities={{
            gameOver: { window: [ width, height ], gameOver: false, renderer: GameOver },
            physics: { engine: engine, world: world, difficulty: this.props.difficulty },
            score: { body: score, size: [width / 2, flameSize / 3], sum: 0, renderer: Score },
            bonus: { body: bonuses, size: [width, flameSize * 1.5], sum: 0, renderer: Bonuses }
          }}
        >
          <StatusBar hidden={true} />
        </GameEngine>
      </LinearGradient>
    );
  }
}

const css = StyleSheet.create({
  linearGradient: {
    flex: 1
  }
});
