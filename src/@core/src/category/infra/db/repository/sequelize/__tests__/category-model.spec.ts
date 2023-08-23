import { DataType, Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category-model"

describe('CategoryModel unit test', () => {
    let sequelize: Sequelize

    beforeAll(() => sequelize = new Sequelize({
        dialect: 'sqlite',
        host: ':memory:',
        logging: true,
        models: [CategoryModel],
    }))

    //zerar o db antes de cada test
    beforeEach(async() => {await sequelize.sync({force: true})})

    afterAll(async() => {await sequelize.close()})

    it('should test mapping props', async() => {
        const attrMap = CategoryModel.getAttributes()
        const attr =Object.keys(attrMap)

        expect(attr).toStrictEqual(['id', 'name', 'description', 'is_active', 'created_at'])

        const idAttr = attrMap.id
        expect(idAttr).toMatchObject({
            field: 'id',
            fieldName: 'id',
            primaryKey: true,
            type: DataType.UUID()
        })
        
        const nameAttr = attrMap.name
        expect(nameAttr).toMatchObject({
            field: 'name',
            fieldName: 'name',
            allowNull: false,
            type: DataType.STRING(255)
        })
        
        const descriptionAttr = attrMap.description
        expect(descriptionAttr).toMatchObject({
            field: 'description',
            fieldName: 'description',
            allowNull: true,
            type: DataType.TEXT()
        })
        
        const isActiveAttr = attrMap.is_active
        expect(isActiveAttr).toMatchObject({
            field: 'is_active',
            fieldName: 'is_active',
            allowNull: false,
            type: DataType.BOOLEAN()
        })
        
        const createdAtAttr = attrMap.created_at
        expect(createdAtAttr).toMatchObject({
            field: 'created_at',
            fieldName: 'created_at',
            allowNull: false,
            type: DataType.DATE()
        })
    })

    it('should create a category', async() => {
        const arrange = [
            {
                id: '77349e57-d8cf-47cf-991e-8f1b62efad1b', 
                name: 'C1',
                is_active: true,
                created_at: new Date()
            }
        ]
        const category = await CategoryModel.create(arrange[0])
        expect(category.toJSON()).toStrictEqual(arrange[0])
    })
})