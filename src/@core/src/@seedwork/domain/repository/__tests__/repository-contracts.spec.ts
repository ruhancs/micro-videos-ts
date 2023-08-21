import { SearchParams, SearchResult } from "../repository-contracts"

describe('SearchParams unit tests', () => {
    it('should test page props', () => {
        const params = new SearchParams()
        expect(params.page).toBe(1)

        const arrange: { page: any; expected: any }[] = [
            {page: null, expected: 1},
            {page: undefined, expected: 1},
            {page: "", expected: 1},
            {page: "null", expected: 1},
            {page: 0, expected: 1},
            {page: -1, expected: 1},
            {page: 5.5, expected: 1},
            {page: true, expected: 1},
            {page: {}, expected: 1},
            
            {page: 1, expected: 1},
            {page: 3, expected: 3},
        ]

        arrange.forEach((item: { page: any; expected: any }) => {
            expect(new SearchParams({page: item.page}).page).toBe(item.expected)
        })
    })
    
    it('should test per_page props', () => {
        const params = new SearchParams()
        expect(params.per_page).toBe(15)

        const arrange: { per_page: any; expected: any }[] = [
            {per_page: null, expected: 15},
            {per_page: undefined, expected: 15},
            {per_page: "", expected: 15},
            {per_page: "null", expected: 15},
            {per_page: 0, expected: 15},
            {per_page: -15, expected: 15},
            {per_page: 5.5, expected: 15},
            {per_page: {}, expected: 15},
            {per_page: true, expected: 15},
            
            {per_page: 17, expected: 17},
            {per_page: 3, expected: 3},
        ]

        arrange.forEach((item: { per_page: any; expected: any }) => {
            expect(new SearchParams({per_page: item.per_page}).per_page).toBe(item.expected)
        })
    })
    
    it('should test sort props', () => {
        const params = new SearchParams()
        expect(params.sort).toBe(null)

        const arrange: { sort: any; expected: any }[] = [
            {sort: null, expected: null},
            {sort: undefined, expected: null},
            {sort: "", expected: null},
            {sort: 0, expected: "0"},
            {sort: 2, expected: "2"},
            {sort: 5.5, expected: "5.5"},
            {sort: {}, expected: "[object Object]"},
            {sort: true, expected: "true"},   
            {sort: 17, expected: "17"},
            {sort: 3, expected: "3"},
            
            {sort: "field", expected: "field"},
        ]

        arrange.forEach((item: { sort: any; expected: any }) => {
            expect(new SearchParams({sort: item.sort}).sort).toBe(item.expected)
        })
    })
    
    it('should test sort_dir props', () => {
        let params = new SearchParams()
        expect(params.sort_dir).toBe(null)
        
        params = new SearchParams({sort: null})
        expect(params.sort_dir).toBe(null)
        params = new SearchParams({sort: ""})
        expect(params.sort_dir).toBe(null)
        params = new SearchParams({sort: undefined})
        expect(params.sort_dir).toBe(null)

        const arrange: { sort_dir: any; expected: any }[] = [
            {sort_dir: null, expected: "asc"},
            {sort_dir: undefined, expected: "asc"},
            {sort_dir: "", expected: "asc"},
            {sort_dir: 0, expected: "asc"},
            {sort_dir: 2, expected: "asc"},
            {sort_dir: 5.5, expected: "asc"},
            {sort_dir: {}, expected: "asc"},
            {sort_dir: true, expected:"asc"},   
            {sort_dir: "Asc", expected: "asc"},
            {sort_dir: "DESC", expected: "desc"},

            {sort_dir: "desc", expected: "desc"},
        ]

        arrange.forEach((item: { sort_dir: any; expected: any }) => {
            expect(new SearchParams({sort: "field", sort_dir: item.sort_dir}).sort_dir).toBe(item.expected)
        })
    })

    it('should test filter props', () => {
        const params = new SearchParams()
        expect(params.filter).toBe(null)

        const arrange: { filter: any; expected: any }[] = [
            {filter: null, expected: null},
            {filter: undefined, expected: null},
            {filter: "", expected: null},
            {filter: "null", expected: "null"},
            {filter: 0, expected: "0"},
            {filter: -15, expected: "-15"},
            {filter: 5.5, expected: "5.5"},
            {filter: {}, expected: "[object Object]"},
            {filter: true, expected: "true"},
            
            {filter: "field", expected: "field"},
        ]

        arrange.forEach((item: { filter: any; expected: any }) => {
            expect(new SearchParams({filter: item.filter}).filter).toBe(item.expected)
        })
    })
})

describe('SearchResult unit tests', () => {
    it('should test constructor props', () => {
        let result = new SearchResult({
            items: ["entity1", "entity2"] as any,
            total: 4,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null
        })

        expect(result.toJSON()).toStrictEqual({
            items: ["entity1", "entity2"] as any,
            total: 4,
            current_page: 1,
            per_page: 2,
            last_page: 2,
            sort: null,
            sort_dir: null,
            filter: null
        })
        
        result = new SearchResult({
            items: ["entity1", "entity2"] as any,
            total: 4,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "test"
        })

        expect(result.toJSON()).toStrictEqual({
            items: ["entity1", "entity2"] as any,
            total: 4,
            current_page: 1,
            per_page: 2,
            last_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "test"
        })
    })

    it('should test logic last_page', () => {
        let result = new SearchResult({
            items: [] as any,
            total: 4,
            current_page: 1,
            per_page: 15,
            sort: null,
            sort_dir: null,
            filter: null
        })
        expect(result.last_page).toBe(1)

        result = new SearchResult({
            items: [] as any,
            total: 101,
            current_page: 1,
            per_page: 20,
            sort: null,
            sort_dir: null,
            filter: null
        })
        expect(result.last_page).toBe(6)
    })
})