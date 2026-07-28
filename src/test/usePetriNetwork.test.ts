import { usePetriNetwork } from "./../hooks/usePetriNetwork.ts";
import { dataPetriMatrice } from "./PetriMatrice.data.test.ts";

import dataPetriHistoryTest from "./dataPetriHitory.json"
const result=usePetriNetwork(dataPetriMatrice)
if(!result){
    console.log("Error")
    console.log(result)
}
else{
    if(JSON.stringify(result)==JSON.stringify(dataPetriHistoryTest)){
        console.log("success")
    }else{
        console.error("echec")
        console.log(result)
    }
}