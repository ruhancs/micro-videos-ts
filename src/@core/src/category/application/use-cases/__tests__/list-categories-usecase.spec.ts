import ListCategoriesUseCase from "../list-categories.usecase"
import {CategoryInMemoryRepository} from "../../../infra/repository/inMemory/category-in-memory.repository"
import Category from "../../../domain/entities/category"
import { CategorySearchResult } from "../../../domain/repository/category.repository"

describe('ListCategoriesUseCase unit test', () => {
    let usecase: ListCategoriesUseCase.ListCategoriesUseCase
    let repository: CategoryInMemoryRepository
    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        usecase = new ListCategoriesUseCase.ListCategoriesUseCase(repository)
    })
    it('should test toOutput method', () => {
        let result = new CategorySearchResult({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null
        })
        let output = usecase['toOutput'](result)
        expect(output).toStrictEqual({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1
        }) 
        const category = new Category({name: 'movie'})
        result = new CategorySearchResult({
            items: [category],
            total: 1,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null
        })
        output = usecase['toOutput'](result)
        expect(output).toStrictEqual({
            items: [category.toJSON()],
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1
        }) 
    })

    it('should returns output categories ordered by created_at desc',async () => {
        const created_at = new Date()
        const items = [
            new Category({name: 'N1', created_at: new Date(created_at.getTime() + 200)}),
            new Category({name: 'N2', created_at: created_at})
        ]
        repository.items = items
        const output = await usecase.execute({})
        expect(output).toStrictEqual({
            items: [...items].map((i) => i.toJSON()),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1
        })
    })

    it('should return output using pagination, sort and filter', async() => {
        const created_at = new Date()
        const items = [
            new Category({name: 'b'}),
            new Category({name: 'c'}),
            new Category({name: 'a'}),
            new Category({name: 'Aa'}),
            new Category({name: 'AA'}),
            new Category({name: 'd'}),
        ]
        repository.items = items
        let output = await usecase.execute({page:1,per_page:2,sort:'name',filter:'a'})
        expect(output).toStrictEqual({
            items: [items[4].toJSON(), items[3].toJSON()],
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2
        })
        
        output = await usecase.execute({page:2,per_page:2,sort:'name',filter:'a'})
        expect(output).toStrictEqual({
            items: [items[2].toJSON()],
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2
        })
        
        output = await usecase.execute({page:1,per_page:2,sort:'name',sort_dir:'desc',filter:'a'})
        expect(output).toStrictEqual({
            items: [items[2].toJSON(), items[3].toJSON()],
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2
        })
    })
})