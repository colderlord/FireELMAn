import React from "react";
import FireGame from "./fireGame";

export default function (mount) {
	return {
		heading: "Начать игру",
    	items: [
			{
				heading: "Легко",
				onPress: _ => mount(<FireGame key={"game"} difficulty={"easy"}/>)
			},
			{
				heading: "Нормально",
				onPress: _ => mount(<FireGame key={"game"} difficulty={"normal"}/>)
			},
			{
				heading: "Сложно",
				onPress: _ => mount(<FireGame key={"game"} difficulty={"hard"}/>)
			}
		]
	}
}

