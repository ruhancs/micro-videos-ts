import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from "./category.validator"

describe('Category validator tests', () => {
    let validator: CategoryValidator
    beforeEach(() => validator = CategoryValidatorFactory.create())
    it('should test invalidate case for name field',() => {
        let isValid = validator.validate(null)

        expect(isValid).toBeFalsy()
        expect(validator.errors['name']).toStrictEqual([
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
        ])
        
        isValid = validator.validate({name: ''})

        expect(isValid).toBeFalsy()
        expect(validator.errors['name']).toStrictEqual([
            'name should not be empty',
        ])
        
        isValid = validator.validate({name: 'r'.repeat(256)})

        expect(isValid).toBeFalsy()
        expect(validator.errors['name']).toStrictEqual([
            'name must be shorter than or equal to 255 characters',
        ])
       
        isValid = validator.validate({name: 5 as any})

        expect(isValid).toBeFalsy()
        expect(validator.errors['name']).toStrictEqual([
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
        ])
    })

    it('should test valid cases for fields', () => {
        const arrange = [
            {name: 'N1'},
            {name: 'N1', description: 'D1'},
            {name: 'N1', description: undefined},
            {name: 'N1', description: null},
            {name: 'N1', is_active: true},
            {name: 'N1', is_active: false}
        ]

        arrange.forEach((item) => {
            const isValid = validator.validate(item)
            expect(isValid).toBeTruthy()
            expect(validator.validatedData).toStrictEqual(new CategoryRules(item))
        })
    })
})