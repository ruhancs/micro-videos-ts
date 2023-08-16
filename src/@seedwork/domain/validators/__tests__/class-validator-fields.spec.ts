import { ClassValidatorFields } from "../class-validator-fields";
import * as libClassValidator from 'class-validator'

class StubClassValidatorFields  extends ClassValidatorFields<{field: string}> {

}

describe('ClassValidatorFields unit test', () => {
    it('should initialize errors and validator data variables with null', () => {
        const validator = new StubClassValidatorFields()

        expect(validator.errors).toBeNull()
        expect(validator.validatedData).toBeNull()
    })

    it('should validate errors', () => {
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
        spyValidateSync.mockReturnValue([
            {property: 'field', constraints: {isRequired: 'some error'}}
        ])
        const validator = new StubClassValidatorFields()
        expect(validator.validate(null)).toBe(false)
        expect(spyValidateSync).toHaveBeenCalled()
        expect(validator.errors).toStrictEqual({field: ['some error']})
        expect(validator.validatedData).toBe(null)
    })
    
    it('should validate success case', () => {
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')
        spyValidateSync.mockReturnValue([])
        const validator = new StubClassValidatorFields()
        expect(validator.validate({field: 'value'})).toBe(true)
        expect(spyValidateSync).toHaveBeenCalled()
        expect(validator.validatedData).toStrictEqual({field: 'value'})
        expect(validator.errors).toStrictEqual(null)
    })
})