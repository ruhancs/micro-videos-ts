import { Entity, EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import { CastMemberValidatorFactory } from "../validators/cast-member.validator";
import { CastMemberFakeBuilder } from "./cast-member-fake-builder";

export enum CastMemberType {
    DIRECTOR = 1,
    ACTOR = 2
}

export interface CastMemberProps {
    name: string;
    type: CastMemberType;
    created_at?: Date | null
}

export type CastMemberPropJson = Required<{id: string} & CastMemberProps>

export class CastMember extends Entity<CastMemberProps, CastMemberPropJson> {
    constructor(readonly props: CastMemberProps, id?: UniqueEntityId) {
        CastMember.validate(props)
        super(props,id)
    }

    get name() {
        return this.props.name
    }

    get type() {
        return this.props.type
    }

    get created_at() {
        return this.props.created_at
    }

    update(name:string, type?: CastMemberType) {
        CastMember.validate({name,type})
        this.props.name = name
        if(type) {
            this.props.type = type
        }
    }

    static validate(props: CastMemberProps) {
        if(!props.created_at) {
            props.created_at = new Date
        }
        const validator = CastMemberValidatorFactory.create()
        const isValid = validator.validate(props)
        if(!isValid) {
            throw new EntityValidationError(validator.errors)
        }
    }

    toJSON(): Required<{ id: string; } & CastMemberProps> {
        return {
            id: this.id.toString(),
            name: this.name,
            type: this.type,
            created_at: this.created_at
        }
    }

    static fake() {
        return CastMemberFakeBuilder
    }
}