import {PrimitiveGene} from '../PrimitiveGene'

import {prng} from '../../..'
import {Sampler} from "../../sampling/Sampler";
import {getSetting} from "../../..";

/**
 * @author Dimitri Stallenberg
 */
export class Ufixed extends PrimitiveGene {
    private bits: number;
    private decimals: number;
    constructor(uniqueId: string, value: number, bits: number, decimals: number) {
        super('unsignedFixed', `ufixed${bits}x${decimals}`, uniqueId, value)
        this.bits = bits
        this.decimals = decimals
    }

    mutate(sampler: Sampler, depth: number) {
        if (prng.nextBoolean(getSetting("resample_gene_chance"))) {
            return sampler.sampleVariable(depth, this.getType())
        }

        if (prng.nextBoolean(getSetting("delta_mutation_chance"))) {
            return this.deltaMutation()
        }

        let bits = Math.min(this.bits, 16) // TODO fix this (something is wrong with the ints and uints as javascript does not support such large numbers (putting stuff in quotes would help maybe)

        let min = 0
        let max = (Math.pow(2, bits) - 1)

        return new Ufixed(this.getId(), parseFloat(prng.nextDouble(min, max).toFixed(this.decimals)), this.bits, this.decimals)

    }

    deltaMutation() {
        // small mutation so maximum of 1024
        let bits = Math.min(this.bits, 10)

        let minChange = -(Math.pow(2, bits) - 1)
        let maxChange = (Math.pow(2, bits) - 1)
        let change = prng.nextDouble(minChange, maxChange)

        let min = 0
        let max = (Math.pow(2, this.bits) - 1)

        return new Ufixed(this.getId(), parseFloat(Math.min(max, Math.max(min, this.value + change)).toFixed(this.decimals)), this.bits, this.decimals)
    }

    copy () {
        return new Ufixed(this.getId(), this.value, this.bits, this.decimals)
    }

    static getRandom (bits=128, decimals=18) {
        bits = Math.min(bits, 16) // TODO fix this (something is wrong with the ints and uints as javascript does not support such large numbers (putting stuff in quotes would help maybe)

        let min = -(Math.pow(2, bits) - 1)
        let max = (Math.pow(2, bits) - 1)

        return new Ufixed(prng.uniqueId(), parseFloat(prng.nextDouble(min, max).toFixed(decimals)), bits, decimals)
    }
}
