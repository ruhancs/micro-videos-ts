import Entity from "../../entity/entity";
import NotFoundError from "../../errors/not-found.error";
import UniqueEntityId from "../../value-objects/unique-entity-id.value-obj";
import {InMemoryRepository} from "../in-memory.repository";

type StubEntityProps = {
    name: string;
    price: number
}

class StubEntity extends Entity<StubEntityProps> {

}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit test', () => {
    let repository: StubInMemoryRepository
    beforeEach(() => repository = new StubInMemoryRepository())
    it('should insert a new entity in memory',async () => {
        const entity = new StubEntity({name: 'N1', price: 10})
        await repository.insert(entity)
        expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON())
    })

    it('should throw an error when entity not found', async() => {
        await expect(repository.findById('invalid id')).rejects.toThrow(new NotFoundError('Entity not found with this id: invalid id'))
        
        await expect(repository.findById(new UniqueEntityId('77349e57-d8cf-47cf-991e-8f1b62efad1b'))).rejects.toThrow(new NotFoundError('Entity not found with this id: 77349e57-d8cf-47cf-991e-8f1b62efad1b'))
    })

    it('should find a entity by id', async () => {
        const entity = new StubEntity({name: 'N1', price: 10})
        await repository.insert(entity)
        
        let entityFounded = await repository.findById(entity.id)
        expect(entityFounded.toJSON()).toStrictEqual(entity.toJSON())
        
        entityFounded = await repository.findById(entity.uniqueentityId)
        expect(entityFounded.toJSON()).toStrictEqual(entity.toJSON())
    })
    
    it('should find all entities', async ()=> {
        const entity = new StubEntity({name: 'N1', price: 10})
        await repository.insert(entity)
        const entities = await repository.findAll()
        expect(entities).toStrictEqual(repository.items)
    })
    
    it('should throw an error when try update an entity not found', async() => {
        const entity = new StubEntity({name: 'N1', price: 10})
        expect(repository.update(entity)).rejects.toThrow(new NotFoundError(`Entity not found with this id: ${entity.id}`))
        
    })

    it('should update an entity', async() => {
        const entity = new StubEntity({name: 'N1', price: 10})
        await repository.insert(entity)

        const entityUpdated = new StubEntity({name: 'update', price: 1}, entity.uniqueentityId)
        await repository.update(entityUpdated)
        expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON())
    })
    
    it('should throw an error when try delete an entity not found', async() => {
        const entity = new StubEntity({name: 'N1', price: 10})
        expect(repository.delete('inalid id')).rejects.toThrow(new NotFoundError(`Entity not found with this id: inalid id`))
        expect(repository.delete(new UniqueEntityId('77349e57-d8cf-47cf-991e-8f1b62efad1b'))).rejects.toThrow(new NotFoundError('Entity not found with this id: 77349e57-d8cf-47cf-991e-8f1b62efad1b'))
    })

    it('should delete an entity', async() => {
        const entity = new StubEntity({name: 'N1', price: 10})
        await repository.insert(entity)
        
        await repository.delete(entity.id)
        expect(repository.items.length).toBe(0)
        
        await repository.insert(entity)
        await repository.delete(entity.uniqueentityId)
        expect(repository.items.length).toBe(0)
    })
})