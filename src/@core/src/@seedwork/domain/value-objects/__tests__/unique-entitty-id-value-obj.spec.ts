import InvalidUUIDError from "../../errors/invalid-uuid-.error"
import UniqueEntityId from "../unique-entity-id.value-obj"
import {validate as uuidValidate} from 'uuid'

//deve ser configurado no jest.config: clearMocks: true
function spyValidateMethod() {
    return jest.spyOn(UniqueEntityId.prototype as any, 'validate')
}

describe('UniqueEntityId unit test', () => {
    //beforeEach(() => {
    //    jest.clearAllMocks();
    //})
    
    it('should throw an error when uuid is invalid', () => {
        const validateSpy = spyValidateMethod()
        expect(() => new UniqueEntityId('invalidvalue')).toThrow(new InvalidUUIDError())
        expect(validateSpy).toHaveBeenCalled()
    })
    
    it('should create a new id with the provided uuid value', () => {
        const id = new UniqueEntityId('77349e57-d8cf-47cf-991e-8f1b62efad1b')
        const validateSpy = spyValidateMethod()
        expect(id.value).toBe('77349e57-d8cf-47cf-991e-8f1b62efad1b')
        expect(validateSpy).toHaveBeenCalled()
    })
    
    it('should create a new id', () => {
        const id = new UniqueEntityId()
        const validateSpy = spyValidateMethod()
        expect(uuidValidate(id.value)).toBeTruthy()
        expect(validateSpy).toHaveBeenCalled()
    })
})