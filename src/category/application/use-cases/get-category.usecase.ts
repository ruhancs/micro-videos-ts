import UseCase from "../../../@seedwork/application/use-case"
import CategoryRepository from "../../domain/repository/category.repository"

export type InputGetCategoryUseCase = {
    id: string
}

export type OutputGetCategoryUseCase = {
    id: string
    name: string
    description: string | null
    is_active: boolean
    created_at: Date
}

export default class GetCategoryUseCase implements UseCase<InputGetCategoryUseCase,OutputGetCategoryUseCase> {
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(input: InputGetCategoryUseCase): Promise<OutputGetCategoryUseCase>{
        const category = await this.categoryRepository.findById(input.id)
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at
        }
    }
}