import { GetCategoryUseCase } from "#category/application"
import { CategorySequelize } from "#category/infra/db/repository/sequelize/category-sequelize"
import { NotFoundError } from "#seedwork/domain"
import { setupSequelize } from "#seedwork/infra/testing/helpers/db"

const {CategorySequelizeRepository,CategoryModel} = CategorySequelize

describe('GetCategoryUseCase unit test', () => {
    let usecase: GetCategoryUseCase.GetCategoryUseCase
    let repository: CategorySequelize.CategorySequelizeRepository
    setupSequelize({models: [CategoryModel]})
    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        usecase = new GetCategoryUseCase.GetCategoryUseCase(repository)
    })

    it('should throw an error when category not found', async() => {
        await expect( async() => await usecase.execute({id: 'fake id'})).rejects.toThrow(new NotFoundError(`Entity not found with this id: fake id`))

    })

    it('should get a category', async() => {
        const model = await CategoryModel.factory().create()

        let output = await usecase.execute({id: model.id})

        expect(output).toStrictEqual({
            id: model.id,
            name: model.name,
            description: model.description,
            is_active: true,
            created_at: model.created_at
        })
    })
    
})