import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category-model"
import { Category } from "#category/domain"
import { CategorySequelizeRepository } from "../category-repository"
import { NotFoundError } from "#seedwork/domain"

describe('CategorySequelizeRepository Tests', () => {
    let sequelize: Sequelize
    let categoryRepository: CategorySequelizeRepository

    beforeAll(() => sequelize = new Sequelize({
        dialect: 'sqlite',
        host: ':memory:',
        logging: true,
        models: [CategoryModel],
    }))

    //zerar o db antes de cada test
    beforeEach(async() => {
        categoryRepository = new CategorySequelizeRepository(CategoryModel)
        await sequelize.sync({force: true})
    })

    afterAll(async() => {await sequelize.close()})
    it('should create a new category', async() =>{
        let category = new Category({name: 'C1'})
        await categoryRepository.insert(category)

        let saveCategory = await CategoryModel.findByPk(category.id)
        expect(saveCategory.toJSON()).toStrictEqual(category.toJSON())
        
        category = new Category({name: 'C1', description: 'D1', is_active: false})
        await categoryRepository.insert(category)

        saveCategory = await CategoryModel.findByPk(category.id)
        expect(saveCategory.toJSON()).toStrictEqual(category.toJSON())
    })

    it('should thrown error when category not found', async() => {
        await expect(categoryRepository.findById('fake id')).rejects.toThrow(
            new NotFoundError(`Entity not found with this id: fake id`)
        )
    })

    it('should find a entity by id', async () => {
        const entity = new Category({name: 'N1'})
        await categoryRepository.insert(entity)
        
        let entityFounded = await categoryRepository.findById(entity.id)
        expect(entityFounded.toJSON()).toStrictEqual(entity.toJSON())
        
        entityFounded = await categoryRepository.findById(entity.uniqueentityId)
        expect(entityFounded.toJSON()).toStrictEqual(entity.toJSON())
    })
    
    it('should find all entity', async () => {
        const entity = new Category({name: 'N1'})
        const entity2 = new Category({name: 'N2'})
        await categoryRepository.insert(entity)
        await categoryRepository.insert(entity2)
        
        let entities = await categoryRepository.findAll()
        expect(entities.length).toBe(2)
        expect(entities[0].toJSON()).toStrictEqual(entity.toJSON())
        expect(entities[1].toJSON()).toStrictEqual(entity2.toJSON())
    })
})