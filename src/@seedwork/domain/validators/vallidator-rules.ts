import {ValidationError} from "../errors/validaton-error"

export default class ValidatorRules{
    private constructor(private value: any, private property: string) {}

    static values(value: any, property: string) {
        return new ValidatorRules(value, property)
    }

    required(): Omit<this, 'required'>{
        //(!this.value)
        if(this.value === null || this.value === undefined || this.value === ''){
            throw new ValidationError(`the ${this.property} is required`)
        }
        return this
    }
    
    string(): Omit<this, 'string'> {
        if(!isEmpty(this.value) && typeof this.value !== 'string') {
            throw new ValidationError(`the ${this.property} should be a string`)
        }
        return this
    }
    
    boolean(): Omit<this, 'boolean'> {
        if(!isEmpty(this.value) && typeof this.value !== 'boolean') {
            throw new ValidationError(`the ${this.property} should be a boolean`)
        }
        return this
    }
    
    maxLength(max: number): Omit<this, 'maxLength'> {
        if(!isEmpty(this.value) && this.value.length > max){
            throw new ValidationError(`the ${this.property} should be a less or equal than ${max}`)
        }
        return this
    }
}

export function isEmpty(value: any) {
    return value === undefined || value === null
}