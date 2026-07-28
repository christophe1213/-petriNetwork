import { PetriMatrices } from "./../services/PetriMatrices.ts";
import { dataPetriMatrice } from "./PetriMatrice.data.test.ts";
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
const petriceMatrice=new PetriMatrices(dataPetriMatrice)
const result=petriceMatrice.getIncidence()
const initMarkingTest=petriceMatrice.getinitialMarking()
if(!initMarkingTest)console.log("❌error"+initMarkingTest)
else{
    if(equal(initialMarking,initMarkingTest)){
        console.log("✅test marquage initial reussi")
    }else{
        console.error("❌test marquage initial echec")
        console.log(initMarkingTest)
    }
}   
if(equal(result,incidenceMatrix)){
    console.log("✅test matrice d'incidence réussi")

}else{
    console.error("❌echec")
}


