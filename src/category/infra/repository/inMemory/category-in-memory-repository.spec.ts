import Category from "../../../domain/entities/category"
import CategoryInMemoryRepository from "./category-in-memory.repository"

describe('CategoryInMemoryRepository unit test', () => {
    let categoryRepository: CategoryInMemoryRepository

    beforeEach(() => {categoryRepository = new CategoryInMemoryRepository()})

    it('should test no filter param', async () => {
        const categories = [
            new Category({name: 'N1'})
        ]

        const spyFilterMethod = jest.spyOn(categories, 'filter' as any)
            
        //inserir categories no repositorio e filtro sera null
        const categoriesFiltered = await categoryRepository['applyFilter'](categories,null)
        expect(categoriesFiltered).toStrictEqual(categories)
        expect(spyFilterMethod).not.toHaveBeenCalled()
    })
    
    it('should test filter param', async () => {
        const category1 = new Category({name: 'N1'})
        const category2 = new Category({name: 'N2'})
        const category3 = new Category({name: 'N2'})
        const categories = [
            category1,
            category2,
            category3
        ]

        const spyFilterMethod = jest.spyOn(categories, 'filter' as any)
            
        //inserir categories no repositorio e filtro sera name
        const categoriesFiltered = await categoryRepository['applyFilter'](categories,'N2')
        
        expect(categoriesFiltered).toStrictEqual([categories[1],categories[2]])
        expect(spyFilterMethod).toHaveBeenCalled()
    })

    it('should test no sort param', async() => {
        const date = new Date()
        const category1 = new Category({name: 'N1', created_at: date})
        const category2 = new Category({name: 'N2', created_at: new Date(date.getTime() + 300)})
        const category3 = new Category({name: 'N2', created_at: new Date(date.getTime() + 100)})
        const categories = [
            category1,
            category2,
            category3
        ]

        let categoriesSorted = await categoryRepository['applySort'](categories,null, null)
        expect(categoriesSorted).toStrictEqual([categories[1], categories[2], categories[0]])
    })
    
    it('should test sort param', async() => {
        const date = new Date()
        const category1 = new Category({name: 'B', created_at: date})
        const category2 = new Category({name: 'C', created_at: new Date(date.getTime() + 300)})
        const category3 = new Category({name: 'A', created_at: new Date(date.getTime() + 100)})
        let categories = [
            category1,
            category2,
            category3
        ]

        let categoriesSorted = await categoryRepository['applySort'](categories,'name', 'asc')
        expect(categoriesSorted).toStrictEqual([categories[2], categories[0], categories[1]])
        
        categoriesSorted = await categoryRepository['applySort'](categories,'name', 'desc')
        expect(categoriesSorted).toStrictEqual([categories[1], categories[0], categories[2]])
    })
})