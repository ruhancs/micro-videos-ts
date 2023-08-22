import UseCase from "../../../@seedwork/application/use-case"
import {CategoryRepository} from "../../domain/repository/category.repository"
import { CategoryOutputMapper } from "../dto/category-output.dto"

export namespace GetCategoryUseCase {
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
    
    export class GetCategoryUseCase implements UseCase<InputGetCategoryUseCase,OutputGetCategoryUseCase> {
        constructor(private categoryRepository: CategoryRepository) {}
    
        async execute(input: InputGetCategoryUseCase): Promise<OutputGetCategoryUseCase>{
            const category = await this.categoryRepository.findById(input.id)
            return CategoryOutputMapper.toCategoryItemOutput(category)
        }
    }
}

export default GetCategoryUseCase
