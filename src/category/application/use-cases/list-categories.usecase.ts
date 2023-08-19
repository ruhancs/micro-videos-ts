import UseCase from "../../../@seedwork/application/use-case"
import CategoryRepository, { CategorySearchParams, CategorySearchResult } from "../../domain/repository/category.repository"
import { SearchInputDto } from "../../../@seedwork/application/dto/search-input";
import { CategoryOutputMapper, OutputCatgeoryUseCase } from "../dto/category-output.dto";
import { PaginationOutputDto, PaginationOutputMapper } from "../../../@seedwork/application/dto/pagination-output";

export type InputListCategoriesUseCase = SearchInputDto

export type OutputListCategoriesUseCase = PaginationOutputDto<OutputCatgeoryUseCase>

export default class ListCategoriesUseCase implements UseCase<InputListCategoriesUseCase,OutputListCategoriesUseCase> {
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(input: InputListCategoriesUseCase): Promise<OutputListCategoriesUseCase>{
        const params = new CategorySearchParams(input)
        const searchResult = await this.categoryRepository.search(params)
        return this.toOutput(searchResult)
    }

    private toOutput(searchResult: CategorySearchResult): OutputListCategoriesUseCase {
        return {
            items: searchResult.items.map((category) => CategoryOutputMapper.toCategoryItemOutput(category)),
            ...PaginationOutputMapper.toPaginationOutput(searchResult)
        }
    }
}