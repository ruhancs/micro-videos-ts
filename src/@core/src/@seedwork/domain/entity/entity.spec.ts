import UniqueEntityId from "../value-objects/unique-entity-id.value-obj";
import Entity from "./entity";

class StubEntity extends Entity<{prop1: string; prop2: number}> {}

describe('Entity unit test', () => {
    it('shoud set props and id', () => {
        const entity = new StubEntity({prop1: 'value1', prop2: 5})
        expect(entity.props).toStrictEqual({prop1: 'value1', prop2: 5})
        expect(entity.uniqueentityId).toBeInstanceOf(UniqueEntityId)
    })
})