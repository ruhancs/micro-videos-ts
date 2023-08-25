import { Category } from "#category/domain"
import { CategoryInMemoryRepository } from "#category/infra"
import { NotFoundError } from "#seedwork/domain"
import { UpdateCategoryUseCase } from "../../update-category.usecase"


describe('UpdateCategoryUseCase unit test', () => {
    let usecase: UpdateCategoryUseCase.UpdateCategoryUseCase
    let repository: CategoryInMemoryRepository
    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        usecase = new UpdateCategoryUseCase.UpdateCategoryUseCase(repository)
    })

    it('should throw an error when category id does not exist', async() => {
        expect( async() => await usecase.execute({id: 'fake id',name:'N1'})).rejects.toThrow(new NotFoundError(`Entity not found with this id: fake id`))
    })

    it('should update a category', async() => {
        const spyUpdate = jest.spyOn(repository, 'update')
        const category = new Category({name:'test'})
        repository.items = [category]
        let output = await usecase.execute({id:category.id,name: 'update'})

        expect(spyUpdate).toHaveBeenCalledTimes(1)
        expect(output).toStrictEqual({
            id: category.id,
            name: 'update',
            description: undefined,
            is_active: true,
            created_at: repository.items[0].created_at
        })
        
        output = await usecase.execute({id:category.id,name: 'update', description: 'D1'})

        expect(spyUpdate).toHaveBeenCalledTimes(2)
        expect(output).toStrictEqual({
            id: category.id,
            name: 'update',
            description: 'D1',
            is_active: true,
            created_at: repository.items[0].created_at
        })
        
        output = await usecase.execute({id:category.id,name: 'update', is_active:false})

        expect(output).toStrictEqual({
            id: category.id,
            name: 'update',
            description: undefined,
            is_active: false,
            created_at: repository.items[0].created_at
        })
       
        output = await usecase.execute({id:category.id,name: 'update'})

        expect(output).toStrictEqual({
            id: category.id,
            name: 'update',
            description: undefined,
            is_active: false,
            created_at: repository.items[0].created_at
        })
        
        output = await usecase.execute({id:category.id,name: 'update', description:'D1', is_active: true})

        expect(output).toStrictEqual({
            id: category.id,
            name: 'update',
            description: 'D1',
            is_active: true,
            created_at: repository.items[0].created_at
        })
    })
})