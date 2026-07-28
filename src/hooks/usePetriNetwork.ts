import type { PetriExport } from "@/hooks/type";
import { CreatePetriGraphHistory } from "@/services/CreateGraphHistory";
import { MarkingEvaluation } from "@/services/MarkingEvaluation";
import { PetriMatrices } from "@/services/PetriMatrices";


export function usePetriNetwork(data:PetriExport|null):PetriExport[]|undefined{
    if(!data){
        console.log("data ",data)
        return
    }
    const petriMatrices=new PetriMatrices(data)
    const initialMarking=petriMatrices.getinitialMarking()
    const incidenceMatrice=petriMatrices.getIncidence()
    const transSequence=petriMatrices.getTransitionSequence()
    console.log(transSequence)
    const markingEvaluation=new MarkingEvaluation(incidenceMatrice,initialMarking,transSequence)
    markingEvaluation.execute()
    const result =markingEvaluation.getResult()
    console.log(result)
    if(!result) return
    const createGraphHistory=new CreatePetriGraphHistory(
            data,
            result,
            petriMatrices.getPlaceId()
        )
    const histories=createGraphHistory.build()
    return histories

}