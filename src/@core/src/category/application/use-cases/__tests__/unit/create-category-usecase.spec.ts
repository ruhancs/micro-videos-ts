import {CategoryInMemoryRepository} from "../../../../infra/db/repository/inMemory/category-in-memory.repository"
import {CreateCategoryUseCase} from "../../create-category.usecase"

describe('CreateCategoryUseCase unit test', () => {
    let usecase: CreateCategoryUseCase.CreateCategoryUseCase
    let repository: CategoryInMemoryRepository
    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        usecase = new CreateCategoryUseCase.CreateCategoryUseCase(repository)
    })

    it('should create a category', async() => {
        const spyInsert = jest.spyOn(repository, 'insert')
        let output = await usecase.execute({name: 'test'})

        expect(spyInsert).toHaveBeenCalledTimes(1)
        expect(output).toStrictEqual({
            id: repository.items[0].id,
            name: 'test',
            description: null,
            is_active: true,
            created_at: repository.items[0].created_at
        })
        
        output = await usecase.execute({name: 'test', description: 'D1', is_active: false})
        
        expect(spyInsert).toHaveBeenCalledTimes(2)
        expect(output).toStrictEqual({
            id: repository.items[1].id,
            name: 'test',
            description: 'D1',
            is_active: false,
            created_at: repository.items[1].created_at
        })
    })
})