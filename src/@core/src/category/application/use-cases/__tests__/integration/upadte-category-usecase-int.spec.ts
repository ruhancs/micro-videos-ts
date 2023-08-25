import { CategorySequelize } from "#category/infra/db/repository/sequelize/category-sequelize"
import { NotFoundError } from "#seedwork/domain"
import { setupSequelize } from "#seedwork/infra/testing/helpers/db"
import { UpdateCategoryUseCase } from "../../update-category.usecase"

const {CategorySequelizeRepository,CategoryModel} = CategorySequelize

describe('UpdateCategoryUseCase unit test', () => {
    let usecase: UpdateCategoryUseCase.UpdateCategoryUseCase
    let repository: CategorySequelize.CategorySequelizeRepository
    setupSequelize({models: [CategoryModel]})
    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        usecase = new UpdateCategoryUseCase.UpdateCategoryUseCase(repository)
    })

    it('should throw an error when category id does not exist', async() => {
        await expect( async() => await usecase.execute({id: 'fake id',name:'N1'})).rejects.toThrow(new NotFoundError(`Entity not found with this id: fake id`))
    })

    it('should update a category', async() => {
        const model = await CategoryModel.factory().create()

        let output = await usecase.execute({id: model.id, name: 'update'})

        expect(output).toStrictEqual({
            id: model.id,
            name: 'update',
            description: undefined,
            is_active: true,
            created_at: model.created_at
        })
        
        output = await usecase.execute({id:model.id,name: 'update', description: 'D1'})

        expect(output).toStrictEqual({
            id: model.id,
            name: 'update',
            description: 'D1',
            is_active: true,
            created_at: model.created_at
        })
        
        output = await usecase.execute({id:model.id,name: 'update', is_active:false})

        expect(output).toStrictEqual({
            id: model.id,
            name: 'update',
            description: undefined,
            is_active: false,
            created_at: model.created_at
        })
       
        output = await usecase.execute({id:model.id,name: 'update'})

        expect(output).toStrictEqual({
            id: model.id,
            name: 'update',
            description: undefined,
            is_active: false,
            created_at: model.created_at
        })
        
        output = await usecase.execute({id:model.id,name: 'update', description:'D1', is_active: true})

        expect(output).toStrictEqual({
            id: model.id,
            name: 'update',
            description: 'D1',
            is_active: true,
            created_at: model.created_at
        })
    })
})