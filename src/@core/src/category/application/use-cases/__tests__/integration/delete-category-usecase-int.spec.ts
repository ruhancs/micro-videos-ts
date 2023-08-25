import { DeleteCategoryUseCase } from "#category/application"
import { CategorySequelize } from "#category/infra/db/repository/sequelize/category-sequelize"
import { NotFoundError } from "#seedwork/domain"
import { setupSequelize } from "#seedwork/infra/testing/helpers/db"

const {CategorySequelizeRepository,CategoryModel} = CategorySequelize

describe('GetCategoryUseCase unit test', () => {
    let usecase: DeleteCategoryUseCase.DeleteCategoryUseCase
    let repository: CategorySequelize.CategorySequelizeRepository
    setupSequelize({models: [CategoryModel]})
    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        usecase = new DeleteCategoryUseCase.DeleteCategoryUseCase(repository)
    })

    it('should throw an error when category not found', async() => {
        await expect( async() => await usecase.execute({id: 'fake id'})).rejects.toThrow(new NotFoundError(`Entity not found with this id: fake id`))

    })

    it('should delete a category', async() => {
        const model = await CategoryModel.factory().create()
        let output = await usecase.execute({id: model.id})

        const category =await CategoryModel.findByPk(model.id)
        expect(category).toBeNull()
    })
    
})