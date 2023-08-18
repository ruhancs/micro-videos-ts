import CategoryRepository from "../../domain/repository/category.repository"
import Category from "../../domain/entities/category"
import UseCase from "../../../@seedwork/application/use-case"

export type InputCreateCategoryUseCase = {
    name: string
    description?: string
    is_active?: boolean
}

export type OutputCreateCategoryUseCase = {
    id: string
    name: string
    description: string | null
    is_active: boolean
    created_at: Date
}

export default class CreateCategoryUseCase implements UseCase<InputCreateCategoryUseCase,OutputCreateCategoryUseCase> {
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(input: InputCreateCategoryUseCase): Promise<OutputCreateCategoryUseCase>{
        const category = new Category(input)
        await this.categoryRepository.insert(category)
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at
        }
    }
}