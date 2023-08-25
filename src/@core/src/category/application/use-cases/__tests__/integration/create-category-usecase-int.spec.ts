import { CategorySequelize } from "#category/infra/db/repository/sequelize/category-sequelize"
import { setupSequelize } from "#seedwork/infra/testing/helpers/db"
import {CreateCategoryUseCase} from "../../create-category.usecase"

const {CategorySequelizeRepository,CategoryModel} = CategorySequelize

describe('CreateCategoryUseCase unit test', () => {
    let usecase: CreateCategoryUseCase.CreateCategoryUseCase
    let repository: CategorySequelize.CategorySequelizeRepository
    setupSequelize({models: [CategoryModel]})
    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        usecase = new CreateCategoryUseCase.CreateCategoryUseCase(repository)
    })

    it('should create a category', async() => {
        let output = await usecase.execute({name: 'test'})
        let entity = await CategoryModel.findByPk(output.id)

        expect(output).toStrictEqual({
            id: entity.id,
            name: 'test',
            description: null,
            is_active: true,
            created_at: entity.created_at
        })
        
        output = await usecase.execute({name: 'test', description: 'D1', is_active: false})
        entity = await CategoryModel.findByPk(output.id)
        
        expect(output).toStrictEqual({
            id: entity.id,
            name: 'test',
            description: 'D1',
            is_active: false,
            created_at: entity.created_at
        })
    })
})