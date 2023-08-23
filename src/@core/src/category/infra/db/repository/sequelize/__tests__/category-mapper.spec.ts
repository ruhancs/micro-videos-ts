import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category-model"
import { CategorySequelizeRepository } from "../category-repository"
import { CategoryModelMapper } from "../category-mapper"
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain"
import { Category } from "#category/domain"

describe('CategoryMapper unit test', () => {
    let sequelize: Sequelize

    beforeAll(() => sequelize = new Sequelize({
        dialect: 'sqlite',
        host: ':memory:',
        logging: true,
        models: [CategoryModel],
    }))

    //zerar o db antes de cada test
    beforeEach(async() => {
        await sequelize.sync({force: true})
    })

    afterAll(async() => {await sequelize.close()})
    it('should throw error when category is invalid', async() => {
        const model = new CategoryModel({id: '77349e57-d8cf-47cf-991e-8f1b62efad1b'})
        try {
            CategoryModelMapper.toEntity(model)
            fail('The Category is valid, but must throw an error')
        } catch (error) {
            expect(error).toBeInstanceOf(LoadEntityError)
            expect(error.error).toMatchObject({
                name: [
                    'name should not be empty',
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })
        }
    })

    //it('should throw a generic error', async () => {
    //    const error = new Error('Generic error')
    //    const spyValidate = jest.spyOn(Category, 'validate').mockImplementation(() => {throw error})
    //    const model = new CategoryModel({id: '77349e57-d8cf-47cf-991e-8f1b62efad1b'})
    //    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error)
    //    expect(spyValidate).toHaveBeenCalled()
    //})
    
    it('should convert a model to entity', async () => {
        const create_at = new Date()
        const model = new CategoryModel({id: '77349e57-d8cf-47cf-991e-8f1b62efad1b', name: 'N1', is_active: true, created_at: create_at})
        const entity = CategoryModelMapper.toEntity(model)
        expect(entity.toJSON()).toStrictEqual(new Category({
            name: 'N1',
            created_at:create_at
        }, new UniqueEntityId('77349e57-d8cf-47cf-991e-8f1b62efad1b')).toJSON())
    })
})