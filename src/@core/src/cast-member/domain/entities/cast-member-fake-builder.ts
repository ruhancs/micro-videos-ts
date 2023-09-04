import { UniqueEntityId } from "#seedwork/domain";
import{Chance} from 'chance';
import { CastMember, CastMemberType } from "./cast-member";

type PropOrFactory<T> = T | ((index: number) => T)

export class CastMemberFakeBuilder<TBuild = any>{
    private uniqueEntityId = undefined // generated in entity
    private chance: Chance.Chance
    private countObj: number
    private createdAt = undefined // generated in entity
    constructor(countObj: number = 1){
        this.countObj = countObj
        this.chance = Chance()
    }
    name : PropOrFactory<string> = (_index) => this.chance.word()
    type: PropOrFactory<CastMemberType> = CastMemberType.ACTOR

    static aActor(){
        return new CastMemberFakeBuilder<CastMember>();
    }
    
    static theActors(objs: number) {
        return new CastMemberFakeBuilder<CastMember[]>(objs)
    }
   
    static aDirector(){
        const director = new CastMemberFakeBuilder<CastMember>();
        director.type = CastMemberType.DIRECTOR
        return director
    }

    withUniqueIdentityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
        this.uniqueEntityId = valueOrFactory
        return this
    }

    withName(name: PropOrFactory<string>) {
        this.name = name
        return this
    }

    withInvalidName(value: "" | null | undefined) {
        this.name = value
        return this
    }
    
    withInvalidNameNotString() {
        this.name = 5 as any
        return this
    }

    withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
        this.createdAt = valueOrFactory
        return this
    }

    build(): TBuild{
        const categories = new Array(this.countObj)
            .fill(undefined)
            .map((_,i) => new CastMember({
                name: this.callFactory(this.name, i),
                type: this.callFactory(this.type, i),
                ...(this.createdAt && {created_at: this.callFactory(this.createdAt, i)}),
            }, !this.uniqueEntityId ? undefined : this.callFactory(this.uniqueEntityId, i))
            )
        return this.countObj === 1 ? categories[0] as any : categories;
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function' ? factoryOrValue(index) : factoryOrValue
    }
}