import { CastMemberFakeBuilder } from "#cast-member/domain/entities/cast-member-fake-builder"
import { CastMemberInMemoryRepository } from "./cast-member-in-memory.repository"

describe('CastMemberInMemoryRepository unit test', () => {
    let repository: CastMemberInMemoryRepository

    beforeEach(() => repository = new CastMemberInMemoryRepository())

    it('should test repository', async () => {
        const castMembers = [CastMemberFakeBuilder.aActor().build()]

        const spyFilterMethod = jest.spyOn(castMembers, 'filter' as any)
        const castMembersFiltered = await repository['applyFilter'](castMembers,null)
        expect(castMembersFiltered).toStrictEqual(castMembers)
        expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should test filter param', async () => {
        const castMembers = [
            CastMemberFakeBuilder.aActor().withName('A').build(),
            CastMemberFakeBuilder.aActor().withName('A').build(),
            CastMemberFakeBuilder.aActor().withName('B').build(),
            CastMemberFakeBuilder.aDirector().withName('B').build(),
        ]

        const spyFilterMethod = jest.spyOn(castMembers, 'filter' as any)
        let castMembersFiltered = await repository['applyFilter'](castMembers,'B')
        expect(castMembersFiltered).toStrictEqual([castMembers[2], castMembers[3]])
        
        castMembersFiltered = await repository['applyFilter'](castMembers,'actor')
        expect(castMembersFiltered).toStrictEqual([castMembers[0], castMembers[1], castMembers[2]])
        
        castMembersFiltered = await repository['applyFilter'](castMembers,'director')
        expect(castMembersFiltered).toStrictEqual([castMembers[3]])
    })
    
    it('should test sort param', async () => {
        const castMembers = [
            CastMemberFakeBuilder.aActor().withName('B').build(),
            CastMemberFakeBuilder.aActor().withName('A').build(),
            CastMemberFakeBuilder.aActor().withName('D').build(),
            CastMemberFakeBuilder.aDirector().withName('C').build(),
        ]

        let castMemberSorted = await repository['applySort'](castMembers,'name', 'asc')
        expect(castMemberSorted).toStrictEqual([castMembers[1],castMembers[0],castMembers[3],castMembers[2]])
    })
})