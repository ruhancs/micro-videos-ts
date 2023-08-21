import UseCase from "../../../@seedwork/application/use-case"
import CategoryRepository from "../../domain/repository/category.repository"

export namespace DeleteCategoryUseCase {
    export type InputDeleteCategoryUseCase = {
        id: string
    }
    
    export type OutputDeleteCategoryUseCase = void
    
    export class DeleteCategoryUseCase implements UseCase<InputDeleteCategoryUseCase,OutputDeleteCategoryUseCase> {
        constructor(private categoryRepository: CategoryRepository) {}
    
        async execute(input: InputDeleteCategoryUseCase): Promise<OutputDeleteCategoryUseCase>{
            const category = await this.categoryRepository.findById(input.id)
            await this.categoryRepository.delete(category.id)
        }
    }
}

export default DeleteCategoryUseCase
