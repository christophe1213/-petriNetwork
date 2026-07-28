import { CreatePetriGraphHistory } from "./../services/CreateGraphHistory";
import { PetriMatrices } from "./../services/PetriMatrices.ts";
import { dataPetriMatrice } from "./PetriMatrice.data.test.ts";
import { MarkingEvaluation } from "./../services/MarkingEvaluation.ts";
import dataPetriHistoryTest from "./dataPetriHitory.json"
const petrieMatrices=new PetriMatrices(dataPetriMatrice)
const transition=petrieMatrices.getTransitionSequence()
 const initialMarking=petrieMatrices.getinitialMarking()
    const incidenceMatrice=petrieMatrices.getIncidence()
    
    const markinEvaluation= new MarkingEvaluation(incidenceMatrice,initialMarking,transition)
    markinEvaluation.execute()
    const result =markinEvaluation.getResult()
if (!result)console.error("❌error:transition undifined")
else{
   

        
    const createGraphHistory=new CreatePetriGraphHistory(
        dataPetriMatrice,
        result,
        petrieMatrices.getPlaceId()
    )
    const histories=createGraphHistory.build()
    if(JSON.stringify(dataPetriHistoryTest)==JSON.stringify(histories)){
        console.log("✅test histories réussi")
    }else{
          console.log("❌echec")
           if(histories.length!=dataPetriHistoryTest.length){
            console.log("nombre d'élément different")
           }
           else {
            let i=0
            for( i=0;i<(dataPetriHistoryTest.length<histories.length?dataPetriHistoryTest.length:histories.length);i++){
                if(JSON.stringify(dataPetriHistoryTest[i])!==JSON.stringify(histories[i])){
                    console.log("error sur ",i)
                    if(dataPetriHistoryTest[i].places.length!=histories[i].places.length){
                        console.log("nombre de places sont different")
                        console.log("places données,taille",dataPetriHistoryTest[i].places.length)
                        console.log(JSON.stringify(dataPetriHistoryTest[i].places))
                        console.log("places de donnés générér",histories[i].places.length)
                        console.log(JSON.stringify(histories[i].places))
                        break
                    }else
                    for(let j=0;j<histories[i].places.length;j++){
                        if(JSON.stringify(histories[i].places[j].label)!==JSON.stringify(dataPetriHistoryTest[i].places[j].label)){
                            console.log("label sont différent")
                            console.log((histories[i].places[j].label))
                            console.log(dataPetriHistoryTest[i].places[j].label)
                            break
                        }else{
                            if(JSON.stringify(histories[i].places[j].tokens)!==JSON.stringify(dataPetriHistoryTest[i].places[j].tokens)){
                                
                                console.log("il y d'erreur sur graph ",i,"place:",j) 
                                console.log("tokens sont différent")
                                console.log("histories: "+JSON.stringify(histories[i].places[j]))
                                console.log("data",JSON.stringify(dataPetriHistoryTest[i].places[j]))  
                                // const sequence=petriceMatrice.getTransitionSequence()
                                // console.log("séquence de transition")
                                // if(sequence)console.log(sequence[j])
                                break  
                            }else{
                                 console.log("pas d'erreur sur graph ",i,"place:",j)
                            }
                            
                            }
                    }
                    break
                }
            }
            }
            

    }   
    }

