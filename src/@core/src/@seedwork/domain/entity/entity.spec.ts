import UniqueEntityId from "../value-objects/unique-entity-id.value-obj";
import Entity from "./entity";

class StubEntity extends Entity<{prop1: string; prop2: number}> {
    toJSON(): Required<{ id: string; } & { prop1: string; prop2: number; }> {
        return {
            id: this.id,
            prop1: this.props.prop1,
            prop2: this.props.prop2,
        }
    }
}

describe('Entity unit test', () => {
    it('shoud set props and id', () => {
        const entity = new StubEntity({prop1: 'value1', prop2: 5})
        expect(entity.props).toStrictEqual({prop1: 'value1', prop2: 5})
        expect(entity.uniqueentityId).toBeInstanceOf(UniqueEntityId)
    })
})