import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import UniqueEntityId from "../value-objects/unique-entity-id.value-obj";
import { RepositoryInterface, SearchParams, SearchResult, SearchableRepositoryInterface, SortDirection } from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
    async bulkInsert(entities: E[]): Promise<void> {
        this.items.push(...entities)
    }
    items: E[] = []
    async insert(entity: E): Promise<void> {
        this.items.push(entity)
    }
    async findById(id: string | UniqueEntityId): Promise<E> {
        const _id = `${id}`//converter o id para string implementado na classe abstrata ValueObject
        
        return this._get(_id)
    }
    async findAll(): Promise<E[]> {
        return this.items
    }
    async update(entity: E): Promise<void> {
        await this._get(entity.id)
        const index = this.items.findIndex(i => i.id === entity.id)
        this.items[index] = entity
    }
    async delete(id: string | UniqueEntityId): Promise<void> {
        const _id = `${id}`//converter o id para string implementado na classe abstrata ValueObject
        await this._get(_id)
        const index = this.items.findIndex(i => i.id === _id)
        this.items.splice(index, 1)
    }

    protected async _get(id: string): Promise<E> {
        const item = this.items.find(item => item.id === id)
        if(!item) {
            throw new NotFoundError(`Entity not found with this id: ${id}`) 
        }
        return item
    }
}

export abstract class InMemorySearchableRepository<E extends Entity, Filter = string> 
    extends InMemoryRepository<E> 
    implements SearchableRepositoryInterface<E, Filter>{

    sortableFields: string[] = [];
    
    async search(props: SearchParams<Filter>): Promise<SearchResult<E, Filter>> {
        const itemsFiltered = await this.applyFilter(this.items, props.filter)
        const itemsSorted = await this.applySort(itemsFiltered, props.sort, props.sort_dir)
        const itemsPaginated = await this.applyPaginate(itemsSorted,props.page,props.per_page)

        return new SearchResult({
            items: itemsPaginated,
            total: itemsFiltered.length,
            current_page: props.page,
            per_page: props.per_page,
            sort: props.sort,
            sort_dir: props.sort_dir,
            filter: props.filter
        })
    }

    protected abstract applyFilter(items: E[], filter: Filter | null): Promise<E[]>;

    protected async applySort(items: E[], sort: string | null, sort_dir: SortDirection | null): Promise<E[]>{
        if(!sort || !this.sortableFields.includes(sort)) {
            return items;
        }
        
        return [...items].sort((a, b) => {
            if(a.props[sort] < b.props[sort]) {
                return sort_dir === "asc" ? -1 : 1;
            }
            if(a.props[sort] > b.props[sort]) {
                return sort_dir === "asc" ? 1 : -1;
            }
            return 0;
        })
        
    };
    
    protected async applyPaginate(items: E[], page: SearchParams['page'], per_page: SearchParams['per_page']): Promise<E[]>{
        const start = (page - 1) * per_page
        const limit = start + per_page
        return items.slice(start,limit)
    };
}