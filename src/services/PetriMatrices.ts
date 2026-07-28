import type { PetriExport } from '@/hooks/type';
import { subtract } from 'mathjs';


/**
 * Calcule et expose les matrices PRE, POST et d'incidence d'un réseau
 * de Petri à partir de son export { places, transitions, arcs }.
 *
 * Un arc peut aller dans les deux sens (place->transition ou
 * transition->place) : la classe détermine le sens à partir des ids
 * source/target, pas besoin de le préciser. Si deux arcs relient la
 * même paire place/transition dans le même sens, leur poids s'additionne.
 */
export class PetriMatrices {
  readonly placeIds: string[];
  readonly transitionIds: string[];

  private readonly pre: number[][];
  private readonly post: number[][];
  private readonly incidence: number[][];
  private readonly graph:PetriExport|undefined
  private initialMarking:number[][]|undefined

  constructor(graph: PetriExport) {
    this.placeIds = graph.places.map((p) => p.id);
    this.transitionIds = graph.transitions.map((t) => t.id);
    this.graph=graph
    this.pre = this.zeroMatrix();
    this.post = this.zeroMatrix();

    const placeIndex = new Map(this.placeIds.map((id, i) => [id, i]));
    const transitionIndex = new Map(this.transitionIds.map((id, i) => [id, i]));

    for (const arc of graph.arcs) {
      const sourceAsPlace = placeIndex.get(arc.source);
      const targetAsTransition = transitionIndex.get(arc.target);
      if (sourceAsPlace !== undefined && targetAsTransition !== undefined) {
        // place -> transition : la transition consomme un jeton de cette place
        this.pre[sourceAsPlace][targetAsTransition] += arc.weight;
        continue;
      }

      const sourceAsTransition = transitionIndex.get(arc.source);
      const targetAsPlace = placeIndex.get(arc.target);
      if (sourceAsTransition !== undefined && targetAsPlace !== undefined) {
        // transition -> place : la transition produit un jeton dans cette place
        this.post[targetAsPlace][sourceAsTransition] += arc.weight;
      }
      // sinon : arc invalide (place->place ou transition->transition), ignoré
    }

    this.incidence = subtract(this.post,this.pre)
    this.getinitialMarking()
  }

  private zeroMatrix(): number[][] {
    return this.placeIds.map(() => this.transitionIds.map(() => 0));
  }

  /** Pre[i][j] = poids de l'arc place_i -> transition_j (consommation) */
  getPlaceId():string[]{
    return this.placeIds
  }
  getPre(): number[][] {
    return this.pre;
  }

  /** Post[i][j] = poids de l'arc transition_j -> place_i (production) */
  getPost(): number[][] {
    return this.post;
  }

  /** Incidence[i][j] = Post[i][j] - Pre[i][j] */
  getIncidence(): number[][] {
    return this.incidence;
  }
  getinitialMarking():number[][]|undefined{
    if(this.initialMarking) return this.initialMarking
    if(!this.graph)return
    const result: number[][] =[]
    this.graph.places.forEach(p=>{
      const t=[p.tokens]
      result.push(t)
    })
    this.initialMarking=result
    return result
  }
 
  
  isEnabled(marking: number[][], transitionIndex: number): boolean {
    // console.log( this.placeIds.every((_, i) => marking[i][0] >= this.pre[i][transitionIndex]))
    return this.placeIds.every((_, i) => marking[i][0] >= this.pre[i][transitionIndex]);
  }
 
  /** Retourne le marquage obtenu après franchissement de transitionIndex (ne vérifie pas isEnabled). */
  private fire(marking: number[][], transitionIndex: number): number[][] {
    const sequence:number[][]=[]
    marking.forEach((m,i)=>{
      sequence.push([m[0]+this.incidence[i][transitionIndex]])
    })
    return sequence
    // return marking.map((m, i) => m + this.incidence[i][transitionInd ex]);
  }
  getTransitionSequence(maxSteps = 100):number[][][]|undefined{
    const sequence :number[][][]=[]
    if(!this.initialMarking)return
    let marking=[...this.initialMarking]   
    let sequenceItem=this.initSequenceItem()
    
    for (let step = 0; step < maxSteps; step++){
      const nextIndex = this.transitionIds.findIndex((_, j) => {
        const r=!(this.isSource(this.transitionIds[j]))&&this.isEnabled(marking, j)
        return r
      });
      console.log(nextIndex)
      if (nextIndex === -1) break;
      if(!this.isSource(this.transitionIds[nextIndex])){

      }
      marking=this.fire(marking,nextIndex)
      sequenceItem[nextIndex][0]+=1
      const item=structuredClone(sequenceItem)
      sequence.push(item)
    }
    return sequence
  }
   
  private initSequenceItem():number[][]{
    const x = this.transitionIds.length;
    const y = 1;
    const t: number[][] = Array.from({ length: x }, () => Array(y).fill(0));
    return t;
  }

  private isSource(transition:string):boolean|undefined{
    const a=this.graph?.arcs.every(a=>a.target!==transition)
    return a
  }
}
