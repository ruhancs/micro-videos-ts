import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { CastMemberProps, CastMemberType } from "../entities/cast-member";
import { ClassValidatorFields } from "#seedwork/domain";

export class CastMemberRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string
    
    //@IsEnum(CastMemberType)
    @IsNotEmpty()
    type: number

    @IsDate()
    @IsOptional()
    created_at: Date

    constructor({name,type,created_at}: CastMemberProps) {
        Object.assign(this, {name,type,created_at})
    }
}

export class CastMemberValidator extends ClassValidatorFields<CastMemberRules>{
    validate(data: CastMemberProps): boolean {
        return super.validate(new CastMemberRules(data ?? {} as any))
    }
}

export class CastMemberValidatorFactory {
    static create() {
        return new CastMemberValidator()
    }
}