import { CastMemberFakeBuilder } from "../cast-member-fake-builder"

describe('CastMemberFakeBuilder unit test', () => {
    it('should test create an actor', () => {
        const fake = CastMemberFakeBuilder.aActor()
        const actor = fake.build()
        expect(actor.type).toBe(2)
    })
    
    it('should test create an director', () => {
        const fake = CastMemberFakeBuilder.aDirector()
        const director = fake.build()
        expect(director.type).toBe(1)
    })
    
    it('should test withName method', () => {
        const fake = CastMemberFakeBuilder.aActor().withName('N1')
        expect(fake['name']).toBe('N1')
    })
})