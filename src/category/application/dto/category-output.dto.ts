import Category from "category/domain/entities/category"

export type OutputCatgeoryUseCase = {
    id: string
    name: string
    description: string | null
    is_active: boolean
    created_at: Date
}

export class CategoryOutputMapper {
    static toCategoryItemOutput(category: Category): OutputCatgeoryUseCase {
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at
        }
    }
}