import { CastMemberType } from "../entities/cast-member"
import { CastMemberValidator, CastMemberValidatorFactory } from "./cast-member.validator"

describe('Cast Member validator unit test', () => {
    let validator: CastMemberValidator
    beforeEach(() => {
        validator = CastMemberValidatorFactory.create()
    })

    it('should test invalid case for name', () => {
        const arrange = [
            {
                input: {name:null,type:1},
                output: [
                    'name should not be empty',
                    'name must be a string',
                    'name must be shorter than or equal to 255 characters'
                  ]
            },
            {
                input: {name:2 as any,type:CastMemberType.ACTOR},
                output: [
                    'name must be a string',
                    'name must be shorter than or equal to 255 characters'
                  ]
            },
            {
                input: {name:'c'.repeat(256),type:CastMemberType.ACTOR},
                output: [
                    'name must be shorter than or equal to 255 characters'
                  ]
            },
        ]

        for(const item of arrange) {
            let isValid = validator.validate(item.input)

            expect(isValid).toBeFalsy()
            expect(validator.errors['name']).toStrictEqual(item.output)
        }

    })
    it('should test invalid case for type', () => {
        const arrange = [
            {
                input: {name:'N1',type:null},
                output: [
                    'type should not be empty',
                    //'type must be one of the following values: 1, 2'
                  ]
            },
            //{
              //  input: {name:'N1',type:5},
                //output: [
                  //  'type must be one of the following values: 1, 2'
                  //]
            //},
            //{
              //  input: {name:'N1',type:'TEST' as any},
                //output: [
                  //  'type must be one of the following values: 1, 2'
                  //]
            //},
        ]

        for(const item of arrange) {
            let isValid = validator.validate(item.input)

            //expect(isValid).toBeFalsy()
            expect(validator.errors['type']).toStrictEqual(item.output)
        }

    })
    it('should test valid case for name and type', () => {
        const arrange = [
            {
                input: {name:'N1',type:CastMemberType.ACTOR},
            },
            {
                input: {name:'N1',type:CastMemberType.DIRECTOR},
            },
        ]

        for(const item of arrange) {
            let isValid = validator.validate(item.input)

            expect(isValid).toBeTruthy()
        }

    })
})