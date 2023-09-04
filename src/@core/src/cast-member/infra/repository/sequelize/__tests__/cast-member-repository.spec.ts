import { CastMember, CastMemberType } from "#cast-member/domain/entities/cast-member"
import { CastMemberSearchParams, CastMemberSearchResult } from "#cast-member/domain/repository/cast-member.repository"
import { NotFoundError, UniqueEntityId } from "#seedwork/domain"
import { setupSequelize } from "#seedwork/infra"
import { CastMemberSequelize } from "../cast-member-sequelize"
import _chance from 'chance'

describe('Repository tests', () => {
    setupSequelize({models: [CastMemberSequelize.CastMemberModel]})
    let repository: CastMemberSequelize.Repository
    let chance: Chance.Chance

    beforeAll(() => chance = _chance())

    beforeEach(async() => {
        repository = new CastMemberSequelize.Repository(CastMemberSequelize.CastMemberModel)
    })

    it('should create a new cast member', async() => {
        let castMember = new CastMember({name: 'ACTOR', type: CastMemberType.ACTOR})
        await repository.insert(castMember)

        let actorCreated = await CastMemberSequelize.CastMemberModel.findByPk(castMember.id)
        expect(actorCreated.toJSON()).toStrictEqual(castMember.toJSON())
    })

    it('should throw an error when cast member not found', async () => {
        await expect(repository.findById('fake id')).rejects.toThrow(
            new NotFoundError(`Entity not found with this id: fake id`)
        )
    })

    it('should find a entity', async () => {
        let castMember = new CastMember({name: 'ACTOR', type: CastMemberType.ACTOR})
        await repository.insert(castMember)

        let entityFounded = await repository.findById(castMember.id)
        expect(entityFounded.toJSON()).toStrictEqual(castMember.toJSON())
    })

    it('should find all entities', async() => {
        const actor = CastMember.fake().aActor().withName('A1').build()
        const director = CastMember.fake().aDirector().withName('D1').build()
        await repository.insert(actor)
        await repository.insert(director)

        let castMembers = await repository.findAll()
        expect(castMembers.length).toBe(2)
        expect(castMembers[0].toJSON()).toStrictEqual(actor.toJSON())
        expect(castMembers[1].toJSON()).toStrictEqual(director.toJSON())
    })

    describe('search method test', () => {
        it('should apply paginate when all parameters is null', async() => {
            const created_at = new Date()
            await CastMemberSequelize.CastMemberModel.factory().count(16).bulkCreate(() => ({
                id: chance.guid({version:4}),
                name: 'A',
                type: CastMemberType.ACTOR,
                created_at: created_at
            }))

            const spyToEntity = jest.spyOn(CastMemberSequelize.CastMemberModelMapper, 'toEntity')
            const searchOut = await repository.search(new CastMemberSearchParams())
            
            expect(searchOut).toBeInstanceOf(CastMemberSearchResult)
            expect(spyToEntity).toHaveBeenCalledTimes(15)
            expect(searchOut.toJSON()).toMatchObject({
                total: 16,
                current_page: 1,
                last_page: 2,
                per_page: 15,
                sort: null,
                sort_dir: null,
                filter: null
            })
            searchOut.items.forEach((item) => {
                expect(item).toBeInstanceOf(CastMember)
                expect(item.id).toBeDefined()
                expect(item.toJSON()).toMatchObject({
                    name: 'A',
                    type: CastMemberType.ACTOR,
                    created_at: created_at
                })
            })
        })

        it('should order by name when sort param is null', async() => {
            const created_at = new Date()
            const actor1 = new CastMember({
                name: `B`,
                type: CastMemberType.ACTOR,
                created_at: created_at
            })
            const actor0 = new CastMember({
                name: `A`,
                type: CastMemberType.ACTOR,
                created_at: created_at
            })
            await repository.bulkInsert([actor1,actor0])
            
            const searchOut = await repository.search(new CastMemberSearchParams())
            expect(searchOut.items[0].toJSON()).toStrictEqual(actor0.toJSON())
            expect(searchOut.items[1].toJSON()).toStrictEqual(actor1.toJSON())
            
        })
    })
})