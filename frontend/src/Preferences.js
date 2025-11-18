import { useState } from 'react';
import Selector from './Selector.js';

export default function Preferences({ setCuisines, setAppliances}) {

	return (
		<>
			<h2>Select cuisines:</h2>
			<Selector setCuisines = {setCuisines} options={["American", "Italian", "Chinese", "Mexican", "Indian"]}/>

			<h2>Select appliances:</h2>
			<Selector setAppliances = {setAppliances} options={["Oven", "Air Fryer", "Stove", "Blender", "Kettle"]}/>
		</>
	);
}