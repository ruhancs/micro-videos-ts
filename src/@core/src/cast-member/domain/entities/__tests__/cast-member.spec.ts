import { UniqueEntityId } from "#seedwork/domain"
import { CastMember, CastMemberType } from "../cast-member"


describe('Cast Member unit test', () => {
    beforeEach(() => {
        CastMember.validate = jest.fn()
    })
    it('should test constructor of CastMember', () => {
        const props = {
            name: "C1",
            type: CastMemberType.ACTOR,
            created_at: new Date()
        }
        let castMember = new CastMember(props)
        expect(CastMember.validate).toHaveBeenCalled()
        expect(castMember.props).toMatchObject({
            name: props.name,
            type: props.type,
            //create_at: props.created_at
        })
    })

    it('should test id field', () => {
        const props = {
            name: "C1",
            type: CastMemberType.ACTOR,
            created_at: new Date()
        }
        let castMember = new CastMember(props)
        expect(castMember.id).toBeDefined()
        expect(castMember.uniqueentityId).toBeInstanceOf(UniqueEntityId)
    })
    
    it('should test getter name property', () => {
        const props = {
            name: "C1",
            type: CastMemberType.ACTOR,
            created_at: new Date()
        }
        let castMember = new CastMember(props)
        expect(castMember.name).toBe("C1")
    })
    
    it('should test getter type property', () => {
        const props = {
            name: "C1",
            type: CastMemberType.ACTOR,
            created_at: new Date()
        }
        let castMember = new CastMember(props)
        expect(castMember.type).toBe(2)
    })

    it('should test update cast member', () => {
        const props = {
            name: "C1",
            type: CastMemberType.ACTOR,
            created_at: new Date()
        }
        let castMember = new CastMember(props)
        expect(castMember.name).toBe('C1')
        expect(castMember.type).toBe(2)
        
        castMember.update('update')
        expect(castMember.name).toBe('update')
        expect(castMember.type).toBe(2)
        
        castMember.update('update', 1)
        expect(castMember.name).toBe('update')
        expect(castMember.type).toBe(1)
    })
})