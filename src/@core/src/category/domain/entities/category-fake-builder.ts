import { UniqueEntityId } from "#seedwork/domain";
import Category from "./category";
import{Chance} from 'chance';

type PropOrFactory<T> = T | ((index: number) => T)

export class CategoryFakeBuilder<TBuild = any>{
    private uniqueEntityId = undefined // generated in entity
    private chance: Chance.Chance
    private countObj: number
    private createdAt = undefined // generated in entity
    constructor(countObj: number = 1){
        this.countObj = countObj
        this.chance = Chance()
    }
    private name : PropOrFactory<string> = (_index) => this.chance.word()
    private description: PropOrFactory<string | null> = (_index) => this.chance.paragraph()
    private is_active: PropOrFactory<boolean> = (_index) => true

    static aCategory(){
        return new CategoryFakeBuilder<Category>();
    }
    
    static theCategories(objs: number) {
        return new CategoryFakeBuilder<Category[]>(objs)
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
    
    withDescription(description: PropOrFactory<string | null>) {
        this.description = description
        return this
    }

    withInvalidDescriptionNotString() {
        this.description = 5 as any
        return this
    }
    
    active() {
        this.is_active = true
        return this
    }
    
    deactive() {
        this.is_active = false
        return this
    }

    withInvalidIsActiveNotBool() {
        this.is_active = 5 as any
        return this
    }

    withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
        this.createdAt = valueOrFactory
        return this
    }

    build(): TBuild{
        const categories = new Array(this.countObj)
            .fill(undefined)
            .map((_,i) => new Category({
                name: this.callFactory(this.name, i),
                description: this.callFactory(this.description, i),
                is_active: this.callFactory(this.is_active, i),
                ...(this.createdAt && {created_at: this.callFactory(this.createdAt, i)}),
            }, !this.uniqueEntityId ? undefined : this.callFactory(this.uniqueEntityId, i))
            )
        return this.countObj === 1 ? categories[0] as any : categories;
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function' ? factoryOrValue(index) : factoryOrValue
    }
}