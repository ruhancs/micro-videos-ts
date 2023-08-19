import UseCase from "../../../@seedwork/application/use-case"
import CategoryRepository from "../../domain/repository/category.repository"
import { CategoryOutputMapper } from "../dto/category-output.dto"

export type InputGetCategoryUseCase = {
    id: string
}

export type OutputDeleteCategoryUseCase = void

export default class DeleteCategoryUseCase implements UseCase<InputGetCategoryUseCase,OutputDeleteCategoryUseCase> {
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(input: InputGetCategoryUseCase): Promise<OutputDeleteCategoryUseCase>{
        const category = await this.categoryRepository.findById(input.id)
        await this.categoryRepository.delete(category.id)
    }
}