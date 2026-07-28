import type { PetriExport } from "@/hooks/type";

export class CreatePetriGraphHistory{

    private graph:PetriExport
    private  transitionSequence:number[][][]
    private placeIds: string[];
    constructor(g:PetriExport,transSequence:number[][][],placeId:string[]){
        this.graph=g
        this.transitionSequence=transSequence
        this.placeIds =placeId
        
    }

    public build():PetriExport[]{
        const histories:PetriExport[]=[this.graph]
        this.transitionSequence.forEach(sequenceItem=>{
            histories.push(this.createPetriGraphItem(sequenceItem))
        })
        return histories
    }
    private createPetriGraphItem(sequenceItem:number[][]):PetriExport{
        const g=structuredClone(this.graph)
        const places:Array<{
            id: string;
            label: string;
            tokens: number;
            position: { x: number; y: number };
        }>=[]
        sequenceItem.forEach((s,i)=>{
            const placeId=this.placeIds[i]
            const p= g.places.find(p=>p.id==placeId)
            if(!p){
                return
            }
            p.tokens=s[0]
            places.push(p)
        })
        // console.log("places construis:",JSON.stringify(places))
        const graph={...g,places}
        return graph
    }
    
}