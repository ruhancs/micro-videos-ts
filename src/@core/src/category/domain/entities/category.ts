//import ValidatorRules from '../../../@seedwork/domain/validators/vallidator-rules';
import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.value-obj';
import CategoryValidatorFactory from '../validators/category.validator';
import { EntityValidationError } from '../../../@seedwork/domain/errors/validaton-error';

export interface CategoryProperties {
    name: string, 
    description?: string, 
    is_active?: boolean, 
    created_at?: Date
}

export class Category extends Entity<CategoryProperties> {
    constructor(readonly props: CategoryProperties, id?: UniqueEntityId) {
        Category.validate(props)
        super(props, id)
        this.description = this.props.description;
        this.props.is_active = this.props.is_active ?? true;
        this.props.created_at = this.props.created_at ?? new Date;
    }

    get name(): string {
        return this.props.name
    }

    get description(): string|undefined {
        return this.props.description
    }

    private set description(value: string) {
        this.props.description = value ?? null;
    }

    get is_active(): boolean|undefined {
        return this.props.is_active
    }

    private set is_active(value: boolean) {
        this.props.is_active = value ?? true;
    }

    get created_at(): Date|undefined {
        return this.props.created_at
    }

    active() {
        this.props.is_active = true
    }
    
    deactive() {
        this.props.is_active = false
    }

    update(name: string, description: string) {
        Category.validate({name, description})
        this.props.name = name
        this.props.description = description
    }

    static validate(props: CategoryProperties) {
        const validator = CategoryValidatorFactory.create()
        const isValid = validator.validate(props)
        if(!isValid){
            throw new EntityValidationError(validator.errors)
        }
    }

    //static validate(props: Omit<CategoryProperties, 'created_at'>) {
    //    ValidatorRules.values(props.name, 'name').required().string().maxLength(255)
    //    ValidatorRules.values(props.description, 'description').string()
    //    ValidatorRules.values(props.is_active, 'is_active').boolean()
    //}
}

export default Category