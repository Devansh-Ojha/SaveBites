import { useState } from 'react';
import Selector from './Selector.js';

export default function Preferences({ setCuisines, setAppliances}) {

	return (
		<div style={{position: "relative", left: "50px"}}>
			<h2>Select cuisines:</h2>
			<Selector setState={setCuisines} options={["American", "Italian", "Chinese", "Mexican", "Indian"]}/>

			<h2>Select appliances:</h2>
			<Selector setState={setAppliances} options={["Oven", "Air Fryer", "Stove", "Blender", "Kettle"]}/>
		</div>
	);
}