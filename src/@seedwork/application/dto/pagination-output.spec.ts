import { SearchResult } from "../../domain/repository/repository-contracts"
import { PaginationOutputMapper } from "./pagination-output"

describe('PaginationOutputMapper unit test', () => {
    it('should convert a search resut in output', () => {
        const created_at = new Date()
        const searchResult = new SearchResult({
            items: ['mock'] as any,
            total: 1,
            current_page: 1,
            per_page: 1,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'no filter'
        })

        const out = PaginationOutputMapper.toPaginationOutput(searchResult)
        expect(out).toStrictEqual({
            total: 1,
            current_page: 1,
            last_page: 1,
            per_page: 1
        })
    })
})