import UniqueEntityId from "../value-objects/unique-entity-id.value-obj";

export abstract class Entity <Props = any>{
    public readonly uniqueentityId: UniqueEntityId
    constructor(readonly props: Props, id?: UniqueEntityId) {
        this.uniqueentityId = id || new UniqueEntityId()
    }

    get id(): string {
        return this.uniqueentityId.value
    }

    toJSON(): Required<{id: string} & Props> {
        return {
            id: this.id,
            ...this.props
        } as Required<{id: string} & Props>
    }
}

export default Entity