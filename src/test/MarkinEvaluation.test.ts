import { MarkingEvaluation } from "./../services/MarkingEvaluation.ts";
import { equal } from "mathjs";

const incidenceMatrix=[
    [-1,0,0,0,0,1],
    [1,-1,0,0,0,0],
    [0,1,-1,0,0,-1],
    [0,1,0,-1,0,0],
    [0,0,1,0,-1,0],
    [0,0,0,1,-1,0],
    [0,0,0,0,1,-1],
        
 
];
const initialMarking=[
    [1],
    [0],
    [1],
    [0],
    [0],
    [2],
    [0]

]
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

const resulta_attendu=[
    [
        [0],
        [1],
        [1],
        [0],
        [0],
        [2],
        [0]
    ],
    [
        [0],
        [0],
        [2],
        [1],
        [0],
        [2],
        [0]
    ],
    [
        [0],
        [0],
        [1],
        [1],
        [1],
        [2],
        [0]
    ],
    [
        [0],
        [0],
        [0],
        [1],
        [2],
        [2],
        [0]
    ],
    [
        [0],
        [0],
        [0],
        [0],
        [2],
        [3],
        [0]
    ],
    [
        [0],
        [0],
        [0],
        [0],
        [1],
        [2],
        [1]
    ],
     [
        [0],
        [0],
        [0],
        [0],
        [0],
        [1],
        [2]
    ]
]
const markinEvaluation= new MarkingEvaluation(incidenceMatrix,initialMarking,transitionSequence)
markinEvaluation.execute()
const result=markinEvaluation.getResult()

if(!result){
    console.log("Error")
    console.log(result)
}
else{
    if(equal(result,resulta_attendu)){
        console.log("success")
    }else{
        console.error("echec")
        console.log(result)
    }
}
    

// console.log("test")