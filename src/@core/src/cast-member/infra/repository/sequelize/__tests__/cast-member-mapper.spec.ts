import { CastMember, CastMemberType } from "#cast-member/domain/entities/cast-member"
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain"
import { setupSequelize } from "#seedwork/infra"
import { CastMemberSequelize } from "../cast-member-sequelize"

describe('CastMemberModelMapper test', () => {
    setupSequelize({models: [CastMemberSequelize.CastMemberModel]})

    it('should throw an error when cast member is invalid', async () => {
        const model = new CastMemberSequelize.CastMemberModel({id: '77349e57-d8cf-47cf-991e-8f1b62efad1b'})
        try {
            CastMemberSequelize.CastMemberModelMapper.toEntity(model)
            fail('Invalid CastMember')
        } catch (error) {
            expect(error).toBeInstanceOf(LoadEntityError)
            expect(error.error).toStrictEqual({
                name: [
                  'name should not be empty',
                  'name must be a string',
                  'name must be shorter than or equal to 255 characters'
                ],
                type: [ 'type should not be empty' ]
            })
        }
    })

    it('should convert a model to entity', async () => {
        const created_at = new Date()
        const model = new CastMemberSequelize.CastMemberModel({
            id:'77349e57-d8cf-47cf-991e-8f1b62efad1b',
            name: 'ACTOR',
            type: CastMemberType.ACTOR,
            created_at: created_at
        })
        const entity = CastMemberSequelize.CastMemberModelMapper.toEntity(model)
        expect(entity.toJSON()).toStrictEqual(new CastMember({
            name: 'ACTOR',
            type: CastMemberType.ACTOR,
            created_at: created_at
        }, new UniqueEntityId('77349e57-d8cf-47cf-991e-8f1b62efad1b')).toJSON()
        )
    })
})