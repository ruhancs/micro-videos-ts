import { Chance } from "chance"
import { CategoryFakeBuilder } from "../category-fake-builder"
import { UniqueEntityId } from "#seedwork/domain"

describe('CategoryFakeBuilder unit test', () => {
    const fakeBuilder = CategoryFakeBuilder.aCategory()
    it('should test name prop', () => {
        expect(typeof fakeBuilder['name'] === 'function').toBeTruthy()
        
        const chance = Chance()
        const spyGenerateWord = jest.spyOn(chance, 'word')
        fakeBuilder['chance'] = chance
        fakeBuilder.build()
        expect(spyGenerateWord).toHaveBeenCalled()

        fakeBuilder.withName('N1')
        expect(fakeBuilder['name']).toBe('N1')
        
        fakeBuilder.withName(() => 'N2')
        //@ts-expect-error name is calleble
        expect(fakeBuilder['name']()).toBe('N2')
    })

    it('should test index', () => {
        fakeBuilder.withName((index) => `N-${index}`)
        const category = fakeBuilder.build()
        expect(category.name).toBe(`N-0`)
        
        const fakeMany = CategoryFakeBuilder.theCategories(2)
        fakeMany.withName((index) => `N-${index}`)
        const categories = fakeMany.build()
        expect(categories[0].name).toBe(`N-0`)
        expect(categories[1].name).toBe(`N-1`)
    })

    it('should test invalid props', () => {
        fakeBuilder.withInvalidName(undefined)
        expect(fakeBuilder['name']).toBeUndefined()

        fakeBuilder.withInvalidNameNotString()
        expect(fakeBuilder['name']).toBe(5)

        fakeBuilder.withInvalidDescriptionNotString()
        expect(fakeBuilder['description']).toBe(5)
        
        fakeBuilder.withInvalidIsActiveNotBool()
        expect(fakeBuilder['is_active']).toBe(5)
    })

    it('should create a category', () => {
        const fake = CategoryFakeBuilder.aCategory()
        let category = fake.build()

        expect(category.uniqueentityId).toBeInstanceOf(UniqueEntityId)
        expect(typeof category.name === 'string').toBeTruthy()
        expect(typeof category.description === 'string').toBeTruthy()
        expect(category.is_active).toBeTruthy()
        expect(category.created_at).toBeInstanceOf(Date)

        const created_at = new Date()
        const id = new UniqueEntityId()
        category = fake.withUniqueIdentityId(id)
            .withName('N1')
            .withDescription('D1')
            .deactive()
            .withCreatedAt(created_at)
            .build()
        expect(category.uniqueentityId.value).toBe(id.value)
        expect(category.name).toBe('N1')
        expect(category.description).toBe('D1')
        expect(category.is_active).toBeFalsy()
        expect(category.created_at).toBe(created_at)
    })
    
    it('should create many category', () => {
        const fake = CategoryFakeBuilder.theCategories(2)
        let categories = fake.build()

        categories.forEach((category) => {
            expect(category.uniqueentityId).toBeInstanceOf(UniqueEntityId)
            expect(typeof category.name === 'string').toBeTruthy()
            expect(typeof category.description === 'string').toBeTruthy()
            expect(category.is_active).toBeTruthy()
            expect(category.created_at).toBeInstanceOf(Date)
        })


        const created_at = new Date()
        const id = new UniqueEntityId()
        categories = fake.withUniqueIdentityId(id)
            .withName('N1')
            .withDescription('D1')
            .deactive()
            .withCreatedAt(created_at)
            .build()
        categories.forEach((category) => {
            expect(category.uniqueentityId.value).toBe(id.value)
            expect(category.name).toBe('N1')
            expect(category.description).toBe('D1')
            expect(category.is_active).toBeFalsy()
            expect(category.created_at).toBe(created_at)
        })
    })

})