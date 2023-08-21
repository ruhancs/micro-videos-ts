import CategoryRepository from "../../domain/repository/category.repository"
import UseCase from "../../../@seedwork/application/use-case"
import { CategoryOutputMapper } from "../dto/category-output.dto"
import ListAllCategoriesUseCase from "./list-categories.usecase"

export namespace UpdateCategoryUseCase {
    export type InputUpdateCategoryUseCase = {
        id: string
        name: string
        description?: string
        is_active?: boolean
    }
    
    export type OutputUpdateCategoryUseCase = {
        id: string
        name: string
        description: string | null
        is_active: boolean
        created_at: Date
    }
    
    export class UpdateCategoryUseCase implements UseCase<InputUpdateCategoryUseCase,OutputUpdateCategoryUseCase> {
        constructor(private categoryRepository: CategoryRepository) {}
    
        async execute(input: InputUpdateCategoryUseCase): Promise<OutputUpdateCategoryUseCase>{
            const category = await this.categoryRepository.findById(input.id)
            category.update(input.name,input.description)
            if(input.is_active === true) {
                category.active()
            }
            if(input.is_active === false) {
                category.deactive()
            }
    
            await this.categoryRepository.update(category)
            return CategoryOutputMapper.toCategoryItemOutput(category)
        }
    }

}

export default ListAllCategoriesUseCase
