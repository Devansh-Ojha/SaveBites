import { useState } from 'react';
import Selector from './Selector.js';

export default function Preferences({ timeState, difficultyState, budgetState, setCuisines, setAppliances, setAllergens }) {

	return (
		<div style={{display: "flex"}}>
			<span style={{position: "relative", left: "50px"}}>
				<div style={{position: "relative", top: "20px"}} className="login-form-box">
					<h2>Select cuisines:</h2>
					<Selector setState={setCuisines} options={["American", "Italian", "Chinese", "Mexican", "Indian"]}/>
				</div>

				<div style={{position: "relative", top: "40px"}} className="login-form-box">
				<h2>Select appliances:</h2>
				<Selector setState={setAppliances} options={["Oven", "Air Fryer", "Stove", "Blender", "Kettle"]}/>
				</div>

				<div style={{position: "relative", top: "60px"}} className="login-form-box">
				<h2>Select allergens:</h2>
				<Selector setState={setAllergens} options={["Milk", "Egg", "Peanut", "Soy", "Gluten", "Fish", "Wheat"]}/>
				</div>
			</span>

			<div className="login-form-box" style={{position: "relative", left: "200px", top: "20px", minHeight: 0, height: "300px"}}>
				<h2>Set preferred budget:</h2>
				<label>
					<input type="range" defaultValue={budgetState[0]} onChange={e => budgetState[1](e.target.value)}></input> ${budgetState[0]}
				</label>

				<h2>Select difficulty:</h2>
				<select value={difficultyState[0]} onChange={e => difficultyState[1](e.target.value)}>
					<option>Beginner</option>
					<option>Intermediate</option>
					<option>Advanced</option>
				</select>

				<h2>Set time limit:</h2>
				<label>
					<input type="range" min="0" max="300" defaultValue={timeState[0]} onChange={e => timeState[1](e.target.value)}></input> {Math.floor(timeState[0] / 60)} {Math.floor(timeState[0] / 60) == 1 ? "hour" : "hours"} and {timeState[0] % 60} {timeState[0] % 60 == 1 ? "minute" : "minutes"}
				</label>
			</div>

			<p style={{height: "50px"}}></p>
		</div>
	);
}