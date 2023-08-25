import { ListAllCategoriesUseCase } from "#category/application"
import { CategorySearchResult, Category } from "#category/domain"
import { CategorySequelize } from "#category/infra/db/repository/sequelize/category-sequelize"
import { setupSequelize } from "#seedwork/infra/testing/helpers/db"
import _chance from 'chance'

const {CategorySequelizeRepository,CategoryModel, CategoryModelMapper} = CategorySequelize


describe('ListCategoriesUseCase unit test', () => {
    let usecase: ListAllCategoriesUseCase.ListCategoriesUseCase
    let repository: CategorySequelize.CategorySequelizeRepository
    setupSequelize({models: [CategoryModel]})
    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        usecase = new ListAllCategoriesUseCase.ListCategoriesUseCase(repository)
    })

    it('should return output categories ordered by created_at desc',async () => {
        const models = await CategoryModel.factory().count(2).bulkCreate((index) => {
            const chance = _chance()
            return {
                id: chance.guid({version: 4}),
                name: `category-${index}`,
                description: 'D1',
                is_active: true,
                created_at: new Date(new Date().getTime() + index)
            }
        })
        let output = await usecase.execute({})
        
        output = await usecase.execute({})
        console.log(output)
        expect(output).toMatchObject({
            items: [...models].reverse().map((m) => CategoryModelMapper.toEntity(m).toJSON()),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1
        })
    })

    it('should return output using pagination, sort and filter', async() => {
        const models = CategoryModel.factory().count(6).bulkMake()
        models[0].name = 'b'
        models[1].name = 'c'
        models[2].name = 'a'
        models[3].name = 'Aa'
        models[4].name = 'AA'
        models[5].name = 'd'
        
        await CategoryModel.bulkCreate(models.map((m) => m.toJSON()))
        
        let output = await usecase.execute({page:1,per_page:2,sort:'name',filter:'a'})
        expect(output).toStrictEqual({
            items: [models[4].toJSON(), models[3].toJSON()],
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2
        })
        
        output = await usecase.execute({page:2,per_page:2,sort:'name',filter:'a'})
        expect(output).toStrictEqual({
            items: [models[2].toJSON()],
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2
        })
        
        output = await usecase.execute({page:1,per_page:2,sort:'name',sort_dir:'desc',filter:'a'})
        expect(output).toStrictEqual({
            items: [models[2].toJSON(), models[3].toJSON()],
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2
        })
    })
})