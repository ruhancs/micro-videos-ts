import Category from "../../../domain/entities/category"
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error"
import {CategoryInMemoryRepository} from "../../../infra/db/repository/inMemory/category-in-memory.repository"
import DeleteCategoryUseCase from "../delete-category-usecase"

describe('GetCategoryUseCase unit test', () => {
    let usecase: DeleteCategoryUseCase.DeleteCategoryUseCase
    let repository: CategoryInMemoryRepository
    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        usecase = new DeleteCategoryUseCase.DeleteCategoryUseCase(repository)
    })

    it('should throw an error when category not found', async() => {
        expect( async() => await usecase.execute({id: 'fake id'})).rejects.toThrow(new NotFoundError(`Entity not found with this id: fake id`))

    })

    it('should get a category', async() => {
        const items = [
            new Category({name: 'N1'})
        ]
        repository.items = items
        const spyGet = jest.spyOn(repository, 'delete')
        let output = await usecase.execute({id: items[0].id})

        expect(spyGet).toHaveBeenCalledTimes(1)
        expect(repository.items).toStrictEqual([])
    })
    
})