import { GetCategoryUseCase } from "#category/application"
import { Category } from "#category/domain"
import { CategoryInMemoryRepository } from "#category/infra"
import { NotFoundError } from "#seedwork/domain"


describe('GetCategoryUseCase unit test', () => {
    let usecase: GetCategoryUseCase.GetCategoryUseCase
    let repository: CategoryInMemoryRepository
    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        usecase = new GetCategoryUseCase.GetCategoryUseCase(repository)
    })

    it('should throw an error when category not found', async() => {
        expect( async() => await usecase.execute({id: 'fake id'})).rejects.toThrow(new NotFoundError(`Entity not found with this id: fake id`))

    })

    it('should get a category', async() => {
        const items = [
            new Category({name: 'N1'})
        ]
        repository.items = items
        const spyGet = jest.spyOn(repository, 'findById')
        let output = await usecase.execute({id: items[0].id})

        expect(spyGet).toHaveBeenCalledTimes(1)
        expect(output).toStrictEqual({
            id: repository.items[0].id,
            name: 'N1',
            description: null,
            is_active: true,
            created_at: repository.items[0].created_at
        })
    })
    
})