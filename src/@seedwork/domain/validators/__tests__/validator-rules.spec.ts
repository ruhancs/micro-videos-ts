import {ValidationError} from "../../errors/validaton-error"
import ValidatorRules from "../vallidator-rules"

describe('Validator rules unit tests', () => {
    it('should test values method', () => {
        const validator = ValidatorRules.values('value', 'property')
        expect(validator).toBeInstanceOf(ValidatorRules)
        expect(validator['value']).toBe('value')
        expect(validator['property']).toBe('property')
    })
    
    it('should test required validation rule', () => {
        expect(() => ValidatorRules.values(null, 'property').required()).toThrow(new ValidationError(`the property is required`))
        expect(() => ValidatorRules.values(undefined, 'property').required()).toThrow(new ValidationError(`the property is required`))
        expect(() => ValidatorRules.values('', 'property').required()).toThrow(new ValidationError(`the property is required`))
        expect(() => ValidatorRules.values('value', 'property').required()).not.toThrow()
        expect(() => ValidatorRules.values('value', 'property').required()).not.toThrow()
        expect(() => ValidatorRules.values(5, 'property').required()).not.toThrow()
        expect(() => ValidatorRules.values(true, 'property').required()).not.toThrow()
    })
    
    it('should test string validation rule', () => {
        expect(() => ValidatorRules.values(5, 'property').string()).toThrow(new ValidationError(`the property should be a string`))
        expect(() => ValidatorRules.values(null, 'property').string()).not.toThrow(new ValidationError(`the property should be a string`))
        expect(() => ValidatorRules.values('value', 'property').string()).not.toThrow()
    })
   
    it('should test boolean validation rule', () => {
        expect(() => ValidatorRules.values(5, 'property').boolean()).toThrow(new ValidationError(`the property should be a boolean`))
        expect(() => ValidatorRules.values(null, 'property').boolean()).not.toThrow()
        expect(() => ValidatorRules.values(true, 'property').boolean()).not.toThrow()
        expect(() => ValidatorRules.values(false, 'property').boolean()).not.toThrow()
    })
    
    it('should test combine two or more validation rules', () => {
        let validator = ValidatorRules.values(null, 'property')
        expect(() => validator.required().string().boolean()).toThrow(new ValidationError(`the property is required`))
        
        validator = ValidatorRules.values(5, 'property')
        expect(() => validator.required().string()).toThrow(new ValidationError(`the property should be a string`))
        
        expect(() => validator.required().boolean()).toThrow(new ValidationError(`the property should be a boolean`))
        
        validator = ValidatorRules.values("value", 'property')
        expect(() => validator.required().string()).not.toThrow(new ValidationError(`the property should be a boolean`))
        validator = ValidatorRules.values(true, 'property')
        expect(() => validator.required().boolean()).not.toThrow(new ValidationError(`the property should be a boolean`))
    })
})