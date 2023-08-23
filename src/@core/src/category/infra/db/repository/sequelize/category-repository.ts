import { Category, CategoryRepository, CategorySearchParams, CategorySearchResult } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { Op } from "sequelize";
import { CategoryModelMapper } from "./category-mapper";
import { CategoryModel } from "./category-model";

export class CategorySequelizeRepository implements CategoryRepository {
    sortableFields: string[] = ['name', 'created_at'];

    constructor(private categoryModel: typeof CategoryModel) {}
    async insert(entity: Category): Promise<void> {
        await this.categoryModel.create(entity.toJSON())
    }
    async findById(id: string | UniqueEntityId): Promise<Category> {
        const _id = `${id}`
        const model = await this._get(_id)
        return CategoryModelMapper.toEntity(model)
    }
    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll()
        return models.map((model) => CategoryModelMapper.toEntity(model))
    }
    async update(entity: Category): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string | UniqueEntityId): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page -1) * props.per_page
        const limit = props.per_page
        const {rows:models, count} = await this.categoryModel.findAndCountAll({
            ...( props.filter && { 
                where: {name: { [Op.like]: `%${props.filter}%` }},
            }),
            //se sort e sort_dir nao existir ordena por desc created_at
            ...(props.sort && this.sortableFields.includes(props.sort) 
                ? {order: [[props.sort,props.sort_dir]]}
                : {order: [['created_at', 'desc']]}),
            offset,
            limit
        })
        return new CategorySearchResult({
            items: models.map((m) => CategoryModelMapper.toEntity(m)),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
            filter: props.filter,
            sort: props.sort,
            sort_dir: props.sort_dir,
        })

    }

    private async _get(id: string): Promise<CategoryModel> {
        return this.categoryModel.findByPk(id, {rejectOnEmpty: new NotFoundError(`Entity not found with this id: ${id}`)})
    }

}