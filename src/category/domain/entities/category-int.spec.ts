import Category from "./category"
import { EntityValidationError } from '../../../@seedwork/domain/errors/validaton-error';


describe('Category integration test', () => {
    describe('create method', () => {
        it('should throw an error when try create a category with invalids name property', () => {
            expect(() => new Category({name: null})).toThrow(new EntityValidationError({
                name: [
                  'name should not be empty',
                  'name must be a string',
                  'name must be shorter than or equal to 255 characters'
                ]
              }))
            expect(() => new Category({name: ""})).toThrow(new EntityValidationError({
                name: [
                  'name should not be empty',
                ]
              }))
            expect(() => new Category({name: 5 as any})).toThrow(new EntityValidationError({
                name: [
                  'name must be a string',
                  'name must be shorter than or equal to 255 characters'
                ]
              }))
            expect(() => new Category({name: "t".repeat(257)})).toThrow(new EntityValidationError({
                name: [
                  'name must be shorter than or equal to 255 characters'
                ]
              }))
        })
        
        it('should throw an error when try create a category with invalids description property', () => {
            expect(() => new Category({name: "value", description: 5 as any})).toThrow(new EntityValidationError({
                description: [
                  'description must be a string',
                ]
              }))
        })
        
        it('should throw an error when try create a category with invalids is_active property', () => {
            expect(() => new Category({name: "value", is_active: "err" as any})).toThrow(new EntityValidationError({
                is_active: [
                  'is_active must be a boolean',
                ]
              }))
        })

        it('should create a valid category', () => {
            expect(() => new Category({name: "value", description: "D1", is_active: true})).not.toThrow()
        })
    })
    
    describe('update method', () => {
        it('should throw an error when try create a category with invalids name property', () => {
            const category = new Category({name: "value"})
            expect(() => category.update(null,"D1")).toThrow(new EntityValidationError({
                name: [
                    'name should not be empty',
                ]
              }))
            expect(() => category.update("","D1")).toThrow(new EntityValidationError({
                name: [
                    'name should not be empty',
                ]
              }))
            expect(() => category.update(5 as any,"D1")).toThrow(new EntityValidationError({
                name: [
                  'name must be a string',
                ]
              }))
            expect(() => category.update("t".repeat(257),"D1")).toThrow(new EntityValidationError({
                name: [
                    'name must be shorter than or equal to 255 characters',
                ]
              }))
        })

        it('should throw an error when try create a category with invalids description property', () => {
            const category = new Category({name: "value"})
            expect(() => category.update("ok", 5 as any)).toThrow(new EntityValidationError({
                description: [
                  'description must be a string',
                ]
              }))
        })

        it('should update a valid category', () => {
            const category =  new Category({name: "value"})
            expect(() => category.update("OK", "OK")).not.toThrow()
        })

    })
})