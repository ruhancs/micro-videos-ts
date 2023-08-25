import { CategorySequelize } from "../category-sequelize"
import { Category, CategorySearchParams, CategorySearchResult } from "#category/domain"
import { NotFoundError, SearchParams } from "#seedwork/domain"
import { setupSequelize } from "#seedwork/infra/testing/helpers/db"
import _chance from 'chance'

describe('CategorySequelizeRepository Tests', () => {
    setupSequelize({models: [CategorySequelize.CategoryModel]})
    let categoryRepository: CategorySequelize.CategorySequelizeRepository
    let chance: Chance.Chance

    beforeAll(() => chance = _chance())

    //zerar o db antes de cada test
    beforeEach(async() => {
        categoryRepository = new CategorySequelize.CategorySequelizeRepository(CategorySequelize.CategoryModel)
    })
    it('should create a new category', async() =>{
        let category = new Category({name: 'C1'})
        await categoryRepository.insert(category)

        let saveCategory = await CategorySequelize.CategoryModel.findByPk(category.id)
        expect(saveCategory.toJSON()).toStrictEqual(category.toJSON())
        
        category = new Category({name: 'C1', description: 'D1', is_active: false})
        await categoryRepository.insert(category)

        saveCategory = await CategorySequelize.CategoryModel.findByPk(category.id)
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

    describe('Search method test', () => {
        it('should apply paginate when all params are null', async() => {
            const created_at = new Date()
            await CategorySequelize.CategoryModel.factory().count(16).bulkCreate(() => ({
                id: chance.guid({version: 4}),
                name: 'C1',
                description: null,
                is_active: true,
                created_at: created_at
            }))
            const spyToEntity = jest.spyOn(CategorySequelize.CategoryModelMapper, 'toEntity')
            const searchOut = await categoryRepository.search(new CategorySearchParams())
            expect(searchOut).toBeInstanceOf(CategorySearchResult)
            expect(spyToEntity).toHaveBeenCalledTimes(15)
            expect(searchOut.toJSON()).toMatchObject({
                total:16,
                current_page: 1,
                last_page: 2,
                per_page: 15,
                sort: null,
                sort_dir: null,
                filter:null
            })
            searchOut.items.forEach((item) => {
                expect(item).toBeInstanceOf(Category)
                expect(item.id).toBeDefined()
            })
            const items = searchOut.items.map((item) => item.toJSON())
            expect(items).toMatchObject(
                new Array(15).fill({
                    name: 'C1',
                    description: null,
                    is_active: true,
                    created_at: created_at
                })
            )
        })

        it('should order by created_at desc when search params are null', async() => {
            const created_at = new Date()
            await CategorySequelize.CategoryModel.factory().count(16).bulkCreate((index) => ({
                id: chance.guid({version: 4}),
                name: `C1-${index}`,
                description: null,
                is_active: true,
                created_at: new Date(created_at.getTime() + 200 + index)
            }))

            const searchOut = await categoryRepository.search(new CategorySearchParams())
            const items = searchOut.items.reverse()
            items.forEach((item,index) => {
                expect(`${item.name}-${index + 1}`)
            })
        })

        it('should apply paginate and filter', async() => {
            const defaultProps = {
                description: 'D1',
                is_active: true,
                created_at: new Date()
            }
            const categoryProps = [
                {id: chance.guid({version: 4}),name: 'test', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'a', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'Test', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'TEST', ...defaultProps}
            ]
            const categories = await CategorySequelize.CategoryModel.bulkCreate(categoryProps)

            let out = await categoryRepository.search(new CategorySearchParams({
                page:1,
                per_page:2,
                filter: 'test'
            }))

            expect(out.toJSON(true)).toMatchObject(new CategorySearchResult({
                items: [
                    CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
                    CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
                ],
                total: 3,
                current_page: 1,
                per_page: 2,
                sort: null,
                sort_dir: null,
                filter: 'test'
            }).toJSON(true)
            )

            out = await categoryRepository.search(new CategorySearchParams({
                page:2,
                per_page:2,
                filter: 'test'
            }))
            
            expect(out.toJSON(true)).toMatchObject(new CategorySearchResult({
                items: [
                    CategorySequelize.CategoryModelMapper.toEntity(categories[3]),
                ],
                total: 3,
                current_page: 2,
                per_page: 2,
                sort: null,
                sort_dir: null,
                filter: 'test'
            }).toJSON(true)
            )
        })
        
        it('should apply paginate and sort', async() => {
            expect(categoryRepository.sortableFields).toStrictEqual(['name', 'created_at'])
            const defaultProps = {
                description: 'D1',
                is_active: true,
                created_at: new Date()
            }
            const categoryProps = [
                {id: chance.guid({version: 4}),name: 'b', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'a', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'd', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'e', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'c', ...defaultProps},
            ]
            const categories = await CategorySequelize.CategoryModel.bulkCreate(categoryProps)

            const arrange = [
                {
                    params: new SearchParams({page: 1, per_page: 2, sort: 'name'}),
                    result: new CategorySearchResult({
                        items: [
                            CategorySequelize.CategoryModelMapper.toEntity(categories[1]), 
                            CategorySequelize.CategoryModelMapper.toEntity(categories[0]), 
                        ],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    })
                },
                {
                    params: new SearchParams({page: 1, per_page: 2, sort: 'name', sort_dir: 'desc'}),
                    result: new CategorySearchResult({
                        items: [
                            CategorySequelize.CategoryModelMapper.toEntity(categories[3]), 
                            CategorySequelize.CategoryModelMapper.toEntity(categories[2]), 
                        ],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                        filter: null,
                    })
                },
            ]

            for (const i of arrange) {
                let result = await categoryRepository.search(i.params)
                expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true))
            }
        })

        it('should apply filter, sort and paginate', async() => {
            const defaultProps = {
                description: 'D1',
                is_active: true,
                created_at: new Date()
            }
            const categoryProps = [
                {id: chance.guid({version: 4}),name: 'test', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'a', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'Test', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'b', ...defaultProps},
                {id: chance.guid({version: 4}),name: 'TEST', ...defaultProps},
            ]

            const categories = await CategorySequelize.CategoryModel.bulkCreate(categoryProps)

            const arrange = [
                {
                    params: new CategorySearchParams({page: 1, per_page: 2, sort: 'name', filter: 'TEST'}),
                    result: new CategorySearchResult({
                        items: [
                            CategorySequelize.CategoryModelMapper.toEntity(categories[4]), 
                            CategorySequelize.CategoryModelMapper.toEntity(categories[2]), 
                        ],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: 'TEST',
                    })
                },
                {
                    params: new CategorySearchParams({page: 2, per_page: 2, sort: 'name', filter: 'TEST'}),
                    result: new CategorySearchResult({
                        items: [
                            CategorySequelize.CategoryModelMapper.toEntity(categories[0]), 
                        ],
                        total: 3,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: 'TEST',
                    })
                },
            ]

            for(const i of arrange) {
                let result = await categoryRepository.search(i.params)
                expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true))
            }
        })
    })

    it('should update an entity', async() => {
        const category = new Category({name: 'C1'})

        await expect(categoryRepository.update(category)).rejects.toThrow(
            new NotFoundError(`Entity not found with this id: ${category.id}`)
        )
    })

    it('should update an entity', async() => {
        let category = new Category({name: 'C1'})
        await categoryRepository.insert(category)

        category.update('update', 'D1')
        await categoryRepository.update(category)

        let updatedCategory = await CategorySequelize.CategoryModel.findByPk(category.id)

        expect(updatedCategory.toJSON()).toMatchObject({
            name: 'update',
            description:'D1',
            is_active: true
        })
    })
    
    it('should delete an entity', async() => {
        let category = new Category({name: 'C1'})
        await categoryRepository.insert(category)

        await categoryRepository.delete(category.id)

        await expect(categoryRepository.findById(category.id)).rejects.toThrow(
            new NotFoundError(`Entity not found with this id: ${category.id}`)
        )
    })

})