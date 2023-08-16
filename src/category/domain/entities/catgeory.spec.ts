//compilador de testes: npm i -D @swc/core @swc/jest 
//configurar em jest.config.ts

import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.value-obj"
import Category from "./category"



describe("Category unit tests", () => {
    beforeEach(() => {
        Category.validate = jest.fn()
    })
    it("should test constructor of category", () => {
        const props = {
            name: "C1", 
            description: "D1", 
            is_active: true, 
            created_at: new Date
        }

        let category = new Category({name: props.name})
        expect(Category.validate).toHaveBeenCalled()
        expect(category.props).toStrictEqual({
            name: props.name,
            description: null,
            is_active: true,
            created_at: category.created_at
        })

        category = new Category(props)
        expect(category.props).toStrictEqual(props)
        expect(category.name).toBe('C1')
        expect(category.description).toBe('D1')
        expect(category.is_active).toBe(true)
        expect(category.created_at).toBe(props.created_at)
    })

    it('should test id field', () => {
        let category = new Category({name: 'C1'})
        expect(category.id).not.toBeNull()
        expect(category.uniqueentityId).toBeInstanceOf(UniqueEntityId)
        
        category = new Category({name: 'C1'}, null)
        expect(category.id).not.toBeNull()
        expect(category.uniqueentityId).toBeInstanceOf(UniqueEntityId)
       
        category = new Category({name: 'C1'}, undefined)
        expect(category.id).not.toBeNull()
        expect(category.uniqueentityId).toBeInstanceOf(UniqueEntityId)
        
        category = new Category({name: 'C1'}, new UniqueEntityId())
        expect(category.id).not.toBeNull()
        expect(category.uniqueentityId).toBeInstanceOf(UniqueEntityId)
    })

    it('should test getter and seter description', () => {
        let category = new Category({name: 'C1'})
        expect(category.description).toBeNull()

        category['description'] = "D1"
        expect(category.description).toBe('D1')
    })
    
    it('should test getter and seter is_active', () => {
        let category = new Category({name: 'C1'})
        expect(category.is_active).toBe(true)

        category['is_active'] = false
        expect(category.is_active).toBe(false)
    })

    it('should test activate category', () => {
        let category = new Category({name: 'C1', is_active: false})
        category.active()
        expect(category.is_active).toBeTruthy()
    })
    
    it('should test deactivate category', () => {
        let category = new Category({name: 'C1', is_active: true})
        category.deactive()
        expect(category.is_active).not.toBeTruthy()
    })
    
    it('should update name and description of the category', () => {
        let category = new Category({name: 'C1', description: 'D1'})
        expect(category.name).toBe('C1')
        expect(category.description).toBe('D1')
        
        category.update('new name', 'new description')
        expect(Category.validate).toHaveBeenCalledTimes(2)
        expect(category.name).toBe('new name')
        expect(category.description).toBe('new description')
    })
})