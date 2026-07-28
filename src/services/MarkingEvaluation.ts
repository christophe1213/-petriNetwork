import { add,multiply } from "mathjs";
export class MarkingEvaluation {
    // Private attributes
    private incidenceMatrix: number[][];
    private initialMarking: number[][];
    private transitionSequence: number[][][];
    private result:number[][][] =[]
    // Constructor
    constructor(
        incidenceMatrix: number[][] = [],
        initialMarking: number[][] = [],
        transitionSequence: number[][][] = []
    ) {
        this.incidenceMatrix = incidenceMatrix;
        this.initialMarking = initialMarking;
        this.transitionSequence = transitionSequence;
    }

    // Method
    public execute(): void {
        this.result=[]
        this.transitionSequence.forEach((st)=>{
            const r = add(this.initialMarking , multiply(this.incidenceMatrix,st)) as number[][];
            this.result.push(r)
        })    
    }
    public getResult():number[][][]|undefined{
        return this.result
    }
    
}