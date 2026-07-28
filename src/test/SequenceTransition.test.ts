
import data from './dataPetri.test.json'  with { type: "json" };
import { PetriMatrices } from "./../services/PetriMatrices.ts";
import { equal } from 'mathjs';


const transitionSequence=[
    [
        [1],
        [0],
        [0],
        [0],
        [0],
        [0],

    
    ],
    [
        [1],
        [1],
        [0],
        [0],
        [0],
        [0],
  
    
    ],
    [
        [1],
        [1],
        [1],
        [0],
        [0],
        [0],

    
    ],
    [
        [1],
        [1],
        [2],
        [0],
        [0],
        [0],
     
    
    ],
    [
   
        [1],
        [1],
        [2],
        [1],
        [0],
        [0]
    
    ],
    [
        [1],
        [1],
        [2],
        [1],
        [1],
        [0],
    ],
    [
        [1],
        [1],
        [2],
        [1],
        [2],
        [0],
    ],
]
const matrices = new PetriMatrices(data);
const transition=matrices.getTransitionSequence()
if (!transition)console.error("❌error:transition undifined")
else if(equal(transition,transitionSequence)){
    console.log("✅test sequence succusseffuly")
}else{
    console.log("❌error")
    console.log(transition)
}

