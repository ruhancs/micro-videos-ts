import Entity from "../../entity/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
    name: string;
    price: number;
}

class StubEntity extends Entity<StubEntityProps> {
    toJSON(): Required<{ id: string; } & StubEntityProps> {
        return {
            id: this.id,
            name: this.props.name,
            price: this.props.price
        }
    }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity>{
    sortableFields: string[] = ['name'];
    
    protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
       if(!filter){
        return items
       }

       return items.filter((i) => {
        return (
            i.props.name.toLowerCase().includes(filter.toLowerCase()) || 
                i.props.price.toString() === filter
        )
       })
    }
    
}

describe('InMemorySearchableRepository unit test', () => {
    let repository: StubInMemorySearchableRepository
    beforeEach(() => repository = new StubInMemorySearchableRepository())
    describe('applyFilter method test', () => {
        it('should return all items with filter param is null', async() => {
            const items = [new StubEntity({name: 'N1', price: 5}),new StubEntity({name: 'N2', price: 10})]
            const spyFilterMethod = jest.spyOn(items, 'filter' as any)
            
            //inserir items no repositorio e filtro sera null
            const itemsFiltered = await repository['applyFilter'](items,null)
            
            expect(itemsFiltered).toStrictEqual(items)
            expect(spyFilterMethod).not.toHaveBeenCalled()
        })

        it('should filter items using a filter param', async() => {
            const items = [new StubEntity({name: 'N1', price: 5}), new StubEntity({name: 'n1', price: 5}), new StubEntity({name: 'N2', price: 10})]
            const spyFilterMethod = jest.spyOn(items, 'filter' as any)
            
            //inserir items no repositorio e filtro sera null
            let itemsFiltered = await repository['applyFilter'](items,'N1')
            
            expect(itemsFiltered).toStrictEqual([items[0], items[1]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(1)
            
            //inserir items no repositorio e filtro sera null
            itemsFiltered = await repository['applyFilter'](items,'5')
            
            expect(itemsFiltered).toStrictEqual([items[0], items[1]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(2)
            
            //inserir items no repositorio e filtro sera null
            itemsFiltered = await repository['applyFilter'](items,'no-filter')
            
            expect(itemsFiltered).toHaveLength(0)
            expect(spyFilterMethod).toHaveBeenCalledTimes(3)
        })
    })

    describe('applySort method test', () => {
        it('should return item without sort items', async() => {
            const items = [new StubEntity({name: 'b', price: 5}), new StubEntity({name: 'c', price: 15}), new StubEntity({name: 'a', price: 10})]

            //inserir items no repositorio e filtro sera null
            let itemsSorted = await repository['applySort'](items,null, null)
            expect(itemsSorted).toStrictEqual(items)
            
            itemsSorted = await repository['applySort'](items,'price', 'asc')
            expect(itemsSorted).toStrictEqual(items)
        })

        it('should order items by name', async () => {
            const items = [new StubEntity({name: 'b', price: 5}), new StubEntity({name: 'c', price: 15}), new StubEntity({name: 'a', price: 10})]

            //inserir items no repositorio e filtro sera null
            let itemsSorted = await repository['applySort'](items,'name', 'asc')
            expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])
            
            itemsSorted = await repository['applySort'](items,'name', 'desc')
            expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])
        })
    })

    describe('applyPaginate method test', () => {
        it('should test paginate props', async() => {
            const items = [
                new StubEntity({name: 'b', price: 5}), 
                new StubEntity({name: 'c', price: 15}), 
                new StubEntity({name: 'a', price: 10}),
                new StubEntity({name: 'd', price: 10}),
                new StubEntity({name: 'e', price: 10}),
            ]
    
            //inserir items no repositorio e aplica paginacao e pega o resutado da pagina 1 com 2 items
            let itemPaginated = await repository['applyPaginate'](items,1, 2)
            expect(itemPaginated).toStrictEqual([items[0], items[1]])
            
            itemPaginated = await repository['applyPaginate'](items,2, 2)
            expect(itemPaginated).toStrictEqual([items[2], items[3]])
            
            itemPaginated = await repository['applyPaginate'](items,3, 2)
            expect(itemPaginated).toStrictEqual([items[4]])
        })
    })

    describe('search method test', () => {
        it('should apply only paginate paginate with no param', async () => {
            const entity = new StubEntity({name: 'f', price: 5})
            const items = Array(16).fill(entity)
            repository['items'] = items

            const result = await repository.search(new SearchParams())
            expect(result).toStrictEqual(new SearchResult({
                items: Array(15).fill(entity),
                total: 16,
                current_page: 1,
                per_page: 15,
                sort: null,
                sort_dir: null,
                filter: null,
            }))
        })

        it('should apply paginate and filter', async () => {
            const items = [
                new StubEntity({name: 'N2', price: 5}), 
                new StubEntity({name: 'N3', price: 15}), 
                new StubEntity({name: 'n1', price: 10}),
                new StubEntity({name: 'N1', price: 10}),
                new StubEntity({name: 'N1', price: 10}),
            ]
            repository['items'] = items

            let result = await repository.search(new SearchParams({
                page: 1,
                per_page: 2,
                filter: 'N1'
            }))
            expect(result).toStrictEqual(new SearchResult({
                items: [items[2], items[3]],
                total: 3,
                current_page: 1,
                per_page: 2,
                sort: null,
                sort_dir: null,
                filter: 'N1',
            }))
            
            result = await repository.search(new SearchParams({
                page: 2,
                per_page: 2,
                filter: 'N1'
            }))
            expect(result).toStrictEqual(new SearchResult({
                items: [items[4]],
                total: 3,
                current_page: 2,
                per_page: 2,
                sort: null,
                sort_dir: null,
                filter: 'N1',
            }))
        })
        
        it('should apply paginate and sort', async () => {
            const items = [
                new StubEntity({name: 'b', price: 5}), 
                new StubEntity({name: 'c', price: 15}), 
                new StubEntity({name: 'a', price: 10}),
                new StubEntity({name: 'd', price: 10}),
                new StubEntity({name: 'e', price: 10}),
            ]
            repository['items'] = items

            const arrange = [
                {
                    params: new SearchParams({page: 1, per_page: 2, sort: 'name'}),
                    result: new SearchResult({
                        items: [items[2], items[0]],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    })
                },
                {
                    params: new SearchParams({page: 2, per_page: 2, sort: 'name'}),
                    result: new SearchResult({
                        items: [items[1], items[3]],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    })
                },
                {
                    params: new SearchParams({page: 1, per_page: 2, sort: 'name', sort_dir: 'desc'}),
                    result: new SearchResult({
                        items: [items[4], items[3]],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                        filter: null,
                    })
                },
                {
                    params: new SearchParams({page: 2, per_page: 2, sort: 'name', sort_dir: 'desc'}),
                    result: new SearchResult({
                        items: [items[1], items[0]],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'desc',
                        filter: null,
                    })
                },
            ]

            for(const i of arrange) {
                let result = await repository.search(i.params)
                expect(result).toStrictEqual(i.result)
            }

            
        })

        it('should apply filter, sort and paginate', async() => {
            const items = [
                new StubEntity({name: 'test', price: 5}), 
                new StubEntity({name: 'c', price: 15}), 
                new StubEntity({name: 'a', price: 10}),
                new StubEntity({name: 'Test', price: 10}),
                new StubEntity({name: 'Test', price: 10}),
                new StubEntity({name: 'b', price: 10}),
            ]
            repository['items'] = items

            const arrange = [
                {
                    params: new SearchParams({page: 1, per_page: 2, sort: 'name', filter: 'TEST'}),
                    result: new SearchResult({
                        items: [items[3], items[4]],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: 'TEST',
                    })
                },
                {
                    params: new SearchParams({page: 2, per_page: 2, sort: 'name', filter: 'TEST'}),
                    result: new SearchResult({
                        items: [items[0]],
                        total: 3,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: 'TEST',
                    })
                },
            ]

            for(const i of arrange) {
                let result = await repository.search(i.params)
                expect(result).toStrictEqual(i.result)
            }
        })
    })
})